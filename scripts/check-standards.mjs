import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = ["app", "components", "lib", "data", "scripts"];
const priceNames = new Set(["calculateTripPrice", "calculatePackagePrice"]);
const priceModules = [
  "data/pricing",
  "data/pricing_copy",
  "data/pricing_old",
  "data/pricing_old_1",
  "lib/calculatePackagePrice",
];

const findings = [];

function relOf(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function isScreen(rel) {
  if (rel.startsWith("app/api/")) return false;
  return rel.startsWith("app/") || rel.startsWith("components/");
}

function checksNames(rel) {
  return (
    rel.startsWith("lib/") ||
    rel.startsWith("app/office/") ||
    rel.startsWith("app/api/") ||
    rel.startsWith("components/office/") ||
    rel.startsWith("scripts/")
  );
}

function normalizeSpec(spec) {
  return spec.replaceAll("\\", "/").replace(/\.(tsx|ts|jsx|js|mjs)$/, "");
}

function importsModule(spec, modulePath) {
  const normalized = normalizeSpec(spec);
  return normalized === modulePath || normalized.endsWith("/" + modulePath) || normalized.includes("/" + modulePath + "/");
}

function add(file, line, rule, detail) {
  findings.push({ file, line, rule, detail });
}

function lineOf(source, node) {
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
}

function hasExport(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function badName(text) {
  return text.startsWith("_") || text.endsWith("_");
}

function apiLiteral(node) {
  if (!node) return "";
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    if (node.text === "/api" || node.text.startsWith("/api/")) return node.text;
  }
  if (ts.isTemplateExpression(node) && (node.head.text === "/api" || node.head.text.startsWith("/api/"))) {
    return node.head.text;
  }
  return "";
}

function isFetch(node) {
  if (!ts.isCallExpression(node)) return false;
  const callee = node.expression;
  if (ts.isIdentifier(callee)) return callee.text === "fetch";
  return ts.isPropertyAccessExpression(callee) && callee.name.text === "fetch";
}

function walk(dir, files) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, files);
      continue;
    }
    if (/\.(tsx|ts|mjs|js)$/.test(name) && !name.endsWith(".d.ts")) files.push(full);
  }
}

function scriptKind(file) {
  if (file.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (file.endsWith(".ts")) return ts.ScriptKind.TS;
  return ts.ScriptKind.JS;
}

function checkFile(file) {
  const rel = relOf(file);
  const text = readFileSync(file, "utf8");
  if (rel.startsWith("data/") && !text.includes("calculateTripPrice") && !text.includes("calculatePackagePrice")) {
    return;
  }
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false, scriptKind(file));
  const screen = isScreen(rel);
  const names = checksNames(rel);
  const priceFile = rel !== "lib/quote.ts";

  function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      const line = lineOf(source, node);
      if (screen && (importsModule(spec, "lib/content") || importsModule(spec, "lib/rates"))) {
        add(rel, line, "http", `imports ${spec}. A screen calls app/api with fetch and API_BASE_URL.`);
      }
      if (screen && priceModules.some((modulePath) => importsModule(spec, modulePath))) {
        add(rel, line, "price", `imports ${spec}. Price rules stay in lib/quote.ts.`);
      }
      if (rel.startsWith("app/api/") && importsModule(spec, "lib/auth/permissions")) {
        add(rel, line, "role", `imports ${spec}. Role checks stay in lib/.`);
      }
    }

    if (screen && isFetch(node)) {
      const literal = apiLiteral(node.arguments[0]);
      if (literal) {
        add(rel, lineOf(source, node), "fetch", `fetch("${literal}") does not use apiPath().`);
      }
    }

    if (names && ts.isIdentifier(node) && badName(node.text)) {
      add(rel, lineOf(source, node), "name", `name "${node.text}" starts or ends with _.`);
    }

    if (priceFile && ts.isFunctionDeclaration(node) && hasExport(node) && node.name && priceNames.has(node.name.text)) {
      add(rel, lineOf(source, node.name), "price", `exports ${node.name.text}. The only price function is buildQuote in lib/quote.ts.`);
    }

    if (priceFile && ts.isVariableStatement(node) && hasExport(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && priceNames.has(declaration.name.text)) {
          add(rel, lineOf(source, declaration.name), "price", `exports ${declaration.name.text}. The only price function is buildQuote in lib/quote.ts.`);
        }
      }
    }

    if (priceFile && ts.isExportSpecifier(node)) {
      const exported = node.name.text;
      const local = node.propertyName?.text ?? exported;
      if (priceNames.has(exported) || priceNames.has(local)) {
        add(rel, lineOf(source, node), "price", `exports ${priceNames.has(exported) ? exported : local}. The only price function is buildQuote in lib/quote.ts.`);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
}

function gitFiles(args) {
  const output = execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", ...args], { cwd: root, encoding: "utf8" });
  return output.split("\n").map((line) => line.trim()).filter(Boolean);
}

function changedFiles(args) {
  if (args.length === 0) return null;
  if (args[0] === "--staged" && args.length === 1) return gitFiles(["--cached"]);
  if (args[0] === "--since" && args.length === 2) return gitFiles([`${args[1]}...HEAD`]);
  console.error("Use: check-standards.mjs, check-standards.mjs --staged, or check-standards.mjs --since <base>.");
  process.exit(2);
}

const changed = changedFiles(process.argv.slice(2));
const files = [];
if (changed) {
  for (const rel of changed) {
    const inRoot = roots.some((dir) => rel.startsWith(dir + "/"));
    if (!inRoot || rel.includes("node_modules/") || rel.endsWith(".d.ts") || !/\.(tsx|ts|mjs|js)$/.test(rel)) continue;
    const full = path.join(root, rel);
    if (statSync(full, { throwIfNoEntry: false })?.isFile()) files.push(full);
  }
} else {
  for (const dir of roots) {
    const full = path.join(root, dir);
    if (statSync(full, { throwIfNoEntry: false })?.isDirectory()) walk(full, files);
  }
}

for (const file of files) checkFile(file);

const order = ["http", "fetch", "price", "role", "name"];
const titles = {
  http: "A screen reaches data only by HTTP.",
  fetch: "A screen calls the API with fetch and API_BASE_URL.",
  price: "The only price function is lib/quote.ts.",
  role: "Role checks stay in lib/. The API route does not import lib/auth/permissions.",
  name: "A name must not start or end with _.",
};

const seen = new Set();
const unique = findings.filter((item) => {
  const key = `${item.rule}\0${item.file}\0${item.line}\0${item.detail}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

if (unique.length === 0) {
  console.log(changed ? `Standards check passed for ${files.length} changed files.` : "Standards check passed.");
  process.exit(0);
}

console.error("Standards check failed. See docs/rules/project-structure.md and docs/rules/coding-standards.md.\n");
for (const rule of order) {
  const items = unique.filter((item) => item.rule === rule);
  if (items.length === 0) continue;
  items.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  console.error(titles[rule]);
  for (const item of items) {
    console.error(`- ${item.file}:${item.line} ${item.detail}`);
  }
  console.error("");
}
process.exit(1);

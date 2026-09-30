import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function blockedReason(name) {
  const normalized = name.trim().replaceAll("\\", "/");
  const base = normalized.split("/").pop()?.toLowerCase() ?? "";
  if (base === ".env.example") return "";
  if (base === ".env" || base.startsWith(".env.")) {
    return `${normalized}: do not commit an env file. Commit .env.example with empty values only.`;
  }
  const lower = normalized.toLowerCase();
  if (lower === "resources" || lower.startsWith("resources/")) {
    return `${normalized}: do not commit the resources folder.`;
  }
  if (
    (lower === "public/uploads" || lower.startsWith("public/uploads/")) &&
    !lower.endsWith(".gitkeep")
  ) {
    return `${normalized}: do not commit uploaded files.`;
  }
  if (lower === "prisma" || lower.startsWith("prisma/")) {
    return `${normalized}: do not commit Prisma. The live schema is lib/db/schema.ts.`;
  }
  return "";
}

const isDirect = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirect) {
  const names = execSync("git diff --cached --name-only --diff-filter=ACMR", {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const blocked = names.map(blockedReason).filter(Boolean);
  if (blocked.length > 0) {
    console.error("Commit blocked:\n" + blocked.map((line) => `- ${line}`).join("\n"));
    process.exit(1);
  }
}

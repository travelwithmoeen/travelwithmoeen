import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noServerAction = {
  selector: "ExpressionStatement > Literal[value='use server']",
  message:
    "Do not add a server action. Put the rule in lib/ and call it from app/api. See docs/rules/project-structure.md.",
};

const noPrisma = {
  group: ["@prisma/client", "prisma", "prisma/**"],
  message: "The live schema is lib/db/schema.ts. Do not import Prisma.",
};

const styleRules = {
  "no-var": "error",
  eqeqeq: ["error", "always", { null: "ignore" }],
  "@typescript-eslint/no-explicit-any": "error",
  "no-restricted-syntax": ["error", noServerAction],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ignores: ["app/api/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/lib/db",
                "@/lib/db/**",
                "@/lib/office",
                "@/lib/office/**",
                "@/lib/auth",
                "@/lib/auth/**",
                "**/lib/db",
                "**/lib/db/**",
                "**/lib/office",
                "**/lib/office/**",
                "**/lib/auth",
                "**/lib/auth/**",
              ],
              message:
                "A screen calls app/api with fetch. Do not import lib/db, lib/office, or lib/auth. See docs/rules/project-structure.md.",
            },
            noPrisma,
          ],
        },
      ],
      "no-restricted-syntax": ["error", noServerAction],
    },
  },
  {
    files: ["lib/**/*.{ts,tsx}"],
    rules: {
      ...styleRules,
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components",
                "@/components/**",
                "@/app",
                "@/app/**",
                "**/components",
                "**/components/**",
                "**/app",
                "**/app/**",
              ],
              message:
                "lib/ must not import components/ or app/. See docs/rules/project-structure.md.",
            },
            noPrisma,
          ],
        },
      ],
    },
  },
  {
    files: [
      "app/api/**/*.{ts,tsx}",
      "app/office/**/*.{ts,tsx}",
      "components/office/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
      "proxy.ts",
    ],
    rules: styleRules,
  },
  {
    files: ["app/api/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}", "proxy.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [noPrisma] }],
    },
  },
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "data/**/*.{ts,tsx}"],
    ignores: ["app/api/**", "app/office/**", "components/office/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      eqeqeq: "off",
    },
  },
]);

export default eslintConfig;

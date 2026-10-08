# Coding standards

**Rule:** TWM-RULE-STANDARDS  
**Proposal:** TWM-SOW-001, version 1.3

New code follows the published rules below. Where an old file already breaks a rule, do not reformat the whole file in the same change. Google's guide says a style-only edit must not hide the real change. New lines in that file still follow the rules.

## Sources

| Source | What we take from it |
|---|---|
| [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) | The TypeScript rules in this file. The guide uses [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) words: must, must not, should. |
| [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure) | Route file names (`page`, `layout`, `route`) and `proxy.ts`. |
| [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) | Why the rules exist: maintainability, reliability, and security of the product. |
| [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html) | Verification is its own process. A pull request includes a check, not only new screens. |

## TypeScript rules we follow

These are taken from the Google TypeScript Style Guide.

| Rule | Project meaning |
|---|---|
| Source files are UTF-8. | Save every `.ts` and `.tsx` file as UTF-8. |
| Use `const` by default. Use `let` only when the value changes. Never use `var`. | Same. |
| One variable per declaration. | Do not write `let a = 1, b = 2`. |
| Do not use the `Array` constructor. | Write `[]` or a list. |
| Always use `===` and `!==`. | A check against `null` may use `==` so it also covers `undefined`, as the guide allows. |
| Names use ASCII letters and digits. | No decorated names. |
| `UpperCamelCase` for classes, interfaces, types, enums, and component functions. | `TourForm`, `SessionUser`. Do not prefix an interface with `I`. |
| `lowerCamelCase` for variables, parameters, functions, and methods. | `getTour`, `canEditContent`. |
| `CONSTANT_CASE` for module-level constants. | `MAX_AGE_SECONDS`. |
| Do not start or end a name with `_`. | Unused values are omitted. Do not name a parameter `_`. |
| Names are descriptive. Do not delete letters inside a word. | `customerId`, not `cstmrId`. `errorCount`, not `nErr`. |
| Treat an abbreviation as one word. | `loadHttpUrl`, not `loadHTTPURL`. `customerId`, not `customerID`. |
| Do not use `any` unless you must. Prefer a named type or `unknown`. | If `any` remains, add a short comment that says why. |
| A file is ordered as imports, then the implementation. | One blank line between those parts. |
| Be consistent with the file you are editing. | A new file follows this guide. A small edit to an old file matches that file and does not break these rules. |

## Service boundary

A screen calls an HTTP route in `app/api/` with `fetch` and `API_BASE_URL`. The route calls a function in `lib/`. Do not put a business rule in a server action or in a component. This includes Step 1. See `docs/rules/project-structure.md`.

## Rules from Next.js

- A URL exists only where there is a `page.tsx` or a `route.ts`.
- `layout.tsx` wraps the pages under that folder.
- `app/office/(panel)/` is a route group. The folder name is not part of `/office`.
- `proxy.ts` exports `proxy`. Do not add a second `middleware.ts`.

## Rules from the quality model

ISO/IEC 25010 asks for maintainability and security. In this project that means:

- One price function, `lib/quote.ts`, when Step 2 starts. Do not copy the formula into a component.
- Role checks live in `lib/auth/permissions.ts` and run inside the server write.
- Secrets stay in `.env`. Do not print them and do not commit them.
- Office uploads follow BR-59 in Step 2 (task T-26): file bytes, JPEG, PNG, or WebP, 5 MB maximum. Do not trust the browser file type, and do not leave that check for a later step.
- Login and session follow BR-67 and BR-68. Task T-27 in Step 2 adds the 10-failure lock and the 401 and 403 codes. Do not weaken the cookie, and do not leave the lock for Step 3.
- Database calls use the query builder. Do not build SQL by joining strings.

Before a step is accepted, the four tests in `docs/specs/requirements.md` section 12 must pass. SAST is `npm run lint`, including no `eval` and no raw HTML insert, plus the pre-commit secret-file check. SCA is `npm run check:sca` on production dependencies. DAST is the OWASP ZAP baseline with no High alert, and it must reach `/office/login`. IAST is the step script against the running site. Each later run keeps the older cases and adds the new step's cases. The route list in section 13 is who may call each office action. A new route updates that list in the same change.

## Checks while you work, and before a commit

ISO/IEC/IEEE 12207 treats verification as its own process. The markdown rules are the written standard. ESLint and the git hook are what stop a bad change.

While you edit, the editor runs ESLint from `eslint.config.mjs`. A red line means the file breaks a rule. Fix that line before you commit.

The rules ESLint enforces:

- No `var`, no `any`, and `===` instead of `==`, in `lib/`, `app/office/`, `app/api/`, `components/office/`, and `scripts/`. A check against `null` may use `==`.
- A file in `app/` or `components/` must not import `lib/db`, `lib/office`, or `lib/auth`, including a relative import such as `../../lib/db`. `app/api/` may import those.
- `lib/` must not import `components/` or `app/`.
- No `"use server"`. A save goes through `app/api`.
- No Prisma import.

Old public pages are not failed for `any` or `==`. Do not reformat them in the same change. New files follow the table above.

Before `git commit`, the hook in `.husky/pre-commit` runs three checks:

1. `node scripts/check-staged.mjs` rejects a commit that adds an env file in any folder (`.env.example` with empty values is allowed), `resources/`, `public/uploads/` (except `.gitkeep`), or `prisma/`.
2. `node scripts/check-standards.mjs --staged` checks the staged files. `npm run check:standards` checks the whole tree. It rejects the commit when:
   - A file in `app/` or `components/` imports `lib/content` or `lib/rates`. `app/api/` may import those.
   - A file in `app/` or `components/` calls `fetch` on an `/api/` path without `apiPath()`.
   - A file other than `lib/quote.ts` exports `calculateTripPrice` or `calculatePackagePrice`, or a screen imports `data/pricing` or `lib/calculatePackagePrice`.
   - A file in `app/api/` imports `lib/auth/permissions`.
   - A name in `lib/`, `app/office/`, `app/api/`, `components/office/`, or `scripts/` starts or ends with `_`.
3. `lint-staged` runs ESLint on the staged `.ts` and `.tsx` files.

If a check fails, the commit stops. Run `npm install` once so the hook is installed.

## Checks before a pull request

- GitHub runs `node scripts/check-standards.mjs --since origin/<base>` on the pull request. It checks only the files the pull request adds or changes. A changed file must pass in full, including lines that were already there.
- `npm run check:standards` still lists every file that breaks a rule. Those older files are fixed in their own pull request.
- `npm run lint` passes.
- A behavior change has a check script, in the same way `scripts/check-step1.ts` checks Step 1.
- The pull request names the task, such as T-07.
- The pull request does not contain `.env`, `resources/`, or files from `public/uploads/`.

## Old files

Do not rename `/Cancellation`, `/TermsAndConditions`, `/PrivacyPolicy`, or `/TravelersInstructions`. The Google guide says not to reformat a whole legacy file just to make it match. New files follow the table above.

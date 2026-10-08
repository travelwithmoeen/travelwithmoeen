# Step 1 build note for Danish

**Branch:** `step01-office_can_edit_public_pages`  
**Date:** September 30, 2026  
**Read first:** `docs/rules/project-structure.md` and `docs/rules/coding-standards.md`

This note is the Step 1 record. For work after Step 3, read `docs/audit/after-step03.md`.

## What is already in place

Office forms call `app/api/office` with `fetch`. The routes call `lib/office/forms.ts`. The database rules stay in `lib/`. `API_BASE_URL` is empty, so the call stays on the same site. Prisma is removed. The live schema is `lib/db/schema.ts`.

Later tasks must use the same split. Do not add a new save that stays inside one app.

## Do this

1. Pull the latest `main`, then keep working on your branch. Do not work on `main`.
2. Leave the rules in `lib/`. Add a new save as a route under `app/api/` that calls `lib/`.
3. A file in `components/` or in `app/` must not import `lib/db`, `lib/office`, or `lib/auth`. `app/api/` may import those.
4. Read the API host from `API_BASE_URL`. If it is empty, call the same site.
5. Run `npm run check:step1` again. The same checks must still pass.
6. Open a pull request. Do not merge it yourself.

`npm install` turns on the pre-commit hook. A commit stops if a staged screen imports `lib/db`, `lib/office`, or `lib/auth`, if a file contains `"use server"`, or if the commit adds `.env`, `resources/`, uploads, or Prisma. See `docs/rules/coding-standards.md`.

## Do not

- Do not start prices, quotes, or sprint 3 and sprint 4.
- Do not commit `.env` or the `resources` folder.
- Do not put a password in the code.

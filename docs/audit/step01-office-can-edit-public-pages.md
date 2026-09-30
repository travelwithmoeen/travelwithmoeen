# Audit: step01 office can edit public pages

**Date:** September 30, 2026  
**Branch:** `step01-office_can_edit_public_pages`  
**Compared with:** `main`, and the specs for proposal version 1.3  
**Scope:** Step 1 only. Tasks T-01 through T-08. Sprints 3 and 4 were not expected.

The build note for this branch, and for later work, is `docs/audit/step01-build-instructions.md`.

This is a code review. The Step 1 check script was not run against a live database, and the pages were not clicked in a browser.

## Result

Step 1 is built in the right shape. The office screens call `app/api`, and the rules stay in `lib/`. Prisma is gone. Do not merge it yet until the env variable names are in the repo and `npm run check:step1` has been run against a database.

## What matches the specs

| Task | What the spec asks | What the branch does |
|---|---|---|
| T-01 | PostgreSQL and content tables | `docker-compose.yml` starts Postgres. `lib/db/schema.ts` has user, tour, tour day, place, post, photo, review, slide, and site settings. |
| T-02 | Login at `/office/login` with a hashed password and a session | `bcryptjs` hashes the password. The session cookie is `httpOnly`. A wrong password is refused in `scripts/check-step1.ts`. |
| T-03 | Owner, Manager, and Editor, checked on the server | `lib/auth/permissions.ts` matches the role table. An Editor cannot save a price. A Manager cannot save a tour title. |
| T-04 | Owner can create and remove logins. A seed creates the first Owner. The password is not in the repo. | `scripts/seed-owner.ts` reads `OWNER_EMAIL` and `OWNER_PASSWORD` from `.env`. The Users screen is only shown to the Owner. |
| T-05 | Copy current content into the database. Leave the old files in the repo. | `scripts/seed-content.ts` copies tours, days, places, posts, gallery, reviews, home slides, and site details. The `data/` files are still in the repo. Phone and address match the live site. |
| T-06 | Public content pages read the database. About, FAQ, and legal pages stay as they are. | Tours, places, blog, gallery, and the home page load through `lib/content.ts`. `app/about/page.tsx` is still the old page. |
| T-07 | Editor screens for tours, places, blog, gallery, reviews, slides, and site details, including featured. | Those screens exist under `app/office`. A Manager does not see them. |
| T-08 | Step 1 checks | `npm run check:step1` covers the wrong password, the Owner login, creating an Editor and a Manager, the refused price save, the refused tour save, and an Editor title and photo change. |

Prices are still the prices on the site today. That is allowed for Step 1. The quote math in design section 5 was not started. That is correct. Sprint 3 and sprint 4 were not started. That is correct.

## Fix before merge

**1. No env example in the repo.** `.gitignore` ignores `.env` and `.env.example`. The next person cannot see which variables are required. Add a committed `.env.example` with empty values for `DATABASE_URL`, `SESSION_SECRET`, `OWNER_EMAIL`, `OWNER_PASSWORD`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `API_BASE_URL`. Do not put a real password in it.

**2. The office gate only checks that a cookie exists.** `proxy.ts` sends a person with no cookie to `/office/login`. It does not check that the cookie is valid. The office layout asks `/api/office/session` before it shows a page, and that route checks the signed session. Keep that server check.

## Fix in Step 2, not a reason to block Step 1

**Ratti Gali is marked `excel`.** `scripts/seed-content.ts` sets every tour, including code 201, to `priceSource: "excel"`. The spec says code 201 stays on the website price of 150,000. The card still falls back to `basePrice` when the old price function has no row, so the public card can still show 150,000 today. Task T-11 must set code 201 to `website` before live Excel prices are switched.

**The tour card price still uses `lib/calculatePackagePrice.ts` and `data/pricing.ts`.** An Editor change to the title and photo is stored in the database. A change to `basePrice` may not show on the card, because the card prefers the old calculator. That is acceptable until Step 2, when the card must use the one quote function.

## What was not tested

- `npm run check:step1` against a running database
- A browser pass of the public pages and the office screens
- Chrome, Edge, Firefox, and Safari, on a computer and on a phone (task T-24, later)

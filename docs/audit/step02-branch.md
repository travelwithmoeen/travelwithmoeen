# Audit: step-2-security against the Step 2 spec

**Date:** 1 October 2026  
**Branch:** `step-2-security` at `52fec22`  
**Compared with:** `main` at `f4ecd14`, and the specs for proposal version 1.3  
**Scope:** Step 2. Tasks T-09 through T-17, plus T-26, T-27, and T-28.

This is a review. It does not change the code. The pull request gaps are in `docs/audit/step02-pr-2-review.md`.

## Result

The security tasks are present and follow the spec, with the gaps in the pull request review. The price and quote tasks are absent. Step 2 is done when both sets pass. This commit is not the close of Step 2.

## Security tasks

| Task | What the spec asks | What commit `52fec22` does |
|---|---|---|
| T-26 | Read the file bytes. Accept JPEG, PNG, and WebP at or under 5 MB. Refuse SVG and any other type. Refuse a file over 5 MB. The stored name has no folder path. | `saveUploadedImage` checks the bytes, then the size, then writes `public/uploads/<time>-<random>.<kind>`. |
| T-27 | After 10 failed sign-ins for one email inside 15 minutes, refuse the next sign-in until that window ends. Same error text. Log the email and the time, with no password. Logout clears the cookie. Missing session is 401. Wrong role is 403. | The count and the 401 and 403 split are in place. Logout clears the cookie only after `requireUser()` succeeds. The window end is implemented and not proved by the script. |
| T-28 | Lint, `npm run check:sca`, a ZAP baseline with no High alert that reaches `/office/login`, and the step script against the running site. The script keeps the old cases. | The script keeps the Step 1 cases and adds the Step 2 office cases. The author's note says the four commands passed. See the gaps in the pull request review before treating that note as the close of T-28. |

BR-60, BR-61, BR-62, BR-67, and BR-69 still hold on the office paths that exist, except the logout gap in the pull request review. Saves go through `app/api` and `lib/`. Database calls use the query builder. `proxy.ts` still only checks that a cookie exists. The signed check stays in the session read.

## Price and quote tasks

| Task | What the spec asks | What the branch does |
|---|---|---|
| T-09 | Hotel, vehicle, air extra, jeep, and season tables | Those tables are not in `lib/db/schema.ts`. |
| T-10 | Excel import from `resources/Trip Cost Calculator Final - Copy.xlsx`, cell values only | No import. The workbook stays out of git. That part is correct. |
| T-11 | Tour 201, Ratti Gali, stays on the website price of 150,000 | `scripts/seed-content.ts` still sets every tour, including code 201, to `priceSource: "excel"`. |
| T-12 | One quote function. The Skardu test is 140,400 at 20 percent, from a subtotal of 117,000. 15 percent changes only the profit. | `lib/calculatePackagePrice.ts` is still the live path, with the old website amounts. |
| T-13 | Night lines and day lines. A night-two edit changes only that night and the average. Clearing one day removes that day's rent. | No quote lines. |
| T-14 | The calculator, the tour card, the tour page, and the template use the same function. Karachi is not a road start. Ratti Gali still shows 150,000. | Those screens still call `calculatePackagePrice`. |
| T-15 | Manager rate screens. Blank, negative, and non-numeric amounts are refused. Premier is not offered to a guest. | No rate screens. BR-70 is open with those screens. |
| T-16 | Guest pages offer Deluxe, Executive, Luxury, and Ultra Luxury. The template no longer lists Premier. | Premier can still be selected on the template. |
| T-17 | The Step 2 check includes Karachi air 30,000, no Karachi road start, Taobat, Naran, and Ratti Gali, plus T-26 and T-27. | `npm run check:step2` adds T-26 and T-27. It does not add the quote cases. |

BR-63 waits for the Excel import. BR-70 waits for the quote and rate screens.

## Security issues that stay open

- A bad or expired office cookie is not cleared on logout, so `proxy.ts` can still admit that browser to `/office`.
- Failed sign-in depends on a table that is not created until `npm run db:push`. A missing table turns the failure into a 500.
- Anyone who can send ten wrong passwords for a known email can lock that login for 15 minutes. BR-68 requires the lock to be by email. That is the specified behavior, and it is also a way to lock the Owner out.
- Office photos are written under `public/uploads` and served as static files. The type check is the file header. A file that only begins with a JPEG, PNG, or WebP header is stored.
- The public footer links to `/office/login`. That is how a spider can reach the login page. Guests can see the link.
- The ZAP warnings in `docs/audit/step02-security.md` are still missing response headers. They are not High. One `/office/login` response during that scan was a 500.

Chrome, Edge, Firefox, and Safari, on a computer and on a phone, are task T-24. They were not part of this audit.

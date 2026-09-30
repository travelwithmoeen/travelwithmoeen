# Final audit: pull request 1, Step 1

**Document:** TWM-AUDIT-PR1  
**Date:** September 30, 2026  
**Status:** Approved for Step 1. Ready to merge.  
**Pull request:** https://github.com/zeeshan-softbuilds/travelwithmoeen/pull/1  
**Head:** `68af8da` on `step01-office_can_edit_public_pages`  
**Base:** `zeeshan-softbuilds/travelwithmoeen` `main`  
**Scope:** Tasks T-01 through T-08.

## Verdict

Merge this pull request for Step 1. The four items requested in the review are closed. `npm run check:step1` passed on September 30, 2026, including the new calls to `/api/office`.

Do not start Step 2 on this pull request.

## Requested changes

| Item | Commit `68af8da` | Result |
|---|---|---|
| Pull request text used the wrong setup commands | The text now says `npm run db:up`, `npm run db:seed-owner`, `npm run db:seed-content`, and `npm run dev`. It names port 5434. | Closed |
| Commit an empty `.env.example` | `.env.example` is in the repo with empty values for the eight required names. `.gitignore` no longer ignores that file. No password is in it. | Closed |
| Step 1 check must post to the API | `scripts/check-step1.ts` signs in through `/api/office/login`. An Editor post to `/api/office/rates` is refused. A Manager post to `/api/office/tours` is refused. | Closed |
| Tour days must be replaced in one transaction | `updateTourAs` updates the tour, deletes the days, and inserts the new days inside `db.transaction`. | Closed |

## Step 1 alignment

| Task | Result |
|---|---|
| T-01 Database and tables | Met. Postgres on port 5434. Schema is `lib/db/schema.ts` only. |
| T-02 Login | Met. bcrypt, signed `httpOnly` cookie. A wrong password is refused. |
| T-03 Three roles on the server | Met. Editor price save and Manager tour save are refused in `lib/` and through the API. |
| T-04 Owner users and seed | Met. Seed password is not in the repo. |
| T-05 Copy current content | Met. Seed counts matched on this machine. |
| T-06 Public pages read the database | Met. About, FAQ, and the legal pages are unchanged. |
| T-07 Editor screens | Met. The check stored an Editor title and photo and read them back with `getTour`, which the public tour page uses. |
| T-08 Step 1 check | Met. `npm run check:step1` printed `Step 1 server checks passed.` |

Guest requests, Excel import, and the one quote function are not in this pull request. That is correct for Step 1.

## Still open, and not a reason to hold Step 1

- Uploads trust the browser file type and have no size limit. That hole closes in Step 2, task T-26. It is not left open, and it is not a Step 1 merge block.
- There is no screen to add a tour, a place, or a post. Step 1 edits the seeded rows.
- The successful Editor save in the check still calls `lib/` directly. The refusal cases go through the API.
- Ratti Gali is still seeded as an Excel price. The tour card still uses `lib/calculatePackagePrice.ts`. Both are Step 2.
- The public read path is `lib/content.ts`. Office writes go through `app/api`. Keep that split for new saves.

# Audit: pull request 2

**Document:** TWM-AUDIT-PR2  
**Date:** 1 October 2026  
**Status:** Open. Security shape is right. Gaps below stay open.  
**Pull request:** https://github.com/zeeshan-softbuilds/travelwithmoeen/pull/2  
**Head:** `52fec22` on `step-2-security`  
**Base:** `zeeshan-softbuilds/travelwithmoeen` `main`  
**Scope:** Tasks T-26, T-27, and T-28 as they stand in that commit. This review does not change the code.

The branch task table is `docs/audit/step02-branch.md`. Danish's test note is `docs/audit/step02-security.md`.

## Verdict

Hold the merge until the gaps in this file are closed by the author. The upload check and the sign-in lock follow BR-59 and BR-68. The 401 and 403 split follows BR-60 for the office routes that exist. Step 2 prices are outside this pull request.

## What matches

| Task | Result |
|---|---|
| T-26 | `saveUploadedImage` reads the bytes. JPEG, PNG, and WebP are accepted. SVG and any other type are refused. A file over 5 MB is refused. The stored name is a timestamp, random hex, and an extension taken from the bytes. |
| T-27 | Ten failures for one email inside 15 minutes are stored in `login_failures`. The next sign-in is refused, including a correct password. The error text is the same for an unknown email, a wrong password, and a locked email. The log helper is the email and the time. A missing session from `handleOfficeForm` is 401. A wrong role uses `forbidden()` and is 403. |
| T-28 script | `scripts/check-step2.ts` keeps the Step 1 cases and adds the renamed text file, the file over 5 MB, the real JPEG, PNG, and WebP, the 401, the 403, and the 11th sign-in. |

## Gaps

**1. Logout skips the cookie clear when the session is already bad.** `app/api/office/logout/route.ts` returns 401 before `logoutFromForm()`. BR-67 says logout clears the cookie. A stale `twm_office` value stays in the browser. `proxy.ts` treats any cookie as enough to enter `/office`.

**2. The new table is only in `lib/db/schema.ts`.** This project applies schema with `npm run db:push`. The pull request text does not say to run it. Until `login_failures` exists, a wrong password throws on insert and the login route returns 500.

**3. The photo role refusal is a thrown `Error` with a `status` field.** The other role checks return `forbidden()`. `photoError` reads that field. A caller that does not use `photoError` becomes a 500. The Step 2 script does not post a photo as a Manager, so this 403 path is unproved.

**4. `check:step2` starts Step 1 with `spawn("npm", ["run", "check:step1"])` and no shell.** On Windows that spawn fails with `EINVAL` or `ENOENT` before any office check runs. The author's note says the script passed. Confirm it on this machine.

**5. The 15 minute window is not shown to end.** The script proves the 11th failure inside the window. It does not store rows older than 15 minutes and then accept the right password. BR-68 says the refusal lasts until that window ends.

**6. The log line is checked in the script process.** `signInRefusalLine` is compared to a fixed string. The script does not read the dev server log, so it does not prove the running site printed the email and the time and left the password out.

**7. `node_modules` can lag the pin.** `package.json` sets `next` and `eslint-config-next` to 16.3.8. A tree that still has Next 16.1.5 installed will run the old version until `npm install`.

## ZAP, from the author's note

`docs/audit/step02-security.md` says the baseline exited 0 with `FAIL-NEW: 0`, and that one `/office/login` response was a 500 while the spider was busy. `getOfficeSession` calls the host on the incoming request. A scan that uses `Host: host.docker.internal` makes that call fail on a machine that cannot resolve that name. A later request to `/office/login` returned 200 in that note. The warnings listed there are not High. They stay open: clickjacking header, `X-Content-Type-Options`, `X-Powered-By`, Content Security Policy, cache headers, Permissions Policy, and Cross-Origin-Embedder-Policy.

DOMPurify 3.3.1 comes in through `html2pdf.js` and `jspdf`. The finding is moderate, so `npm run check:sca` can still pass. The note names it and leaves it.

## What this review did not treat as a pass

A live `npm run check:step2` in this session ran only after local edits. Those edits were removed. That run is not evidence for commit `52fec22`.

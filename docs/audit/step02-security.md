# Step 2 security note

**Branch:** `step-2-security`  
**Date:** 1 October 2026

`npm run lint` passed. `npm run check:sca` passed. One moderate DOMPurify finding remains. It is below the high bar for that command.

`npm run check:step2` passed against the running site. It kept the Step 1 cases and added the office checks: no cookie returns 401, a wrong role returns 403, a renamed text file is refused, a file over 5 MB is refused, a real JPEG, PNG, and WebP save, and the 11th sign-in inside 15 minutes is refused.

The ZAP baseline finished with exit code 0 and `FAIL-NEW: 0`. It requested the home page and `/office/login`. The spider was given 2 minutes so it could follow the Office link in the footer. These warnings are not High:

- Missing Anti-clickjacking Header
- X-Content-Type-Options Header Missing
- Server leaks `X-Powered-By`
- Content Security Policy header not set
- Storable and cacheable content
- Permissions Policy header not set
- Unix timestamp disclosure in static files
- Modern web application
- Dangerous JS functions in Next.js bundles
- Cross-Origin-Embedder-Policy header missing
- Application error disclosure on one `/office/login` response

That login response was a 500 while the scanner was requesting hundreds of pages at once. `getOfficeSession` could not reach `/api/office/session`. A later request to `/office/login` returned 200.

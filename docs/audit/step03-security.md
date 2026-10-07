# Step 3 security note

**Branch:** `step3-security`  
**Date:** 7 October 2026

`npm run lint` passed. It reported 82 existing warnings and no errors.

`npm run check:sca` passed with no production findings. Two lockfile updates were required before that:

- `source-map-js` moved from 1.2.1 to 1.2.2. Next brings it in through PostCSS. Version 1.2.1 had a high finding for event-loop denial of service through indexed source-map section offsets.
- `dompurify` moved from 3.3.1 to 3.4.16. `html2pdf.js` and `jspdf` already allow `^3.3.1`. Version 3.3.1 had moderate cross-site scripting findings.

`npm run check:step3` passed against the running site. It kept the Step 1 and Step 2 cases. It saves a test booking and reads that row back through `GET /api/office/requests`. A message over 4,000 characters is refused. Book Now opens the WhatsApp link on the click. An Editor can read a guest request and cannot change or delete it. A Manager can change the status and cannot delete it. The Owner can delete it. The public pages do not include the test phone or the stored message.

The ZAP baseline finished with exit code 0 and `FAIL-NEW: 0`. It requested the home page and `/office/login`. The spider was given 2 minutes so it could follow the Office link in the footer. These warnings are not High:

- Missing Anti-clickjacking Header
- X-Content-Type-Options Header Missing
- Information Disclosure - Sensitive Information in URL
- Information Disclosure - Suspicious Comments
- Server leaks `X-Powered-By`
- Content Security Policy header not set
- Storable but non-cacheable content
- Permissions Policy header not set
- Unix timestamp disclosure in static files
- Modern web application
- Dangerous JS functions in Next.js bundles
- Cross-Origin-Embedder-Policy header missing
- Application error disclosure on one `/office/login` response

The URL warning is one `/contact` request that ZAP built with a name, email, subject, and message in the query string. The contact form saves with POST. The page does not read those query fields.

That login response was a 500 while the scanner was requesting hundreds of pages at once. A later request to `/office/login` returned 200.

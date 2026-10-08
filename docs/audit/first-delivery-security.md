# First delivery security note

**Branch:** `close-first-delivery`  
**Date:** 8 October 2026

These four tests were run again before the office guide is accepted.

`npm run lint` passed. It reported 82 existing warnings and no errors.

`npm run check:sca` passed with no production findings.

`npm run check:step3` passed against the running site. It kept the Step 1, Step 2, and Step 3 cases.

The ZAP baseline finished with exit code 0 and `FAIL-NEW: 0`. It requested the home page and `/office/login`. The spider was given 2 minutes. These warnings are not High:

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

# Tasks

**Spec:** TWM-SPEC-TASKS  
**Requirements:** `docs/specs/requirements.md`  
**Design:** `docs/specs/design.md`  
**Proposal:** TWM-SOW-001, version 1.3  
**Also read:** `docs/rules/project-structure.md` and `docs/rules/coding-standards.md`  

The plan is four sprints of two weeks. Sprints 1 and 2 are the baseline. Sprint 3 is Phase 2. Sprint 4 is Phase 3. All three phases finish in two months. Read the requirements and the design before T-01. The quote math is in design section 5. Do not invent a second formula.

Your work now is T-01 through T-25, plus T-26, T-27, and T-28. T-26, T-27, and T-28 are part of Step 2, not tasks after T-25. That set is the baseline, sprints 1 and 2. Do not start sprint 3 or sprint 4. Follow `docs/rules/project-structure.md` and `docs/rules/coding-standards.md` on every change. Step 1 office saves, and every later save, go through `app/api` and `lib/`. Do not add a server action for a new save. Security checks close in the step named in `docs/specs/requirements.md` section 11. The four security tests in section 12 run at the end of Step 2, Step 3, and T-25. Do not move a check into the next step.

## Step 1. Office can edit public pages

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-01 | Add PostgreSQL and the content tables: user, tour, tour day, place, post, photo, review, slide, site settings. | BR-09, BR-10 | A local database starts, and the tables exist. |
| T-02 | Add email and password login at `/office/login`, with a hashed password and a session. | BR-08 | A wrong password is refused. A right password opens `/office`. |
| T-03 | Add Owner, Manager, and Editor. Enforce each action on the server. | BR-01 to BR-07 | An Editor save of a price is refused. A Manager save of a tour title is refused. |
| T-04 | Owner screen to create a login, remove a login, and change a role. A seed script creates the first Owner. | BR-02 | The Owner can create one Editor and one Manager. The seed password is not in the repo. |
| T-05 | Copy tours, days, places, posts, gallery, reviews, home slides, and site details into the database from the files named in design section 1. Leave those files in the repo. | BR-09, BR-10 | The row counts match those files. Phone, email, address, and social links match the navbar and footer. |
| T-06 | Point the public content pages at the database. Do not change the page layout. Leave about, FAQ, and the legal pages as they are. | BR-09, BR-10, BR-58 | Home, tours, a tour page, places, blog, and gallery render the loaded content. About, FAQ, and the legal pages still render as they do today. |
| T-07 | Editor screens for tours, days, places, blog, gallery, reviews, home slides, and site details. Include the featured flag. | BR-05 | An Editor changes a tour title and a photo, and the public tour page shows both. |
| T-08 | Step 1 check with the three roles. | BR-01 to BR-10 | The Step 1 checks in the requirements file all pass. Prices on the site may still be today's prices. |

## Step 2. Prices and quotes

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-09 | Add hotel rate, vehicle rate, air extra, jeep line, and season tables. | Storage for BR-17 to BR-27 | The tables match the design file. The price rules are proved in T-12 and T-15. |
| T-10 | Write the Excel import, including blank-name rows, zero rows, the Executive air row, Swat rates for Taobat, Naran left as stored for now, and Prado for Parado. Read cell values only. | BR-17, BR-28, BR-29, BR-51 to BR-54, BR-63 | The import report lists only rows that still have no place. The live Taobat deluxe twin is not 6,000. The import does not write under `public/` and does not run a macro. |
| T-11 | Mark tour 201, Ratti Gali, as the website price. Do not create a Taobat tour page. | BR-28, BR-30 | The public Ratti Gali card still shows the price already on the site. |
| T-12 | Build the one quote function in design section 5, with no night or day edits. Delete the old extra amounts in `lib/calculatePackagePrice.ts` from the live path. | BR-26, BR-31 to BR-43 | The Skardu test quote is 140,400 at 20 percent, from a subtotal of 117,000. Switching to 15 percent changes only the profit. A jeep amount is not multiplied by the number of days again. |
| T-13 | Add night lines and day lines, office edits, and the average nightly rate. | BR-45 to BR-49 | Changing night two changes only that night and the average. Clearing one day removes that day's rent. |
| T-14 | Point `components/home/PackageCalculator.tsx`, `app/calculator/page.tsx`, `components/TourCard.tsx`, `app/tours/[id]/page.tsx`, and `app/tours/[id]/template/page.tsx` at the same function. Couple cards use the Deluxe couple-price rule in design section 5. Hide Karachi as a road start. Do not send night or day edits from the guest builder. | BR-11, BR-19, BR-20, BR-50 | A guest quote matches the office starting quote for the same inputs. Ratti Gali still shows 150,000. |
| T-15 | Manager screens for rates, the season switch, vehicle on or off, Other, paid extras, and jeep lines. Reject blank, negative, and non-numeric amounts. | BR-04, BR-22 to BR-27, BR-70 | Premier is not in the guest grade list. A jeep line can be turned off. A negative rate is refused. |
| T-16 | Offer only Deluxe, Executive, Luxury, and Ultra Luxury on the tour page, the tour template page, and the builder. | BR-18 | Premier cannot be booked. `app/tours/[id]/template/page.tsx` no longer lists Premier. |
| T-17 | Step 2 check, including Karachi air 30,000, no Karachi road start, Taobat, Naran, and Ratti Gali. | BR-19 to BR-21, BR-28 to BR-30, BR-44, BR-59, BR-68 | The Step 2 checks in the requirements file all pass, including T-26 and T-27. |
| T-26 | Harden office uploads. Step 1 saves a photo and does not check it. This task is part of Step 2. Do it with T-09 through T-17. Do not leave it for Step 3. | BR-59 | A text file renamed to `.jpg` is refused. A file over 5 MB is refused. A real JPEG, PNG, or WebP at or under 5 MB still saves. SVG is refused. |
| T-27 | Harden login and session. Keep the Step 1 cookie rules in BR-67. Add the failure count and the 401 and 403 codes. This task is part of Step 2. Do not leave it for Step 3. | BR-60, BR-67, BR-68 | The 11th failed sign-in for one email inside 15 minutes is refused. The error text is the same for an unknown email and a wrong password. The log has no password. Logout clears the cookie. A wrong role returns 403. A missing session returns 401. |
| T-28 | Run the four security tests in requirements section 12, including the route list in section 13. This task is part of Step 2. Run the same four again before Step 3 is accepted, and again before T-25 is accepted. Each run keeps the older script cases and adds the new ones. | BR-71 to BR-74 | `npm run lint` passes, including no `eval` and no raw HTML insert. `npm run check:sca` passes. The ZAP baseline reports no High alert and reached `/office/login`. The Step 2 script, against the running site, proves 401, 403, the bad upload, and the login lock. |

## Step 3. Guest requests

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-18 | Add the guest request table and statuses. | BR-12 to BR-14 | A request can be saved and read back. |
| T-19 | Save the contact form and the custom trip form. Stop losing the contact message. Apply the length limits in BR-64. | BR-12, BR-14, BR-64 | A test contact stays in the office list. A message longer than 4,000 characters is refused. |
| T-20 | Save Book Now and still open `https://wa.me/923339981177`. | BR-13 | A test booking is in the list, and that WhatsApp link opens. The placeholder `tel:+1234567890` is not used. |
| T-21 | Office request list. The Editor can read and cannot delete or change status. The Manager can update status. The Owner can update status and can delete. | BR-03, BR-05, BR-15 | Those checks pass on one test item. |
| T-22 | Confirm guest details are not rendered on any public page. | BR-15, BR-64 | A public page response does not include the test phone number. The stored message is text, not HTML. |

## Close of the first delivery

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-23 | Daily database backup, and a written note of how a restore is run. | BR-55, BR-65 | One backup file exists, and a restore was tried on a copy. The backup is not in git and not under `public/`. |
| T-24 | Check office and public screens on current Chrome, Edge, Firefox, and Safari, on a computer and on a phone. | BR-57 | The Step 1, 2, and 3 paths work on those browsers. |
| T-25 | Short office guide in plain US English, and the three training sessions: Owner, Manager, and Editor. | BR-16, BR-56 | The guide matches the screens, including one night and one day on a quote. Office screens are in US English. |

## Not in sprint 1 or sprint 2

Do not build these during the baseline tasks T-01 to T-25.

Sprint 3, Phase 2:

- Hours on each stop
- Comfort, Luxury, Adventure, Exploration
- Kashmir, Swat, and Chitral jeep products

Sprint 4, Phase 3:

- Season plans by month. Blossom in April. Summer from May through September. Autumn from 10 October through 30 November. Winter from 1 December through 30 March.
- Fuel by kilometers. Gli at 1 liter per 14 km. Prado at 1 liter per 5 km. One petrol rate and one diesel rate.
- Guide price by area
- Entry tickets by stop
- Quote tracking codes
- A no-price copy for the driver and field team. That copy has no rupee amounts (BR-66).
- PDF or image download of a guest quote. The guest file has one total, not the staff lines and not the profit (BR-66).
- Excel download of live prices. Only the Owner and the Manager can download it (BR-66).
- A sticker counted by vehicles, replacing the room count from the baseline

Card payment, a guest login, and a new public look stay out of these four sprints.

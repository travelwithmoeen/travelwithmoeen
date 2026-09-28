# Tasks

**Spec:** TWM-SPEC-TASKS  
**Requirements:** `docs/specs/requirements.md`  
**Design:** `docs/specs/design.md`  
**Proposal:** TWM-SOW-001, version 1.1  

Do these in order. Read `docs/specs/requirements.md` and `docs/specs/design.md` before T-01. The quote math is in design section 5. Do not invent a second formula.

Step 2 starts after Step 1 is accepted. Step 3 starts after Step 2 is accepted. Each task names the requirement it covers.

The eight-week plan in the proposal still holds. Weeks 1 and 2 are Step 1. Weeks 4 and 5 are Step 2. Week 7 is Step 3. Weeks 3, 6, and 8 are review.

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
| T-10 | Write the Excel import, including blank-name rows, zero rows, the Executive air row, Swat rates for Taobat, Naran left as stored for now, and Prado for Parado. | BR-17, BR-28, BR-29, BR-51 to BR-54 | The import report lists only rows that still have no place. The live Taobat deluxe twin is not 6,000. |
| T-11 | Mark tour 201, Ratti Gali, as the website price. Do not create a Taobat tour page. | BR-28, BR-30 | The public Ratti Gali card still shows the price already on the site. |
| T-12 | Build the one quote function in design section 5, with no night or day edits. Delete the old extra amounts in `lib/calculatePackagePrice.ts` from the live path. | BR-26, BR-31 to BR-43 | The Skardu test quote is 140,400 at 20 percent, from a subtotal of 117,000. Switching to 15 percent changes only the profit. A jeep amount is not multiplied by the number of days again. |
| T-13 | Add night lines and day lines, office edits, and the average nightly rate. | BR-45 to BR-49 | Changing night two changes only that night and the average. Clearing one day removes that day's rent. |
| T-14 | Point `components/home/PackageCalculator.tsx`, `app/calculator/page.tsx`, `components/TourCard.tsx`, `app/tours/[id]/page.tsx`, and `app/tours/[id]/template/page.tsx` at the same function. Couple cards use the Deluxe couple-price rule in design section 5. Hide Karachi as a road start. Do not send night or day edits from the guest builder. | BR-11, BR-19, BR-20, BR-50 | A guest quote matches the office starting quote for the same inputs. Ratti Gali still shows 150,000. |
| T-15 | Manager screens for rates, the season switch, vehicle on or off, Other, paid extras, and jeep lines. | BR-04, BR-22 to BR-27 | Premier is not in the guest grade list. A jeep line can be turned off. |
| T-16 | Offer only Deluxe, Executive, Luxury, and Ultra Luxury on the tour page, the tour template page, and the builder. | BR-18 | Premier cannot be booked. `app/tours/[id]/template/page.tsx` no longer lists Premier. |
| T-17 | Step 2 check, including Karachi air 30,000, no Karachi road start, Taobat, Naran, and Ratti Gali. | BR-19 to BR-21, BR-28 to BR-30, BR-44 | The Step 2 checks in the requirements file all pass. |

## Step 3. Guest requests

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-18 | Add the guest request table and statuses. | BR-12 to BR-14 | A request can be saved and read back. |
| T-19 | Save the contact form and the custom trip form. Stop losing the contact message. | BR-12, BR-14 | A test contact stays in the office list. |
| T-20 | Save Book Now and still open `https://wa.me/923339981177`. | BR-13 | A test booking is in the list, and that WhatsApp link opens. The placeholder `tel:+1234567890` is not used. |
| T-21 | Office request list. The Editor can read and cannot delete or change status. The Manager can update status. The Owner can update status and can delete. | BR-03, BR-05, BR-15 | Those checks pass on one test item. |
| T-22 | Confirm guest details are not rendered on any public page. | BR-15 | A public page response does not include the test phone number. |

## Close of the first delivery

| ID | Task | Covers | Done when |
|---|---|---|---|
| T-23 | Daily database backup, and a written note of how a restore is run. | BR-55 | One backup file exists, and a restore was tried on a copy. |
| T-24 | Check office and public screens on current Chrome, Edge, Firefox, and Safari, on a computer and on a phone. | BR-57 | The Step 1, 2, and 3 paths work on those browsers. |
| T-25 | Short office guide in plain US English, and the three training sessions: Owner, Manager, and Editor. | BR-16, BR-56 | The guide matches the screens, including one night and one day on a quote. Office screens are in US English. |

## Not in these tasks

Do not schedule a new public look, a Taobat tour page, card payment, a guest login, stop hours, Comfort / Luxury / Adventure / Exploration, or the later Kashmir, Swat, and Chitral jeep products. Those stay out until a separate written approval.

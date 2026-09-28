# Design

**Spec:** TWM-SPEC-DESIGN  
**Requirements:** `docs/specs/requirements.md`  
**Tasks:** `docs/specs/tasks.md`  
**Proposal:** TWM-SOW-001, version 1.1  

This file says how the first delivery sits on the site that already exists. The public pages stay. The words and prices move into a database. The office edits that database. The public pages read it.

## 1. What stays

The site is a Next.js App Router app. These public routes stay, and their content moves to the database:

- `/` home
- `/tours` and `/tours/[id]`
- `/tours/[id]/template`
- `/destinations` and `/destinations/[id]`
- `/blog` and `/blog/[id]`
- `/gallery`
- `/customize-trip`
- `/contact`
- `/calculator`

`/tours/[id]/template` also calls `calculatePackagePrice`. It currently lists Premier. Move it onto the same quote function, and do not offer Premier there.

### Where the current data lives

| What | File |
|---|---|
| Tours and day plans | `data/tours.ts` |
| Places | `data/destinations.ts` |
| Blog | `data/blog.ts` |
| Gallery | `data/gallery.ts` |
| Reviews | `data/testimonials.ts` |
| Rates used by the live site | `data/pricing.ts` and `lib/calculatePackagePrice.ts` |
| Home slides | `components/FanGallery1.tsx` |
| Phone, email, address, social links | `components/Navbar.tsx`, `components/Footer.tsx`, `components/home/SocialMediaSection.tsx`, `app/contact/page.tsx` |
| Tour card price | `components/TourCard.tsx` calls `calculatePackagePrice` with Deluxe and Islamabad, and falls back to `basePrice` |
| Package builder | `components/home/PackageCalculator.tsx`, also used by `app/calculator/page.tsx` |

These pages stay as they are. The office does not edit them in the first delivery:

- `/about`
- `/faq-page`
- `/Cancellation`
- `/TermsAndConditions`
- `/PrivacyPolicy`
- `/TravelersInstructions`

The look of the public pages does not change in the first delivery. The components stay. Tours, places, posts, gallery, reviews, and prices move to the database. About, FAQ, and the legal pages do not.

Today the tours, places, posts, gallery, reviews, and prices are read from files in `data/`. After cutover, those records are read from the database. The files stay in the repo as the record of what was on the site. They are not the live source. About, FAQ, and the legal pages are not part of that move.

Contact saves the request and does not send email. The custom trip form saves the request and keeps the email send already on that page. Book Now saves the request and opens `https://wa.me/923339981177`.

## 2. Shape

```text
Guest browser
  public pages and package builder
        |
        v
Next.js server
  office screens at /office
  quote function (one place)
  login and role checks
        |
        v
PostgreSQL
  content, rates, quotes, guest requests, users
```

There is one quote function. The guest package builder and the office quote screen both call it. The guest call does not send night edits or day edits. The office call can.

Role checks run on the server. Hiding a button in the browser is not enough.

Office screens are in US English. The public site is not translated.

## 3. Office area

The office area lives at `/office`. A person who is not logged in is sent to `/office/login`.

| Screen | Who | Job |
|---|---|---|
| Login | all staff | Email and password. One person, one login. |
| Users | Owner | Create, remove, and change a role. |
| Tours | Editor, Owner | Title, text, days, photos, featured flag. |
| Places | Editor, Owner | Place guides. |
| Blog, gallery, reviews, home slides | Editor, Owner | Public content. |
| Site details | Editor, Owner | Phone, address, social links. |
| Rates | Manager, Owner | Hotels, vehicles, air extras, jeep lines, season switch. |
| Quote | Manager, Owner | Build a quote, then edit one night or one day. |
| Requests | all three roles | Read the list. The Owner and the Manager can update status. Only the Owner can delete. The Editor cannot change status or delete. |

The Editor does not get a link that opens a rupee field. The server still refuses the save if they try.

## 4. Data

Main records:

| Record | Holds |
|---|---|
| User | Email, password hash, role. |
| Tour | The fields the public tour page already shows, plus a price source. |
| Tour day | Day number, title, description, highlights. |
| Place, post, photo, review, slide | The public content the Editor edits. |
| Site settings | Phone, address, social links. |
| Hotel rate | Place, start city, grade, twin, 3-share, hotel name, offered or not. |
| Vehicle rate | Place, start city, road or air, vehicle, rent, fuel, toll, seats, on or off. |
| Air extra | Islamabad ticket, Lahore add, Karachi add, welcome pack, entry, infant extra, sticker. |
| Jeep line | Place, road or air, label, people per jeep, amount, on or off. |
| Season | 15 or 20. One active value. |
| Quote | The inputs, the night lines, the day lines, the extras, the total. |
| Guest request | Contact, custom trip, or booking. Status. |

Tour price source is either `excel` or `website`. Ratti Gali, code 201, is `website` and keeps the price already stored on the tour. Other tours use `excel`.

Premier rows can be stored. `offered` is false, so guests never see Premier.

A zero vehicle row is stored and marked not live. The quote skips it.

## 5. Quote function

One function. Do not keep a second copy of the math in the React components. Do not keep the old constants in `lib/calculatePackagePrice.ts` (welcome pack 1,400, entry 2,500, sticker 600). Those are the old website numbers. The first delivery uses the amounts below.

### Who counts

- A seat is used by each adult, each child, and each infant with their own seat.
- An infant on a lap does not use a seat and does not take a room.
- Rooms, when nobody types a count, equal the number of seats divided by 3, rounded up.
- More than two people in a room uses the 3-share rate. Two or fewer uses the twin rate.
- Meals and arrival breakfast are per adult and per child. Infants are not included.
- The child air fare is 75 percent of the adult fare. The adult fare is the Islamabad ticket plus the Lahore or Karachi extra, when that start city applies.

### Order of the starting quote

1. Nights equal days minus 1. A one-day trip has no hotel night.
2. Vehicle count equals seats needed, divided by the seats on that vehicle, rounded up, unless a count is typed.
3. Vehicle cost equals the vehicle count times ((daily rent plus daily fuel) times days, plus the toll once). The toll is once per vehicle, not once for the whole trip.
4. Hotel cost equals the nightly rate times nights times rooms.
5. Guide, if selected, is 5,000 rupees times days. On the public builder, a Coaster 4c or Coaster 5c selects the guide. The office can turn it off. The test quote has no guide.
6. Meals, if selected, use the grade rate times nights times adults and children.
7. A road trip longer than one day adds arrival breakfast of 500 rupees times adults and children.
8. A Lahore road trip longer than three days adds 5,000 rupees times (days minus 3) times the vehicle count. This is not added to an air quote.
9. An air quote adds, for each adult and each child, a welcome pack of 1,500 and entry tickets of 4,000. Each infant adds 800. The sticker is 500 times rooms. Tickets are the adult fare times adults, 75 percent of that fare times children, 1,000 for each lap infant, and 5,000 for each infant with a seat.
10. A jeep line that is turned on, and that matches the place and road or air, is added once for each group of six travelers, at the full amount on the line. Do not multiply 90,000 by 3.
11. Subtotal is the sum of those lines. Total equals subtotal times (1 plus the season rate). Use 1.15 or 1.20. Do not divide by 1.20.

The guest builder keeps today's minimum trip length for each place. That limit is not applied to an office quote. The Skardu test is 5 days even though the public road minimum for Skardu is 6.

The test quote is Islamabad, Skardu Valley, 5 days, 2 adults, Gli car, Deluxe, no guide, no meals, 20 percent, and no night or day edit. The total must be 140,400. That is a subtotal of 117,000 times 1.20.

### Couple price on a tour card

Use the same function with Deluxe, 2 adults, 1 twin room, Islamabad, the tour's days, the tour's road or air choice, no guide, no meals, and the active season. This is what `components/TourCard.tsx` does today. The road vehicle for 2 adults is Gli car. The air vehicle for 2 adults is Prado. If the function returns no price, show `basePrice`.

Ratti Gali, code 201, does not use this function for the card. Show the stored website price, 150,000, until the office changes that tour.

### Edits

An office save can replace the rate on one night line, and the hotel name on that night, or replace or clear the vehicle on one day line. Other lines stay. The total is calculated again from the lines, then the season profit is applied.

Average nightly rate equals the sum of the rates saved on the night lines, after edits, divided by the number of nights. The screen shows that number next to the hotel category it sits in. The match uses the twin rate on the loaded hotel table for that place. If no grade is an exact match, the screen still shows the average and the nearest grade. The example is 20,000 with the 20,000 category.

The guest builder never sends these edits.

Road start cities in the guest builder are Lahore and Islamabad. Karachi is not in that list. Air start cities are Karachi, Lahore, and Islamabad.

### Guest buttons

- Contact: save the request. The live form does not send today. Do not only clear the form.
- Custom trip: save the request, and keep the email send that is already on the page.
- Book Now: save the request, and open `https://wa.me/923339981177`. Do not copy the placeholder `tel:+1234567890` from the navbar.

## 6. First load from Excel

The workbook is `resources/Trip Cost Calculator Final - Copy.xlsx`. That folder is not in git. Do not commit it. Do not open or copy `resources/Important-Notes.txt`.

Read the rate sheets `Road_DB ISB`, `Road_DB LHE`, `Air_DB`, and `by air ticket fare`. The sheets `BY ROAD` and `BY AIR` are examples of a finished quote. They are not the rate lists.

One import writes hotel rates, vehicle rates, air extras, and the four jeep lines. It does not delete the file.

A seed script creates the first Owner login on the developer's machine. Do not put that password in the repo. After week 1, the real Owner replaces it from the Users screen.

Rules:

- Blank place name on a vehicle row that has rent, fuel, and seats: use the place on the nearest row above.
- Zero rows: store them as not live.
- Skardu and Hunza air row with twin 24,000, 3-share 28,000, and no grade name: Executive.
- Neelum Taobat Arang Kel rates are replaced with the Swat rates under the Taobat place. Do not keep the 6,000 deluxe twin as the live Taobat rate. Do not create a Taobat tour page.
- Naran rows: copy as stored, for now. Do not replace them with Swat.
- Parado in the sheet is stored as Prado for the office label.
- Premier: store, do not offer.
- Rows that still have no place: write them to an import report. Do not invent a number.

After a successful import, new quotes use the database. The Excel file can stay on disk as the client's copy.

## 7. Login

Passwords are hashed. Staff do not share one password. The Owner removes a login when someone leaves.

A session cookie is enough. Guests never get a session for the office.

## 8. Guest requests

| Form | Save | Also |
|---|---|---|
| Contact | Yes | |
| Custom trip | Yes | |
| Book Now | Yes | Open `https://wa.me/923339981177` |

The office list shows status. The Manager and the Owner can change status. Only the Owner can delete.

## 9. Backups

The database is backed up once a day. A restore is done only when the data is damaged, and the client is told.

The first delivery does not promise a new uptime number. If the site is down, check the host, fix a fault that is inside this work, and restore from the daily backup if the data is damaged.

## 10. Later, not in this design

Step 4 is hours per stop, the labels Comfort, Luxury, Adventure, and Exploration, and the Kashmir, Swat, and Chitral jeep products. Those are not tables in the first delivery, except the four jeep lines already in BR-27.

# Requirements

**Spec:** TWM-SPEC-REQ  
**Proposal:** TWM-SOW-001, version 1.3, September 29, 2026  
**Status:** Ready to build  

This file says what the first delivery must do. The design is in `docs/specs/design.md`. The build order is in `docs/specs/tasks.md`.

The public website stays. The office gets a private area on that same site. Guests do not log in.

## 1. Roles

| ID | Requirement |
|---|---|
| BR-01 | There are three roles: Owner, Manager, and Editor. Each login has one role. |
| BR-02 | Only the Owner can create a login, remove a login, or change a role. A seed script may create the first Owner on a development machine. That password is not stored in the repo. |
| BR-03 | Only the Owner can delete a tour, a price row, or a guest request. |
| BR-04 | The Owner and the Manager can edit hotel rates, vehicle rates, air extras, and jeep lines. They can turn a vehicle on or off for a route, add an Other vehicle, add a paid extra, and switch the season profit between 15 percent and 20 percent. |
| BR-05 | The Owner and the Editor can edit tours, day plans, places, blog posts, the gallery, reviews, home slides, and the phone, address, and social links. They can mark a tour as featured. The Editor can read guest requests. The Owner and the Manager can update a guest request status. The Editor cannot. |
| BR-06 | The Editor cannot change any rupee amount and cannot delete a tour or a guest request. |
| BR-07 | The Manager cannot edit public page text and cannot create logins. |
| BR-08 | A person who is not logged in cannot open the office area. |

## 2. Public site

| ID | Requirement |
|---|---|
| BR-09 | The public pages keep the same job they have today: home, tours, tour page, places, blog, gallery, package price, custom trip, contact, and Book Now. |
| BR-10 | The pages in BR-09 read from the office system, not from the fixed files in `data/`. About, FAQ, and the legal pages in BR-58 stay on their current pages. |
| BR-11 | A tour card shows the Deluxe couple price: 2 adults, 1 twin room, start city Islamabad, that tour's days and road or air choice, no guide, no meals, and the active season profit. If that price cannot be calculated, the card shows `basePrice`. Ratti Gali, code 201, shows 150,000. The package builder is the full quote for any group size. |
| BR-12 | The contact form saves the message. It must not clear the message and then lose it. |
| BR-13 | Book Now saves a booking request and still opens `https://wa.me/923339981177`. Do not use `tel:+1234567890`. |
| BR-14 | The custom trip form saves the request. |
| BR-15 | Guest names, phone numbers, and messages are not shown on the public site. |
| BR-16 | The public site stays in the language it uses today. Office screens are in US English. |

## 3. Prices

| ID | Requirement |
|---|---|
| BR-17 | The first prices are loaded from `Trip Cost Calculator Final - Copy.xlsx`. After that load, the office system is the live price list. The Excel file is not deleted. |
| BR-18 | Hotel grades offered to guests are Deluxe, Executive, Luxury, and Ultra Luxury. Premier is stored if the sheet has it, and it is not offered. |
| BR-19 | Road trips start from Lahore or Islamabad only. A guest from Karachi joins a road trip in one of those two cities. |
| BR-20 | Air trips start from Karachi, Lahore, or Islamabad. |
| BR-21 | Until the office changes them, the Islamabad air ticket is 60,000 rupees, the Lahore air extra is 10,000 rupees, and the Karachi air extra is 30,000 rupees on top of the Islamabad ticket. |
| BR-22 | Off-season profit is 15 percent. In-season profit is 20 percent. Only the Owner and the Manager can switch it. The active rate is shown on the quote screen. |
| BR-23 | Prado is the preferred vehicle where that car is offered. The Excel name Parado is the same car. Other vehicles can be turned on for a route. |
| BR-24 | The office can choose Other and type a mix, for example a Gli car plus a jeep. |
| BR-25 | A quote can add a paid extra on top of the main vehicle. The office types the name and the amount. Examples are a musical night, a BBQ and bonfire, fireworks, a honeymoon setup, or flowers. |
| BR-26 | A jeep price is the full amount for the days written on the line. The system does not multiply that amount by the number of days again. |
| BR-27 | Jeep lines are Kalash and Chitral road 90,000, Minimarg road 90,000, Kumrat road 16,200, and Fairy Meadows road and air 18,200. One jeep is added for each group of six travelers. The Manager can turn a line off. |
| BR-28 | The Neelum Taobat Arang Kel rates are replaced with the Swat rates. The old 6,000 deluxe twin is not the live Taobat rate. Taobat does not get a new public tour page in the first delivery. |
| BR-29 | Naran keeps the Naran rates already in the Excel file, for now. Swat is not copied over Naran. |
| BR-30 | Ratti Gali, tour code 201, keeps the price already on the website. Neelum, Naran, and Swat are not copied onto it. |

## 4. How a starting quote is worked out

These rules fill the quote before anyone edits a single night or a single day.

| ID | Requirement |
|---|---|
| BR-31 | Hotel nights equal days minus one. A one-day trip has no hotel night. |
| BR-32 | Vehicle cost equals the number of vehicles times ((daily rent plus daily fuel) times the number of days, plus the toll once). The toll is once per vehicle. |
| BR-33 | If the group needs more seats than one vehicle has, the quote adds more vehicles. |
| BR-34 | If the office does not type a room count, rooms equal the people who need a seat, divided by 3, rounded up. A seat is each adult, each child, and each infant with their own seat. An infant on a lap is not a seat. |
| BR-35 | Hotel cost uses the twin rate. If more than two people share a room, it uses the 3-share rate. Then it multiplies by nights and by rooms. |
| BR-36 | A guide, if selected, is 5,000 rupees per day. |
| BR-37 | Meals, if selected, are per adult and per child, per night: Deluxe 1,200, Executive 2,000, Luxury 2,500, Ultra Luxury 3,000. |
| BR-38 | On a road trip longer than one day, arrival breakfast is 500 rupees per adult and per child. |
| BR-39 | An air quote adds a welcome pack of 1,500 rupees and entry tickets of 4,000 rupees for each adult and each child, plus 800 rupees for each infant. |
| BR-40 | A child air ticket is 75 percent of the adult fare. An infant on a lap is 1,000 rupees. An infant with a seat is 5,000 rupees. |
| BR-41 | The air sticker is 500 rupees times the number of rooms. |
| BR-42 | If a road trip starts in Lahore and is longer than three days, the quote adds 5,000 rupees for each day after day three, for each vehicle. |
| BR-43 | Profit is added last, at 15 percent or 20 percent. |
| BR-44 | Before live prices are switched, this example must total 140,400 rupees at 20 percent profit: Islamabad, Skardu Valley, 5 days, 2 adults, Gli car, Deluxe, no guide, no meals. No one-night or one-day edit is applied to this test. |

## 5. One night or one day

| ID | Requirement |
|---|---|
| BR-45 | The starting quote uses one hotel rate on every night and one vehicle on every day. |
| BR-46 | The Manager, and the Owner, can set a different hotel rate on one night. The other nights stay as they were. |
| BR-47 | The Manager, and the Owner, can remove the vehicle on one day, set a jeep on one day, or set a higher vehicle on one day. |
| BR-48 | The quote screen shows the average nightly rate. That average is the hotel rates for the nights, added up and divided by the number of nights. An average of 20,000 is shown with the 20,000 hotel category. If no grade is an exact match, the screen still shows the average and the nearest grade. |
| BR-49 | After an edit, the total follows the edited nights and days, then the season profit. |
| BR-50 | The guest package builder uses the starting quote only. The guest sees one total. The guest does not see each breakfast line and does not see the profit. Guests cannot edit one night or one day. A staff member who is logged in sees each line and the profit. |

## 6. Excel load rules

| ID | Requirement |
|---|---|
| BR-51 | A vehicle row with rent, fuel, and seats, and a blank place name, is attached to the place named on the nearest row above it. |
| BR-52 | A row stored as zero is not a live fare. |
| BR-53 | The Skardu and Hunza air hotel row with no grade name, twin 24,000 and 3-share 28,000, is loaded as Executive. |
| BR-54 | The load does not invent a price. Rows that still cannot be placed are reported. |

## 7. Care of the system

| ID | Requirement |
|---|---|
| BR-55 | The database is backed up every day. A restore is used only when the data is damaged, and the client is told. |
| BR-56 | Before Step 3 is closed, the office gets three short sessions, one each for Owner, Manager, and Editor, and a short written guide in plain US English. The Manager session includes a change to one night or one day. |
| BR-57 | The office screens and the public site are checked on current Chrome, Edge, Firefox, and Safari, on a computer and on a phone. |
| BR-58 | About, FAQ, cancellation, terms, privacy, and traveler instructions stay as they are. They are not office-edited in the first delivery. |

## 8. Not in the first delivery

The first delivery is the baseline. These items stay out of it.

- A new look for the public site.
- A new public tour page for Taobat.
- Kashmir, Swat, and Chitral jeep packages by air and by road. These are Phase 2.
- Hours on each stop, and the labels Comfort, Luxury, Adventure, and Exploration. These are Phase 2.
- Card payment on the website.
- A login for guests.
- Deleting the Excel file.

## 9. Phase 3, after the baseline and Phase 2

These were asked for on September 29, 2026. They are kept in the plan. They are sprint 4. They are not built in sprints 1 to 3. Sprint 4 starts after sprint 3 is accepted.

- Season plans by month. Blossom is in April, and the exact April dates still need to be named. Summer is May through September. Autumn is 10 October through 30 November. Winter is 1 December through 30 March.
- Fuel by kilometers. A Gli car uses 1 liter for each 14 km. A Prado uses 1 liter for each 5 km. One petrol rate and one diesel rate update every quote.
- A guide price the office can edit by area. Islamabad and Murree can cost less than Skardu and Hunza.
- Entry tickets added from the day's plan, instead of one air entry amount.
- A tracking code on each quote a guest builds or downloads.
- A no-price copy for the driver and field team, with services, dates, flights, vehicles, and hotels.
- A PDF or image download of the guest quote.
- A download of the live prices back to Excel.

In sprint 4, the air sticker follows the number of vehicles. Until then it stays 500 rupees times the number of rooms.

## 10. Done when

Step 1 is done when an Editor can change a tour title and a photo and the public page shows both, an Editor cannot open a price, and an Owner can create an Editor login and a Manager login.

Step 2 is done when the test quote equals 140,400 rupees at 20 percent, 15 percent changes only the profit, Premier is not offered, a road quote cannot start from Karachi, a Karachi air quote includes 30,000 rupees, Taobat uses Swat rates, Naran still uses the Naran rates for now, Ratti Gali still shows the website price, a night-two hotel edit changes only that night and the average, and removing one day's vehicle removes that day's rent.

Step 3 is done when a test contact and a test booking stay in the office list, WhatsApp still opens, an Editor can read the list and cannot delete an item, and an Owner can delete a test item.

# Where the work stands

**Date:** 13 October 2026  
**Read first:** `docs/specs/tasks.md`

## Built

The baseline is in the code and on the preview site `new.travelwithmoeen.com`. The live site `travelwithmoeen.com` is unchanged.

| Work | What is in place |
|---|---|
| Step 1 | Office login, Owner, Manager, and Editor. The Editor can change tours, places, blog, gallery, reviews, home slides, and site details. |
| Step 2 | Rates and the one quote function. Premier is not offered. Night and day edits are on the Rates screen. Photo bytes are checked. Login locks after 10 failures. |
| Step 3 | Contact, custom trip, and Book Now are saved. Book Now still opens WhatsApp. The Editor can read requests. The Owner can delete one. |
| T-23 to T-25 | A daily backup and a restore note, the browser check, and the office guide. |
| Standards | `npm run check:standards` passes. A pull request is checked on the files it changes. |
| Preview | The preview site is on Vercel. Its database backup is a separate Owner action. |

## Left in the baseline

These were specified and are not built. They are not the next sprint.

- Delete a price row. BR-03. Only the Owner.
- Create a new tour, a new place, or a new blog post. The office can edit rows that already exist.

## Planned, in this order

1. **Next sprint.** Office media, T-29 through T-35 (BR-75 to BR-80), and the Meadow design prototype, T-36 (BR-81). Media is upload and remove on the photo fields that are still a path, and the stored file is deleted when an office upload is replaced or removed. The file must still load on the preview site. T-36 is the clickable file in `docs/office-design/`. It does not change the live office. Building that look into the office is not part of this sprint.
2. **Phase 2.** Hours on each stop. Comfort, Luxury, Adventure, and Exploration. Kashmir, Swat, and Chitral jeep products. Starts after T-35 and T-36 are accepted.
3. **Phase 3.** Seasons by month, fuel by kilometers, guide price by area, entry tickets, quote codes, a driver copy with no prices, a guest quote download, and an Excel download of live prices. Starts after Phase 2 is accepted.

Card payment, a guest login, and a new public look stay out of this plan.

Do not start Phase 2 or Phase 3 until T-35 and T-36 are accepted. New saves go through `app/api` and `lib/`. `API_BASE_URL` stays empty unless the API moves to another host.

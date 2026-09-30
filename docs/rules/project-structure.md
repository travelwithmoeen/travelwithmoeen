# Project structure

**Rule:** TWM-RULE-STRUCTURE  
**Proposal:** TWM-SOW-001, version 1.3

This file records the layout this project follows. The rules come from published sources. They are not a private style.

## Sources

| Source | What we take from it |
|---|---|
| [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure) | `app` is the router. `page` and `layout` are the route files. A route group such as `(panel)` is not part of the URL. `proxy.ts` is the request proxy. `.env` is not committed. Next.js does not force a folder layout outside `app`. One of its official choices is to keep `app` for routes and put shared code in root folders such as `components` and `lib`. This project uses that choice. |
| [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html) | A common set of software life cycle processes. It does not pick a framework or a folder tree. It does require implementation, verification, and configuration control of the software. In this project, implementation is `app`, `components`, and `lib`. Verification is `scripts/check-step1.ts` and later check scripts. Configuration is git. |
| [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) | Product quality characteristics. The split below supports maintainability (one place for each kind of code) and security (secrets and role checks stay on the server). |

## Frontend

The browser draws these files. They do not open the database.

| Place | Next.js role | This project |
|---|---|---|
| `app/**/page.tsx` | Public route | Thin page. Load data, render a view. |
| `app/**/layout.tsx` | Shared UI for that route | Root layout, and the office layout. |
| `app/office/(panel)/` | Route group. `(panel)` is not in the URL. | Office screens after login. |
| `components/` | Shared UI, outside `app`, which Next.js allows | Public views and office forms. |
| `components/ui/` | Shared controls | Buttons, inputs, and the other controls. |
| `public/` | Static files | Images and other files served as-is. |

Public routes that read the database: `/`, `/tours`, `/tours/[id]`, `/tours/[id]/template`, `/destinations`, `/destinations/[id]`, `/blog`, `/blog/[id]`, `/gallery`, `/calculator`, `/contact`, `/customize-trip`.

Leave these as they are. Do not move them into the office: `/about`, `/faq-page`, `/Cancellation`, `/TermsAndConditions`, `/PrivacyPolicy`, `/TravelersInstructions`.

## Backend

The server runs these files. They are not sent to the browser as page UI.

| Place | Role |
|---|---|
| `lib/db/schema.ts` | The only database schema. Drizzle. |
| `lib/db/index.ts` | Database connection. Uses `DATABASE_URL`. |
| `lib/auth/` | Password hash, session, and role checks. |
| `lib/content.ts` | Reads for public pages. |
| `app/api/**/route.ts` | The only door the screens call. |
| `lib/office/content-writes.ts`, `lib/office/users.ts` | Writes. Called by the API, not by a screen. |
| `lib/quote.ts` | The one price function. Add it in Step 2. Do not put that math in a component. |
| `scripts/` | Seed and verification. Not imported by pages. |
| `proxy.ts` | Next.js proxy. Sends a visitor with no office cookie to `/office/login`. |
| `docker-compose.yml` | Local Postgres. |

`prisma/schema.prisma` is not the live schema. Do not add models there.

## Service boundary

The screens and the rules must be able to deploy as two services. The only link is HTTP. Step 1 is included. Do not leave the office saves inside one app through server actions.

```text
Screens (frontend)
  app pages and components
        |
        |  HTTP JSON only
        v
API
  app/api/**/route.ts
        |
        v
Rules and data (backend)
  lib/auth, lib/content, lib/office, lib/quote.ts, lib/db
        |
        v
PostgreSQL
```

Rules:

- A screen calls the API with `fetch`. It does not import `lib/db`, `lib/office`, or `lib/auth`.
- The API route is thin. It reads the request, checks the session, and calls a function in `lib/`. The price math and the role rules stay in `lib/`.
- `lib/` does not import `components/` or `app/`.
- The screen reads the API host from `API_BASE_URL`. When that value is empty, the host is the same site. When the backend moves, only that value changes.

This is a project rule so the two sides can be deployed apart later. ISO/IEC/IEEE 12207 does not require microservices. ISO/IEC 25010 asks for maintainability, which this boundary protects.

## Data files

`data/` is the record of the old site. The seed reads it. After that, pages read the database through the API, and the API calls `lib/content.ts`.

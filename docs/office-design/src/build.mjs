// Builds the Meadow office design prototype (docs/office-design/meadow.html).
// Run: node docs/office-design/src/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, "..");
const read = (f) => readFileSync(join(SRC, f), "utf8");
const content = JSON.parse(read("content.json"));

/* ------------------------------------------------------------------ */
/* Sample data, built from the real site content                       */
/* ------------------------------------------------------------------ */
const seed = (() => {
  const who = ["editor@travelwithmoeen.com", "moeen@travelwithmoeen.com", "sana.editor@travelwithmoeen.com"];
  const stamp = (i) => ({ updatedAt: new Date(Date.UTC(2026, 9, 9, 3, 0) - i * 7.3e7).toISOString(), updatedBy: who[i % 3] });
  const tours = content.tours.map((t, i) => ({
    ...t,
    description: t.description || `A ${t.duration}-day trip to ${t.location}.`,
    days: t.days.length ? t.days.map((d) => ({ title: d.title || "", text: d.text || "", highlights: d.highlights || [] })) : [{ title: `Day in ${t.location}`, text: "", highlights: [] }],
    ...stamp(i),
  }));
  const places = content.places.map((p, i) => ({ ...stamp(i + 2), ...p, banner: `/images/destinations/${p.slug}.webp`, sections: [
    { heading: "Overview", body: p.excerpt, image: "", highlights: [] },
    { heading: "Best time to visit", body: "May to October, when the roads are open and the valleys are green.", image: "", highlights: ["May to October", "Cool nights, bring a jacket"] },
    { heading: "Getting there", body: "By road from Islamabad, or by air where a flight is offered.", image: "", highlights: [] },
  ] }));
  const posts = content.posts.map((p, i) => ({ ...stamp(i + 1), ...p, cover: `/images/blog/${p.slug}.webp`, sections: [
    { heading: "Introduction", body: p.excerpt, image: "", highlights: [] },
    { heading: "Plan your trip", body: "When to go, what to pack, and how to get there.", image: "", highlights: [] },
  ] }));
  const reviews = content.reviews.map((r) => ({ ...r, avatar: "" }));
  const slides = [
    { id: 1, image: "/images/slider/JeepSafari.webp", title: "Jeep Safari", rotation: -15, order: 1 },
    { id: 2, image: "/images/slider/NatureWildlife.webp", title: "Nature & Wildlife", rotation: -7, order: 2 },
    { id: 3, image: "/images/slider/Adventure.webp", title: "Adventure", rotation: 0, order: 3 },
    { id: 4, image: "/images/slider/Hiking.webp", title: "Hiking", rotation: 7, order: 4 },
  ];
  const site = {
    phoneDisplay: "+92 333 9981177", phoneE164: "923339981177", email: "info@travelwithmoeen.com",
    address: "Office # 3, 2nd Floor, Shalimar Plaza, F-10 Markaz, Islamabad",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Office+3+2nd+Floor+Shalimar+Plaza+F-10+Markaz+Islamabad",
    facebookUrl: "https://www.facebook.com/TravelwithMoeen", instagramUrl: "https://www.instagram.com/travelwithmoeen/",
    tiktokUrl: "https://www.tiktok.com/@travelwithmoeen", youtubeUrl: "https://www.youtube.com/@itsmoeen",
  };
  const R = (id, name, kind, status, at, phone, email, message, tour = "") => ({ id, name, kind, status, at, phone, email, message, tour });
  const requests = [
    R(1, "Ayesha Khan", "booking", "new", "2026-10-09T09:14:00+05:00", "0300 0000001", "", "We want to book this tour for 2 adults in the first week of November. Please confirm the hotel.", "5 Days Trip to Skardu (By Air) - Private Tours"),
    R(2, "Hamza Raza", "custom", "in_progress", "2026-10-08T18:02:00+05:00", "0321 0000002", "hamza@example.com", "Family of 5, Hunza and Khunjerab, 7 days in late October. Two children aged 6 and 9."),
    R(3, "Sana Malik", "booking", "new", "2026-10-08T13:20:00+05:00", "0312 0000003", "", "Ratti Gali for 4 people. Is the lake open after mid October?", "3 Days Trip to Ratti Gali Lake"),
    R(4, "Bilal Ahmed", "contact", "closed", "2026-10-07T11:40:00+05:00", "", "bilal@example.com", "Do you offer tours to Malam Jabba in winter for skiing?"),
    R(5, "Mariam Shah", "custom", "new", "2026-10-07T08:05:00+05:00", "0333 0000005", "mariam@example.com", "Honeymoon trip, 6 days, Skardu and Shangrila. Luxury hotels please."),
    R(6, "Usman Tariq", "booking", "in_progress", "2026-10-06T21:15:00+05:00", "0345 0000006", "", "Booking for our office group of 12 people. Need a Coaster.", "4 Days By Road Trip to Naran Kaghan and Babusar Top"),
    R(7, "Fatima Noor", "contact", "closed", "2026-10-05T16:30:00+05:00", "", "fatima@example.com", "Thank you for the Kalash trip. The guide was excellent."),
    R(8, "Ali Hassan", "custom", "in_progress", "2026-10-05T10:10:00+05:00", "0301 0000008", "", "Fairy Meadows with parents in their sixties. Is the jeep track safe?"),
    R(9, "Zainab Qureshi", "booking", "closed", "2026-10-03T12:00:00+05:00", "0322 0000009", "zainab@example.com", "Booked and paid. Please send the itinerary PDF.", "6 Days By Road Trip to Hunza Valley and Khunjerab Pass (Couple)"),
    R(10, "Omar Farooq", "contact", "in_progress", "2026-10-02T19:45:00+05:00", "0300 0000010", "", "Can I pay in two parts?"),
    R(11, "Hira Javed", "custom", "closed", "2026-10-01T09:30:00+05:00", "", "hira@example.com", "Neelum Valley, 3 days, student group of 20."),
    R(12, "Danish Iqbal", "booking", "closed", "2026-09-29T17:05:00+05:00", "0315 0000012", "", "Need pickup from Lahore for this tour.", "7 Days By Road Trip to Skardu and Deosai National Park"),
  ];
  const ratePlaces = [["Skardu Valley", 9000], ["Hunza Valley", 8500], ["Naran Kaghan", 7000], ["Swat Valley", 6500], ["Neelum Valley", 6000]];
  const grades = [["Deluxe", 1], ["Executive", 1.5], ["Luxury", 2], ["Ultra Luxury", 3]];
  const round = (n) => Math.round(n / 500) * 500;
  let hid = 0;
  const hotels = ratePlaces.flatMap(([p, base]) => ["Islamabad", "Lahore"].flatMap((s) => grades.map(([g, m]) => ({ id: ++hid, place: p, start: s, grade: g, twin: round(base * m), triple: round(base * m * 1.3), hotel: `Sample ${g.toLowerCase()} hotel, ${p.split(" ")[0]}`, offered: !(g === "Ultra Luxury" && p === "Neelum Valley") }))));
  for (const row of hotels) {
    if (row.place === "Skardu Valley" && row.start === "Islamabad" && row.grade === "Deluxe") row.twin = 8700;
  }
  let vid = 0;
  const vehicles = ratePlaces.flatMap(([p]) => [["Gli Car", 10000, 6000, 1200, 3], ["Prado", 22000, 9000, 1200, 6], ["Hiace", 18000, 8000, 1500, 12], ["Coaster", 28000, 11000, 2000, 22]].map(([v, r, f, t, s]) => ({ id: ++vid, place: p, start: "Islamabad", vehicle: v, rent: r, fuel: f, toll: t, seats: s, live: !(v === "Coaster" && p === "Neelum Valley") })));
  const jeeps = [["Kalash and Chitral", "Chitral Valley", "Road", 90000, true], ["Minimarg", "Astor Valley", "Road", 90000, true], ["Kumrat", "Kumrat Valley", "Road", 16200, true], ["Fairy Meadows", "Naran Kaghan", "Road", 18200, true], ["Fairy Meadows", "Naran Kaghan", "Air", 18200, true], ["Shigar and Cold Desert", "Skardu Valley", "Road", 8000, false], ["Deosai Plains", "Skardu Valley", "Road", 18000, false], ["Basho Valley", "Skardu Valley", "Air", 12000, false], ["Khunjerab Pass", "Hunza Valley", "Road", 14000, false], ["Hopper Glacier", "Hunza Valley", "Air", 7000, false], ["Lake Saif-ul-Malook", "Naran Kaghan", "Road", 6000, false], ["Mahodand Lake", "Swat Valley", "Road", 9000, false]].map(([label, place, mode, amount, baseline], i) => ({ id: i + 1, label, place, mode, amount, baseline, live: label !== "Hopper Glacier" }));
  const backups = Array.from({ length: 8 }, (_, i) => { const d = new Date(Date.UTC(2026, 9, 9 - i, 0, 0, 12)); const at = d.toISOString(); return { name: `backups/preview-${at.replace(/[:.]/g, "-")}.json`, at, size: 1468006 - i * 9300, manual: false }; });
  const users = [
    { id: 1, email: "moeen@travelwithmoeen.com", role: "owner", lastSeen: "2026-10-09T09:20:00+05:00" },
    { id: 2, email: "manager@travelwithmoeen.com", role: "manager", lastSeen: "2026-10-08T17:40:00+05:00" },
    { id: 3, email: "editor@travelwithmoeen.com", role: "editor", lastSeen: "2026-10-07T11:00:00+05:00" },
    { id: 4, email: "sana.editor@travelwithmoeen.com", role: "editor", lastSeen: "" },
  ];
  const activity = [
    { at: "2026-10-09T09:20:00+05:00", who: "moeen@travelwithmoeen.com", text: "Changed season profit to 20 percent", href: "#/rates/season" },
    { at: "2026-10-09T08:55:00+05:00", who: "manager@travelwithmoeen.com", text: "Saved 3 hotel rates for Skardu Valley", href: "#/rates/hotels" },
    { at: "2026-10-08T17:40:00+05:00", who: "manager@travelwithmoeen.com", text: "Moved Hamza Raza to In progress", href: "#/requests/2" },
    { at: "2026-10-08T12:10:00+05:00", who: "editor@travelwithmoeen.com", text: "Saved tour 3 Days By Road Trip to Naran Kaghan and Babusar Top", href: "#/tours/121" },
    { at: "2026-10-07T16:05:00+05:00", who: "sana.editor@travelwithmoeen.com", text: "Added a gallery photo", href: "#/gallery" },
    { at: "2026-10-07T11:00:00+05:00", who: "editor@travelwithmoeen.com", text: "Saved place Hunza Valley", href: "#/places/hunza-valley" },
  ];
  const catalog = [
    { city: "Skardu", hotel: "Shangrila", room: "Deluxe", persons: 2, mattress: 2500, rate: 18000 },
    { city: "Skardu", hotel: "Shangrila", room: "Standard", persons: 2, mattress: 2000, rate: 12000 },
    { city: "Skardu", hotel: "Himalaya", room: "Deluxe", persons: 2, mattress: 2500, rate: 16000 },
    { city: "Hunza", hotel: "Hunza Embassy", room: "Deluxe", persons: 2, mattress: 3000, rate: 20000 },
    { city: "Gilgit", hotel: "Serena Gilgit", room: "Deluxe", persons: 2, mattress: 2500, rate: 15000 },
  ];
  const nights = [1, 2, 3, 4].map((n) => ({ n, city: "Skardu", hotel: "Shangrila", room: "Deluxe", persons: 2, mattresses: 0, custom: false }));
  for (const tour of tours) {
    const hit = places.find((place) => {
      const word = place.title.toLowerCase().split(" ")[0];
      return tour.location.toLowerCase().includes(word) || place.title.toLowerCase().includes(String(tour.region).toLowerCase());
    });
    tour.placeSlug = hit ? hit.slug : "";
  }
  const plans = {
    petrol: 280, diesel: 290, gli: 14, prado: 5, guideNear: 4000, guideFar: 7000, khunjerab: 1500, deosai: 800, sticker: "vehicle",
    stops: [{ place: "Skardu", stop: "Shangrila", time: "2 hours" }, { place: "Skardu", stop: "Upper Kachura", time: "1 hour" }, { place: "Hunza", stop: "Attabad", time: "45 minutes" }, { place: "Hunza", stop: "Khunjerab", time: "3 hours" }, { place: "Gilgit", stop: "Serena Gilgit", time: "30 minutes" }],
  };
  return { activity, tours, places, posts, photos: content.photos, reviews, slides, site, requests, hotels, vehicles, jeeps, backups, users, season: 20, catalog, nights, pick: { city: "Skardu", hotel: "Shangrila", room: "Deluxe", occ: "room" }, plans,
    air: { islamabadTicket: 60000, lahoreAdd: 10000, karachiAdd: 30000, welcomePack: 1500, entry: 4000, infantExtra: 1000, sticker: 500 } };
})();

/* ------------------------------------------------------------------ */
/* Tokens per version and theme                                        */
/* ------------------------------------------------------------------ */
const hc = (primary, extra = {}) => ({
  canvas: "#ffffff", surface: "#ffffff", "surface-2": "#efefef", "surface-3": "#dcdcdc", "surface-hover": "#e4e4e4", selected: "#fff2b3", "field-bg": "#ffffff",
  border: "#000000", "border-strong": "#000000", "card-line": "#000000", text: "#000000", "text-2": "#1a1a1a", "text-3": "#2e2e2e", link: "#0030a0",
  primary, "primary-hover": "#000000", "on-primary": "#ffffff", "primary-soft": "#e3ebff", "primary-soft-text": "#001a57", focus: "#000000",
  danger: "#a00000", "on-danger": "#ffffff", "danger-soft": "#ffecec", "danger-text": "#8a0000",
  "success-soft": "#e6f7ea", "success-text": "#004d1a", "warning-soft": "#fff1cc", "warning-text": "#5c3100", "info-soft": "#e3ebff", "info-text": "#001a57",
  accent: "#ffd400", "accent-soft": "#ffe880", "accent-text": "#000000", "accent-ink": "#000000",
  "nav-bg": "#000000", "nav-text": "#ffffff", "nav-muted": "#e6e6e6", "nav-hover": "#2b2b2b", "nav-active": "#ffd400", "nav-active-text": "#000000", "nav-indicator": "#ffffff", "nav-line": "#ffffff",
  "logo-bg": "#ffd400", "logo-ink": "#000000", "topbar-bg": "#ffffff", "warning-dot": "#000000",
  overlay: "rgba(0,0,0,.75)", "shadow-1": "none", "shadow-2": "none", "shadow-3": "0 0 0 3px #000", ...extra,
});

const VERSIONS = [
  {
    id: "meadow", file: "meadow.html", name: "Meadow", tagline: "Calm workspace", num: 1,
    fonts: "family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500",
    shell: "side", list: "rows", edit: "drawer", requests: "inbox", palette: true, hero: false,
    inspiration: "Linear, Notion, and Apple's Human Interface Guidelines",
    summary: "A quiet, professional workspace. A pale collapsible sidebar, soft cards, a Ctrl K command bar, an inbox for requests, and editors that slide in beside the list so you never lose your place.",
    traits: ["Light sidebar that collapses to an icon rail; the current page is a white pill.", "Ctrl K jumps to any page, tour, place, post, or request, with your recent items first.", "Editing opens in a drawer beside the list, with previous and next, section links, a wide mode, View on site, and who saved it last.", "The save bar counts unsaved changes and marks each edited field. Ctrl S saves.", "Requests work like an inbox: Call, WhatsApp, and Email buttons, one-click status with undo, j and k to move.", "The dashboard shows what needs attention and a log of recent changes.", "Appearance and density are per-person settings in the account menu."],
    principles: [["Stay in flow", "Edit without leaving the list. Move to the next record with j, close with Esc, and you are where you were."], ["Keyboard first, mouse friendly", "Every common action has a shortcut, and every shortcut has a button."], ["Always show the state", "Unsaved changes are counted and marked, saves and status changes can be undone, and every change is logged with who made it."], ["Calm by default", "Low-contrast chrome, strong contrast where it matters: text, fields, focus."], ["Point to the next step", "The dashboard lists what needs attention, and every empty or no-match screen says what to do."]],
    fontNote: "Inter with stylistic sets for clearer 1, l, and I. Tight letter spacing on headings. JetBrains Mono for codes.",
    shapeNote: "8 px controls, 12 px cards, 16 px dialogs. Soft two-layer shadows.",
    type: [["Page title · 600 24/32", "font:600 24px/32px var(--font);letter-spacing:-.02em", "Requests"], ["Section · 600 16/24", "font:600 16px/24px var(--font)", "Latest requests"], ["Body · 400 14/20", "font:400 14px/20px var(--font)", "Family of 5, Hunza and Khunjerab, 7 days in late October."], ["Label · 500 14/20", "font:500 14px/20px var(--font)", "Twin room rate"], ["Nav · 500 13.5", "font:500 13.5px/20px var(--font)", "Rates and quotes"], ["Code · JetBrains Mono 13", "font:400 13px/20px var(--font-mono)", "backups/preview-2026-10-09.json"]],
    patterns: [["Navigation", "Light sidebar with groups and an icon-rail mode ( [ ); command bar ( Ctrl K ); New menu for quick create; account menu for appearance, density, shortcuts, and sign out. Under 960 px the sidebar becomes a drawer."], ["Lists", "Rows with thumbnail, details, and badges; search ( / ), filters, sort, a live count, and a No matches state with Clear filters."], ["Editing", "Right-hand drawer over the list: position and previous or next ( j k ), View on site, Expand, section chips, last saved by. Changed fields are marked, the save bar counts them, Ctrl S saves, and leaving asks first."], ["Requests", "Inbox split view with Call, WhatsApp, and Email; status is a segmented control that saves at once with Undo. On phones, list and message are separate screens."], ["Dashboard", "Counts, latest requests, Needs attention, recent activity, and quick actions, all filtered by role."], ["Deletes", "Confirm dialog for tours, logins, and roles; Undo for photos, reviews, slides, requests, and status changes."], ["Tabs", "Segmented control for rate types and request statuses."]],
    tokens: {
      light: { canvas: "#fbfbfa", surface: "#ffffff", "surface-2": "#f4f4f2", "surface-hover": "#f0f0ee", selected: "#e3f3ef", "field-bg": "#ffffff", border: "#e6e6e3", "border-strong": "#7e848e", "card-line": "#e6e6e3", text: "#1d2025", "text-2": "#4a515c", "text-3": "#5f6672", link: "#0b6b62",
        primary: "#0f766e", "primary-hover": "#115e59", "on-primary": "#ffffff", "primary-soft": "#e3f3ef", "primary-soft-text": "#0b5a53", focus: "#0f766e",
        danger: "#c53030", "on-danger": "#ffffff", "danger-soft": "#fdeeee", "danger-text": "#a31b1b", "success-soft": "#e7f5ec", "success-text": "#1c6a39", "warning-soft": "#fdf3df", "warning-text": "#7d4c00", "info-soft": "#e9f0fb", "info-text": "#1d4c8c",
        accent: "#f5b100", "accent-soft": "#fff1cc", "accent-text": "#674800", "accent-ink": "#2b1d00",
        "nav-bg": "#f5f5f3", "nav-text": "#262a31", "nav-muted": "#5f6672", "nav-hover": "#ebebe8", "nav-active": "#ffffff", "nav-active-text": "#0b5a53", "nav-indicator": "#0f766e", "nav-line": "#e6e6e3",
        "logo-bg": "#0f766e", "logo-ink": "#ffffff", "topbar-bg": "#fbfbfa", "warning-dot": "#d48806", overlay: "rgba(20,22,26,.4)",
        "shadow-1": "0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.07)", "shadow-2": "0 6px 16px -4px rgba(16,24,40,.12), 0 2px 4px rgba(16,24,40,.05)", "shadow-3": "0 24px 48px -12px rgba(16,24,40,.25)" },
      dark: { canvas: "#111214", surface: "#18191c", "surface-2": "#1f2024", "surface-hover": "#232428", selected: "#12302c", "field-bg": "#18191c", border: "#2a2c31", "border-strong": "#7b818c", "card-line": "#2a2c31", text: "#ecedee", "text-2": "#b4b8bf", "text-3": "#959ba5", link: "#5fd4c4",
        primary: "#2dd4bf", "primary-hover": "#5eead4", "on-primary": "#04201d", "primary-soft": "#11302c", "primary-soft-text": "#7ee8d9", focus: "#5eead4",
        danger: "#f87171", "on-danger": "#2a0909", "danger-soft": "#3a1717", "danger-text": "#fca5a5", "success-soft": "#102a1a", "success-text": "#86efac", "warning-soft": "#33240a", "warning-text": "#fcd34d", "info-soft": "#13223a", "info-text": "#93c5fd",
        accent: "#fbbf24", "accent-soft": "#33280a", "accent-text": "#fde68a", "accent-ink": "#2b1d00",
        "nav-bg": "#141518", "nav-text": "#d4d6da", "nav-muted": "#959ba5", "nav-hover": "#1d1e22", "nav-active": "#26282d", "nav-active-text": "#ffffff", "nav-indicator": "#2dd4bf", "nav-line": "#2a2c31",
        "logo-bg": "#2dd4bf", "logo-ink": "#04201d", "topbar-bg": "#111214", "warning-dot": "#fbbf24", overlay: "rgba(0,0,0,.6)",
        "shadow-1": "0 1px 2px rgba(0,0,0,.4)", "shadow-2": "0 8px 20px -6px rgba(0,0,0,.6)", "shadow-3": "0 24px 48px -12px rgba(0,0,0,.7)" },
      hc: hc("#00544c", { "nav-bg": "#ffffff", "nav-text": "#000000", "nav-muted": "#1a1a1a", "nav-hover": "#e4e4e4", "nav-active": "#000000", "nav-active-text": "#ffffff", "nav-indicator": "#ffffff", "nav-line": "#000000", "logo-bg": "#000000", "logo-ink": "#ffffff" }),
    },
  },
];

/* ------------------------------------------------------------------ */
/* Contrast check: every version, every theme                          */
/* ------------------------------------------------------------------ */
const PAIRS = [
  ["Body text", "text", "surface", 4.5], ["Body text on canvas", "text", "canvas", 4.5], ["Secondary text", "text-2", "surface", 4.5], ["Secondary text on canvas", "text-2", "canvas", 4.5],
  ["Meta text", "text-3", "surface", 4.5], ["Meta text on sunken", "text-3", "surface-2", 4.5], ["Link", "link", "surface", 4.5], ["Text in a field", "text", "field-bg", 4.5], ["Placeholder", "text-3", "field-bg", 4.5],
  ["Primary button label", "on-primary", "primary", 4.5], ["Primary button hover", "on-primary", "primary-hover", 4.5], ["Danger button label", "on-danger", "danger", 4.5],
  ["Danger text", "danger-text", "surface", 4.5], ["Error on red tint", "danger-text", "danger-soft", 4.5], ["Success badge", "success-text", "success-soft", 4.5], ["Warning badge", "warning-text", "warning-soft", 4.5],
  ["Info badge", "info-text", "info-soft", 4.5], ["Featured badge", "accent-text", "accent-soft", 4.5], ["Count bubble", "accent-ink", "accent", 4.5], ["Selected row", "text", "selected", 4.5], ["Soft primary", "primary-soft-text", "primary-soft", 4.5],
  ["Nav link", "nav-text", "nav-bg", 4.5], ["Nav section label", "nav-muted", "nav-bg", 4.5], ["Nav current page", "nav-active-text", "nav-active", 4.5], ["Logo", "logo-ink", "logo-bg", 4.5],
  ["Field outline", "border-strong", "surface", 3], ["Field outline on field", "border-strong", "field-bg", 3], ["Focus ring", "focus", "surface", 3], ["Focus ring on canvas", "focus", "canvas", 3],
  ["Checked control", "primary", "surface", 3], ["Danger outline", "danger", "surface", 3], ["Star rating", "accent-text", "surface", 3],
];
const lum = (h) => { const m = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
let failures = 0;
for (const v of VERSIONS) for (const [t, tok] of Object.entries(v.tokens)) {
  const ok = PAIRS.filter(([n, f, b, need]) => {
    if (!tok[f] || !tok[b]) { console.log(`MISSING ${v.id}/${t}: ${f} or ${b}`); failures++; return false; }
    const r = ratio(tok[f], tok[b]);
    if (r < need) { console.log(`FAIL ${v.id}/${t}: ${n} ${f} on ${b} = ${r.toFixed(2)} (needs ${need})`); failures++; return false; }
    return true;
  }).length;
  console.log(`${v.name.padEnd(7)} ${t.padEnd(5)} ${ok}/${PAIRS.length}`);
}
if (failures) { console.error(`\n${failures} contrast problems. Nothing written.`); process.exit(1); }

/* ------------------------------------------------------------------ */
/* Write files                                                          */
/* ------------------------------------------------------------------ */
const block = (o) => Object.entries(o).map(([k, val]) => `  --${k}: ${val};`).join("\n");
const themeCss = (v) => [
  `:root {\n${block(v.tokens.light)}\n  color-scheme: light;\n}`,
  `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]):not([data-theme="hc"]) {\n${block(v.tokens.dark).replace(/^/gm, "  ")}\n    color-scheme: dark;\n  }\n}`,
  `@media (prefers-contrast: more) {\n  :root:not([data-theme]) {\n${block(v.tokens.hc).replace(/^/gm, "  ")}\n  }\n}`,
  `:root[data-theme="dark"] {\n${block(v.tokens.dark)}\n  color-scheme: dark;\n}`,
  `:root[data-theme="hc"] {\n${block(v.tokens.hc)}\n  color-scheme: light;\n}`,
].join("\n");
const js = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const base = read("base.css"), engine = [read("core.js"), read("screens.js"), read("app.js")].join("\n");

for (const v of VERSIONS) {
  const tcss = themeCss(v);
  const cfg = { ...v, tokens: undefined, others: [] };
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${v.name} · Office prototype</title>
<meta name="description" content="Meadow, the Travel With Moeen office design: a clickable prototype with its design system.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${v.fonts}&display=swap" rel="stylesheet">
<style>
${tcss}
${base}
${read(`${v.id}.css`)}
</style>
</head>
<body>
<div id="app"></div>
<div id="toasts" class="toasts"></div>
<div id="dlg-root"></div>
<div id="pal-root"></div>
<noscript><p style="padding:24px">This prototype needs JavaScript.</p></noscript>
<script>window.VERSION=${js(cfg)};window.TWM_SEED=${js(seed)};window.CONTRAST_PAIRS=${js(PAIRS)};window.TOKEN_CSS=${js(tcss)};</script>
<script>
${engine}
</script>
</body>
</html>
`;
  writeFileSync(join(OUT, v.file), html);
  console.log(`wrote ${v.file} (${Math.round(html.length / 1024)} KB)`);
}

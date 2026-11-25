import type { PackageDocument } from "@/lib/office/quote-package";
import type { PackageSection, SectionRow } from "@/lib/package";

// T-61 (design section 15): the package document as one HTML page with inline styles, in the order
// of the sample package: header, At a Glance, Day-by-Day, Package Category & Pricing, Services, the
// Flight Ticket Note, then the fixed sections in order. The same page prints to PDF on A4 and, sent as
// application/msword, opens in Word, so the layout uses tables, which Word reads, not grid or flex.
// Every value is escaped. It never holds the subtotal, the lines, or the profit (BR-66).

const NAVY = "#0b3d91";
const GOLD = "#d4900f";
const LABEL = "#a8680c";
const INK = "#1f2933";
const MUTED = "#5f6b7a";
const LINE = "#d9dee7";
const PALE = "#e6ecf7";
const FONT = "font-family:Calibri,'Segoe UI',Arial,sans-serif;";
const SERIF = "font-family:Cambria,Georgia,'Times New Roman',serif;";

export const TAGLINE = "Explore Pakistan with Moeen — Where Every Journey Becomes a Memory!";

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function amount(value: number) {
  return value.toLocaleString("en-US");
}

function two(value: number) {
  return String(value).padStart(2, "0");
}

function heading(text: string) {
  return `<h2 style="${SERIF}color:${NAVY};font-size:20px;margin:26px 0 0;padding-bottom:6px;border-bottom:2px solid ${GOLD};page-break-after:avoid;">${escapeHtml(text)}</h2>`;
}

function absolute(address: string, origin: string) {
  if (/^https?:\/\//i.test(address)) return address;
  return `${origin}${address.startsWith("/") ? "" : "/"}${address}`;
}

function pictures(list: string[], origin: string, forWord: boolean) {
  if (list.length === 0) return "";
  // The first picture is the widest, as in the sample.
  const widths = list.length === 1 ? [100] : list.length === 2 ? [66, 34] : [50, 25, 25];
  const cells = list
    .map((address, index) => {
      const size = forWord ? `width="${Math.round(6.9 * widths[index] * 0.96)}"` : `style="display:block;width:100%;height:230px;object-fit:cover;"`;
      return `<td style="width:${widths[index]}%;padding:0 ${index < list.length - 1 ? "6px" : "0"} 0 0;vertical-align:top;"><img src="${escapeHtml(absolute(address, origin))}" alt="" ${size}></td>`;
    })
    .join("");
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:0;"><tr>${cells}</tr></table>`;
}

function glanceCell(label: string, value: string, note: string | null = null) {
  return `<td class="stack-cell" style="width:33%;border:1px solid ${LINE};padding:12px 14px;vertical-align:top;">
<div style="color:${LABEL};font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(label)}</div>
<div style="font-weight:bold;margin-top:4px;">${escapeHtml(value)}</div>${note ? `<div style="color:${MUTED};margin-top:2px;">(${escapeHtml(note)})</div>` : ""}</td>`;
}

function dayRows(doc: PackageDocument) {
  return doc.days
    .map((day, index) => {
      const last = index === doc.days.length - 1;
      // The last day has no night, so its overnight text, such as "End of services", stands alone.
      const overnight = last ? escapeHtml(day.overnight) : `Overnight: ${escapeHtml(day.overnight)}`;
      const shade = index % 2 === 0 ? "#ffffff" : "#f5f8fd";
      const sections = day.sections
        .map(
          (section) =>
            `<p style="margin:0 0 8px;"><b style="color:${NAVY};text-transform:uppercase;">${escapeHtml(section.label)}</b>&nbsp; ${escapeHtml(section.text).replace(/\n/g, "<br>")}</p>`,
        )
        .join("");
      return `<tr style="page-break-inside:avoid;">
<td style="width:26%;background:${PALE};border:1px solid ${LINE};padding:12px 14px;vertical-align:top;">
<div style="${SERIF}color:${NAVY};font-size:18px;font-weight:bold;">DAY ${two(day.day)}</div>
<div style="font-weight:bold;margin-top:4px;">${escapeHtml(day.title)}</div>
<div style="color:${MUTED};margin-top:4px;">${overnight}</div></td>
<td style="background:${shade};border:1px solid ${LINE};padding:12px 14px;vertical-align:top;">${sections}</td></tr>`;
    })
    .join("");
}

function priceRows(doc: PackageDocument) {
  return doc.prices
    .map(
      (price, index) => `<tr style="page-break-inside:avoid;">
<td style="width:18%;background:${PALE};border:1px solid ${LINE};padding:12px 14px;color:${NAVY};font-weight:bold;">${escapeHtml(price.grade)}</td>
<td style="border:1px solid ${LINE};padding:12px 14px;${index === 0 ? "background:#fdf8ea;" : ""}">${escapeHtml(price.hotels)}</td>
<td style="width:22%;border:1px solid ${LINE};padding:12px 14px;text-align:center;${index === 0 ? "background:#fdf8ea;" : ""}">
<div style="color:${NAVY};font-weight:bold;font-size:16px;">${amount(price.total)}</div>${
        price.perPerson === null ? "" : `<div style="color:${MUTED};">${amount(price.perPerson)} per person</div>`
      }</td></tr>`,
    )
    .join("");
}

function services(doc: PackageDocument) {
  const rows = Math.max(doc.included.length, doc.notIncluded.length);
  const cells: string[] = [];
  for (let index = 0; index < rows; index += 1) {
    const yes = doc.included[index];
    const no = doc.notIncluded[index];
    cells.push(`<tr>
<td style="width:50%;background:#f1f8f3;border-left:1px solid ${LINE};border-right:1px solid ${LINE};padding:8px 14px;vertical-align:top;">${yes ? `<span style="color:#1e7b3c;">✓</span> ${escapeHtml(yes)}` : ""}</td>
<td style="width:50%;background:#fdf3f2;border-right:1px solid ${LINE};padding:8px 14px;vertical-align:top;">${no ? `<span style="color:#b3261e;">✕</span> ${escapeHtml(no)}` : ""}</td></tr>`);
  }
  return `<table style="width:100%;border-collapse:collapse;margin-top:12px;border-bottom:1px solid ${LINE};">
<tr><th style="background:#1e7b3c;color:#fff;text-align:left;padding:10px 14px;">✓ SERVICES INCLUDED</th><th style="background:#b3261e;color:#fff;text-align:left;padding:10px 14px;">✕ SERVICES NOT INCLUDED</th></tr>
${cells.join("")}</table>`;
}

function flightNote(doc: PackageDocument) {
  if (!doc.flightNote) return "";
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin-top:18px;page-break-inside:avoid;"><tr>
<td style="width:44px;background:${GOLD};color:#fff;font-weight:bold;font-size:20px;text-align:center;">!</td>
<td style="background:#fdf3dc;border:1px solid #efd9a4;padding:12px 16px;">
<div style="${SERIF}color:#7a4f00;font-weight:bold;font-size:17px;">Flight Ticket Note</div>
<div style="margin-top:4px;">Ticket fare is set at Rs. ${amount(doc.flightNote.adult)} per adult and Rs. ${amount(doc.flightNote.child)} per child. Any fare increase above these amounts will be charged to the client.</div></td></tr></table>`;
}

function textBody(body: string[]) {
  return body.map((paragraph) => `<p style="margin:12px 0 0;">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
}

// Rows show as a two-column table with no heading row, as agreed for T-61.
function rowsBody(body: SectionRow[]) {
  const rows = body
    .map(
      (row, index) => `<tr style="page-break-inside:avoid;">
<td style="width:34%;background:${PALE};border:1px solid ${LINE};padding:10px 14px;color:${NAVY};font-weight:bold;vertical-align:top;">${escapeHtml(row.label)}</td>
<td style="background:${index % 2 === 0 ? "#ffffff" : "#f5f8fd"};border:1px solid ${LINE};padding:10px 14px;vertical-align:top;">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>`;
}

function stepsBody(body: string[]) {
  const rows = body
    .map(
      (step, index) => `<tr style="page-break-inside:avoid;">
<td style="width:40px;background:${GOLD};color:#fff;font-weight:bold;text-align:center;border:1px solid ${LINE};padding:10px 6px;">${two(index + 1)}</td>
<td style="background:${index % 2 === 0 ? "#ffffff" : "#fffcf3"};border:1px solid ${LINE};padding:10px 14px;">${escapeHtml(step)}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>`;
}

function fixedSection(section: PackageSection) {
  const body =
    section.kind === "text" ? textBody(section.body as string[]) : section.kind === "rows" ? rowsBody(section.body as SectionRow[]) : stepsBody(section.body as string[]);
  return `<div style="page-break-inside:avoid;">${heading(section.title)}${body}</div>`;
}

export type PackageHtmlOptions = {
  // The site address, so a gallery picture such as /images/gallery/1.webp also loads in Word.
  origin: string;
  forWord?: boolean;
  // Opens the print dialog when the page loads, for Download PDF.
  print?: boolean;
};

export function renderPackageHtml(doc: PackageDocument, { origin, forWord = false, print = false }: PackageHtmlOptions) {
  const badge = doc.badge
    ? `<div style="color:#fde7c8;font-weight:bold;letter-spacing:2px;text-transform:uppercase;font-size:14px;">${escapeHtml(doc.badge)}</div>`
    : "";
  const intro = doc.intro ? `<p style="color:${MUTED};margin:14px 0 0;font-size:15px;">${escapeHtml(doc.intro)}</p>` : "";
  const word = forWord ? ` xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"` : "";
  const printScript = print ? `<script>window.addEventListener("load", function () { window.print(); });</script>` : "";
  return `<!doctype html>
<html lang="en"${word}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(doc.title)}</title>
<style>
@page { size: A4; margin: 12mm; }
@media print { body { padding: 0 !important; } .sheet { max-width: none !important; } }
@media screen and (max-width: 560px) { .stack-cell { display: block; width: auto !important; } h1 { font-size: 22px !important; } }
</style>
</head>
<body style="margin:0;background:#ffffff;color:${INK};${FONT}font-size:14px;line-height:1.55;padding:24px 16px;">
<div class="sheet" style="max-width:850px;margin:0 auto;">
<div style="background:#a8521a;color:#ffffff;text-align:center;padding:18px 20px 14px;">
${badge}
<h1 style="${SERIF}font-size:28px;margin:6px 0 4px;color:#ffffff;">${escapeHtml(doc.title)}</h1>
<div style="color:#fde7c8;">${escapeHtml(doc.route)}</div>
</div>
${pictures(doc.pictures, origin, forWord)}
${intro}
<p style="text-align:center;color:${MUTED};margin:14px 0 0;">${escapeHtml(doc.headline)}</p>
${heading("At a Glance")}
<table style="width:100%;border-collapse:collapse;margin-top:0;">
<tr>${glanceCell("Route", doc.route, doc.routeOptions)}${glanceCell("Duration", doc.duration)}${glanceCell("Accommodation", doc.accommodation)}</tr>
<tr>${glanceCell("Transport", doc.transport)}${glanceCell("Travellers", doc.travellers)}${glanceCell("Meals", doc.meals)}</tr>
</table>
${heading("Day-by-Day Itinerary")}
<table style="width:100%;border-collapse:collapse;margin-top:0;">
<tr><th style="background:${NAVY};color:#fff;text-align:left;padding:10px 14px;">Day / Highlight</th><th style="background:${NAVY};color:#fff;text-align:left;padding:10px 14px;">Programme Details</th></tr>
${dayRows(doc)}
</table>
${heading("Package Category & Pricing")}
<table style="width:100%;border-collapse:collapse;margin-top:0;">
<tr><th style="background:${NAVY};color:#fff;text-align:left;padding:10px 14px;">Category</th><th style="background:${NAVY};color:#fff;text-align:left;padding:10px 14px;">Hotels &amp; Resorts — Options</th><th style="background:${NAVY};color:#fff;text-align:center;padding:10px 14px;">${escapeHtml(doc.priceHeading)}</th></tr>
${priceRows(doc)}
</table>
<div style="page-break-inside:avoid;break-inside:avoid;">
${heading("Services Included & Not Included")}
${services(doc)}
</div>
${flightNote(doc)}
${doc.sections.map(fixedSection).join("\n")}
<div style="background:${NAVY};color:#ffffff;text-align:center;padding:14px 20px;margin-top:28px;${SERIF}font-style:italic;font-weight:bold;">${escapeHtml(TAGLINE)}</div>
</div>
${printScript}
</body>
</html>`;
}

// A file name for the Word download, from the title: letters, digits, spaces, and dashes only.
export function packageFileName(title: string) {
  const name = title.replace(/[^A-Za-z0-9 &()-]+/g, " ").replace(/&/g, "and").replace(/\s+/g, " ").trim();
  return `${name || "Package"}.doc`;
}

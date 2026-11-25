import { requireUser } from "@/lib/auth/session";
import { handleOfficeForm } from "@/lib/http/handle-form";
import { escapeHtml, packageFileName, renderPackageHtml } from "@/lib/package-document";
import { packageDocumentAs, saveQuotePackageAs } from "@/lib/office/quote-package";

// T-61 (BR-109 to BR-116, BR-66): the package document of a saved quote, built from today's data on
// each download. A page to print to PDF, or with ?format=word the same page as a Word file. It never
// holds the subtotal, the lines, or the profit. Owner and Manager only.
function messagePage(message: string, status: number) {
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Package</title></head><body style="margin:0;padding:24px 16px;font-family:Calibri,'Segoe UI',Arial,sans-serif;background:#ffffff;color:#1f2933;"><p>${escapeHtml(message)}</p></body></html>`;
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function GET(request: Request, context: RouteContext<"/api/office/quotes/[id]/package">) {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return messagePage("Sign in again.", 401);
  }
  const { id } = await context.params;
  const built = await packageDocumentAs(actor, id);
  if (!built.ok) {
    const status = "status" in built ? built.status : 400;
    return messagePage(built.error, status);
  }
  const url = new URL(request.url);
  const forWord = url.searchParams.get("format") === "word";
  const html = renderPackageHtml(built.document, { origin: url.origin, forWord, print: !forWord && url.searchParams.get("print") === "1" });
  if (forWord) {
    return new Response(`﻿${html}`, {
      headers: {
        "Content-Type": "application/msword; charset=utf-8",
        "Content-Disposition": `attachment; filename="${packageFileName(built.document.title)}"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function POST(request: Request, context: RouteContext<"/api/office/quotes/[id]/package">) {
  const { id } = await context.params;
  return handleOfficeForm(request, (actor, formData) => saveQuotePackageAs(actor, id, formData));
}

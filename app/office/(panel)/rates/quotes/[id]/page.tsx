import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { PackageTab } from "@/components/office/rates/PackageTab";
import { SavedQuoteSummary } from "@/components/office/rates/SavedQuoteSummary";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getSavedQuote } from "@/lib/http/site-content";

// T-61 (BR-109 to BR-116, design section 15): one saved quote, with a read-only Quote tab and the
// Package tab. Owner and Manager only, read through GET /api/office/quotes/[id].
export default async function SavedQuotePage({ params, searchParams }: PageProps<"/office/rates/quotes/[id]">) {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const { id } = await params;
  const query = await searchParams;
  const tab = query.tab === "package" ? "package" : "quote";
  const desk = await getSavedQuote(id);
  if (!desk) notFound();
  const href = `/office/rates/quotes/${desk.quote.id}`;
  const saved = await getSavedBy("quote_package", [desk.quote.id]);
  const savedBy = savedByText(saved[String(desk.quote.id)], requestTime());
  return (
    <div className="stack">
      <nav className="tabs" aria-label={`Quote ${desk.quote.id}`}>
        <Link className="tab" href={href} aria-current={tab === "quote" ? "page" : undefined}>
          Quote
        </Link>
        <Link className="tab" href={`${href}?tab=package`} aria-current={tab === "package" ? "page" : undefined}>
          Package
        </Link>
      </nav>
      {tab === "quote" ? <SavedQuoteSummary quote={desk.quote} /> : <PackageTab desk={desk} savedBy={savedBy} />}
    </div>
  );
}

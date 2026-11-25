import { Fragment } from "react";
import { formatDateTime } from "@/components/office/format";
import { Badge } from "@/components/office/ui/Badge";
import { Card } from "@/components/office/ui/Card";
import { Table } from "@/components/office/ui/Table";
import type { SavedQuoteDesk } from "@/lib/http/site-content";

type SavedQuote = SavedQuoteDesk["quote"];

function rupees(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function party(quote: SavedQuote) {
  const parts = [`${quote.adults} ${quote.adults === 1 ? "adult" : "adults"}`];
  if (quote.children > 0) parts.push(`${quote.children} ${quote.children === 1 ? "child" : "children"}`);
  if (quote.lapInfants > 0) parts.push(`${quote.lapInfants} lap ${quote.lapInfants === 1 ? "infant" : "infants"}`);
  if (quote.seatInfants > 0) parts.push(`${quote.seatInfants} ${quote.seatInfants === 1 ? "infant" : "infants"} with a seat`);
  return parts.join(", ");
}

// T-61: the Quote tab of a saved quote. It shows what was saved, as it was saved, and changes nothing.
// The package prices on the Package tab use today's rates.
export function SavedQuoteSummary({ quote }: { quote: SavedQuote }) {
  const vehicle = quote.vehicle.trim().toLowerCase() === "other" ? `Other${quote.otherNote ? `, ${quote.otherNote}` : ""}` : quote.vehicle;
  return (
    <div className="stack">
      <Card title={`Quote ${quote.id}`} description={`Saved ${formatDateTime(quote.createdAt)}. This is the quote as it was saved.`}>
        <dl className="dl">
          <dt>Place</dt>
          <dd>{quote.place}</dd>
          <dt>Start city</dt>
          <dd>{quote.startCity}</dd>
          <dt>Travel</dt>
          <dd>{quote.mode === "air" ? "By air" : "By road"}</dd>
          <dt>Days</dt>
          <dd>{quote.days}</dd>
          <dt>Travellers</dt>
          <dd>{party(quote)}</dd>
          <dt>Grade</dt>
          <dd>{quote.grade}</dd>
          <dt>Vehicle</dt>
          <dd>{vehicle}</dd>
          {quote.otherSeats !== null ? (
            <>
              <dt>Seats in each vehicle</dt>
              <dd>{quote.otherSeats}</dd>
            </>
          ) : null}
          <dt>Vehicles</dt>
          <dd>{quote.vehicleCount ?? "Auto"}</dd>
          <dt>Rooms</dt>
          <dd>{quote.roomCount ?? "Auto"}</dd>
          <dt>Guide</dt>
          <dd>{yesNo(quote.guide)}</dd>
          <dt>Dinner</dt>
          <dd>{yesNo(quote.meals)}</dd>
          <dt>Lunch</dt>
          <dd>{yesNo(quote.lunch)}</dd>
          {quote.mode === "air" ? (
            <>
              <dt>Air tickets</dt>
              <dd>{yesNo(quote.tickets)}</dd>
            </>
          ) : null}
          <dt>Profit margin</dt>
          <dd>{quote.seasonPercent} percent</dd>
        </dl>
      </Card>

      <Card title="Total" description="Staff only. A guest and the package never see the subtotal or the profit.">
        <dl className="dl">
          <dt>Subtotal</dt>
          <dd>{rupees(quote.subtotal)}</dd>
          <dt>Profit</dt>
          <dd>{rupees(quote.profit)}</dd>
          <dt>Total</dt>
          <dd>
            <b>{rupees(quote.total)}</b>
          </dd>
        </dl>
      </Card>

      {quote.nights.length > 0 ? (
        <Table label="Nights">
          <thead>
            <tr>
              <th scope="col">Night</th>
              <th scope="col">Hotel</th>
              <th scope="col" className="r">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.nights.map((night) => (
              <tr key={night.night}>
                <td>
                  <b>Night {night.night}</b>
                </td>
                <td data-label="Hotel">{night.hotelName || <span className="muted">No name</span>}</td>
                <td data-label="Rate" className="r">
                  {rupees(night.rate)} {night.typed ? <Badge tone="info">Typed</Badge> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}

      <Table label="Days">
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Vehicle</th>
            <th scope="col" className="r">
              Rent
            </th>
            <th scope="col" className="r">
              Fuel
            </th>
          </tr>
        </thead>
        <tbody>
          {quote.dayLines.map((day) => (
            <tr key={day.day}>
              <td>
                <b>Day {day.day}</b>
              </td>
              <td data-label="Vehicle">{day.cleared ? <span className="muted">Cleared</span> : day.vehicle}</td>
              <td data-label="Rent" className="r">
                {rupees(day.rent)}
              </td>
              <td data-label="Fuel" className="r">
                {rupees(day.fuel)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {quote.extras.length > 0 ? (
        <Card title="Paid extras">
          <dl className="dl">
            {quote.extras.map((extra, index) => (
              <Fragment key={index}>
                <dt>{extra.name}</dt>
                <dd>{rupees(extra.amount)}</dd>
              </Fragment>
            ))}
          </dl>
        </Card>
      ) : null}
    </div>
  );
}

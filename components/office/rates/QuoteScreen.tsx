"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Alert } from "@/components/office/ui/Alert";
import { Badge } from "@/components/office/ui/Badge";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { Table } from "@/components/office/ui/Table";
import { apiPath } from "@/lib/http/api-path";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import { GUEST_GRADES, MARGIN_MAX, type QuoteOptions, type TripMode } from "@/lib/quote";

// The fields of one quote. Their names are the fields POST /api/office/rates reads for kind=quote.
type QuoteFields = {
  place: string;
  mode: string;
  startCity: string;
  grade: string;
  vehicle: string;
  days: string;
  adults: string;
  children: string;
  lapInfants: string;
  seatInfants: string;
  seasonPercent: string;
  guide: boolean;
  // Dinner each night. The field keeps the name meals, which the server reads.
  meals: boolean;
  lunch: boolean;
  // BR-89: the air tickets, on unless staff turn them off.
  tickets: boolean;
  // BR-92: a count staff typed, or null for the automatic count.
  roomCount: string | null;
  vehicleCount: string | null;
  night: string;
  nightRate: string;
  nightHotel: string;
  day: string;
  dayChange: string;
  dayVehicle: string;
  dayRent: string;
  dayFuel: string;
  extraName: string;
  extraAmount: string;
  otherNote: string;
  otherRent: string;
  otherFuel: string;
  otherToll: string;
  otherSeats: string;
};

type QuoteResult = {
  ok: true;
  subtotal: number;
  profit: number;
  total: number;
  seasonPercent: number;
  lines: { label: string; amount: number; working: string }[];
  nights: { night: number; rate: number; hotelName: string }[];
  days: { day: number; vehicle: string; rent: number; fuel: number; toll: number; cleared: boolean }[];
  averageNightly: number;
  averageGrade: string;
  nearestGrade: boolean;
  hotelName: string;
  vehicleName: string;
  autoRooms: number;
  autoVehicleCount: number;
};

// The rates the Stay and services switches show beside each choice (BR-94).
export type QuoteRates = {
  guidePerDay: number | null;
  meals: { grade: string; dinner: number; lunch: number }[];
  islamabadTicket: number | null;
  airExtras: Record<string, number>;
};

type Priced = { result: QuoteResult } | { error: string } | null;

const OTHER = "Other";

function rupees(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-US")}`;
}

function isWhole(value: string) {
  return /^\d+$/.test(value.trim());
}

// The same quote as JSON for POST /api/quote, which prices it for an Owner or a Manager with the
// lines and the profit. The edits go as lists; this screen has one night edit and one day edit.
function quoteRequest(fields: QuoteFields) {
  const body: Record<string, unknown> = {
    place: fields.place,
    startCity: fields.startCity,
    mode: fields.mode,
    days: fields.days,
    adults: fields.adults,
    children: fields.children || "0",
    lapInfants: fields.lapInfants || "0",
    seatInfants: fields.seatInfants || "0",
    grade: fields.grade,
    vehicle: fields.vehicle,
    guide: fields.guide,
    meals: fields.meals,
    lunch: fields.lunch,
    tickets: fields.tickets,
    seasonPercent: fields.seasonPercent,
    otherNote: fields.otherNote,
  };
  if (fields.roomCount?.trim()) body.roomCount = fields.roomCount;
  if (fields.vehicleCount?.trim()) body.vehicleCount = fields.vehicleCount;
  if (fields.vehicle === OTHER) {
    Object.assign(body, { otherRent: fields.otherRent, otherFuel: fields.otherFuel, otherToll: fields.otherToll, otherSeats: fields.otherSeats });
  }
  if (fields.night.trim() || fields.nightRate.trim()) {
    body.nightEdits = [{ night: fields.night, rate: fields.nightRate, hotelName: fields.nightHotel }];
  }
  if (fields.dayChange === "clear") body.dayEdits = [{ day: fields.day, cleared: true }];
  if (fields.dayChange === "jeep") body.dayEdits = [{ day: fields.day, jeep: true, rent: fields.dayRent, fuel: fields.dayFuel }];
  if (fields.dayChange === "vehicle") body.dayEdits = [{ day: fields.day, vehicle: fields.dayVehicle }];
  if (fields.extraName.trim() || fields.extraAmount.trim()) {
    body.paidExtras = [{ name: fields.extraName, amount: fields.extraAmount }];
  }
  return body;
}

type QuoteScreenProps = {
  // The start cities for each travel mode, and the places offered from each (BR-90, BR-91).
  options: QuoteOptions;
  vehicles: string[];
  margin: number;
  rates: QuoteRates;
};

function tripMode(mode: string): TripMode {
  return mode === "air" ? "air" : "road";
}

// After the travel mode or the start city changes, the start city and the place stay among the ones
// offered: Islamabad and Skardu Valley when they are offered, otherwise the first of each list.
function offered(fields: QuoteFields, options: QuoteOptions): QuoteFields {
  const cities = options.startCities[tripMode(fields.mode)];
  const startCity = cities.includes(fields.startCity) ? fields.startCity : cities.includes("Islamabad") ? "Islamabad" : cities[0] ?? "";
  const places = options.places[tripMode(fields.mode)][startCity] ?? [];
  const place = places.includes(fields.place) ? fields.place : places.includes("Skardu Valley") ? "Skardu Valley" : places[0] ?? "";
  return startCity === fields.startCity && place === fields.place ? fields : { ...fields, startCity, place };
}

// The Quote tab, laid out like the costing desk (BR-94): Route, Party, Stay and services, then the
// changes, with the price and each line's working beside the form, or above it on a phone.
export function QuoteScreen({ options, vehicles, margin, rates }: QuoteScreenProps) {
  const [fields, setFields] = useState<QuoteFields>(() => offered({
    place: "Skardu Valley",
    mode: "road",
    startCity: "Islamabad",
    grade: "Deluxe",
    vehicle: vehicles.includes("Gli Car") ? "Gli Car" : vehicles[0] ?? OTHER,
    days: "5",
    adults: "2",
    children: "0",
    lapInfants: "0",
    seatInfants: "0",
    seasonPercent: String(margin),
    guide: false,
    meals: false,
    lunch: false,
    tickets: true,
    roomCount: null,
    vehicleCount: null,
    night: "",
    nightRate: "",
    nightHotel: "",
    day: "",
    dayChange: "",
    dayVehicle: "",
    dayRent: "",
    dayFuel: "",
    extraName: "",
    extraAmount: "",
    otherNote: "",
    otherRent: "",
    otherFuel: "",
    otherToll: "",
    otherSeats: "",
  }, options));
  const [priced, setPriced] = useState<Priced>(null);
  const [pricing, setPricing] = useState(false);
  const [saved, setSaved] = useState<ActionResult | null>(null);
  const [saving, startSaving] = useTransition();
  const requestCount = useRef(0);

  const set = <K extends keyof QuoteFields>(name: K, value: QuoteFields[K]) => {
    setSaved(null);
    setFields((current) => offered({ ...current, [name]: value }, options));
  };

  // Price the quote a moment after the last change. Only the newest answer is shown.
  useEffect(() => {
    const request = ++requestCount.current;
    const timer = window.setTimeout(async () => {
      setPricing(true);
      try {
        const response = await fetch(apiPath("/api/quote"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(quoteRequest(fields)),
        });
        const body = (await response.json()) as QuoteResult | { ok: false; error: string };
        if (request !== requestCount.current) return;
        setPriced(body.ok ? { result: body } : { error: body.error });
      } catch {
        if (request === requestCount.current) setPriced({ error: "The quote could not be priced. Check the connection." });
      } finally {
        if (request === requestCount.current) setPricing(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [fields]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    form.set("kind", "quote");
    for (const [name, value] of Object.entries(fields)) {
      if (value === null) continue;
      if (typeof value === "boolean") {
        // The tickets are on unless the form says off, so off is sent too.
        if (value) form.set(name, "on");
        else if (name === "tickets") form.set(name, "off");
      } else {
        form.set(name, value);
      }
    }
    startSaving(async () => setSaved(await postOfficeForm("/api/office/rates", form, "Saving quote")));
  };

  const result = priced && "result" in priced ? priced.result : null;
  const startCities = options.startCities[tripMode(fields.mode)];
  const places = options.places[tripMode(fields.mode)][fields.startCity] ?? [];
  const editedNight = Number(fields.night);
  const editedDay = fields.dayChange ? Number(fields.day) : 0;
  const marginSlider = isWhole(fields.seasonPercent) ? Math.min(Number(fields.seasonPercent), MARGIN_MAX) : margin;
  const text = (name: keyof QuoteFields, label: string, extra: { numeric?: boolean; optional?: boolean; help?: string } = {}) => (
    <Field id={`quote-${name}`} label={label} optional={extra.optional} help={extra.help}>
      <input
        className="input"
        id={`quote-${name}`}
        name={name}
        inputMode={extra.numeric ? "numeric" : undefined}
        autoComplete="off"
        value={String(fields[name])}
        aria-describedby={extra.help ? helpId(`quote-${name}`) : undefined}
        onChange={(event) => set(name, event.target.value)}
      />
    </Field>
  );
  const choose = (name: keyof QuoteFields, label: string, options: [string, string][], help?: string) => (
    <Field id={`quote-${name}`} label={label} help={help}>
      <select
        className="select"
        id={`quote-${name}`}
        name={name}
        value={String(fields[name])}
        aria-describedby={help ? helpId(`quote-${name}`) : undefined}
        onChange={(event) => set(name, event.target.value)}
      >
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </Field>
  );

  const air = fields.mode === "air";
  const mealRate = rates.meals.find((row) => row.grade === fields.grade);
  const adultFare = rates.islamabadTicket === null ? null : rates.islamabadTicket + (rates.airExtras[fields.startCity] ?? 0);
  const typed = fields.roomCount !== null || fields.vehicleCount !== null;
  // A count field shows the typed number, or the automatic one from the last price.
  const count = (name: "roomCount" | "vehicleCount", label: string, auto: number | undefined) => {
    const value = fields[name];
    return (
      <div className="field">
        <label className="label" htmlFor={`quote-${name}`}>
          {label} {value === null ? <Badge>Auto</Badge> : <Badge tone="accent">Typed</Badge>}
        </label>
        <input
          className="input"
          id={`quote-${name}`}
          name={name}
          inputMode="numeric"
          autoComplete="off"
          value={value ?? (auto === undefined ? "" : String(auto))}
          // On Auto the box shows the automatic count selected, so the first key replaces it: typing 3
          // gives 3, not 13. A click or a tap would put the caret back, so on Auto it selects again.
          onFocus={(event) => {
            if (value === null) event.currentTarget.select();
          }}
          onMouseUp={(event) => {
            if (value !== null) return;
            event.preventDefault();
            event.currentTarget.select();
          }}
          onChange={(event) => {
            const typed = event.target.value;
            if (typed.trim()) {
              set(name, typed);
              return;
            }
            // An emptied box goes back to Auto, and its automatic count is selected again, so the
            // next key replaces it.
            const input = event.currentTarget;
            set(name, null);
            window.requestAnimationFrame(() => {
              if (document.activeElement === input) input.select();
            });
          }}
        />
      </div>
    );
  };
  const service = (name: "tickets" | "guide" | "meals" | "lunch", label: string, rate: string) => (
    <label className="switch quote-service">
      <input type="checkbox" role="switch" name={name} checked={fields[name]} onChange={(event) => set(name, event.target.checked)} />
      <span className="track" aria-hidden="true">
        <span className="thumb" />
      </span>
      <span>
        {label}{" "}
        <small className="help quote-rate">{rate}</small>
      </span>
    </label>
  );

  return (
    <form onSubmit={submit} className="stack" aria-busy={saving || undefined}>
      <fieldset className="form-lock" disabled={saving}>
      <div className="quote-form">
        <div className="quote-side">
          <Card title="Route" description="Where the trip goes, how it travels, and for how long.">
            <div className="form-grid">
              {choose("mode", "Travel by", [["road", "Road"], ["air", "Air"]])}
              {choose(
                "startCity",
                "Start city",
                startCities.length ? startCities.map((city) => [city, city]) : [["", "No start city for this travel mode"]],
                "Only the start cities for this travel mode are offered.",
              )}
              {choose(
                "place",
                "Place",
                places.length ? places.map((place) => [place, place]) : [["", "No place is offered from this start city"]],
                "A place is offered when it has a hotel rate and a vehicle rate for this trip.",
              )}
              {text("days", "Days", { numeric: true })}
            </div>
          </Card>

          <Card title="Party" description="The travelers, the rooms, and the vehicles. Rooms and vehicles are worked out for you, and you can type a different count.">
            <div className="form-grid">
              {text("adults", "Adults", { numeric: true })}
              {text("children", "Children", { numeric: true })}
              {text("lapInfants", "Lap infants", { numeric: true })}
              {text("seatInfants", "Infants with a seat", { numeric: true })}
              {count("roomCount", "Rooms", result?.autoRooms)}
              {choose("vehicle", "Vehicle", [...vehicles.map((name): [string, string] => [name, name]), [OTHER, "Other, typed below"]])}
              {count("vehicleCount", "Vehicles", result?.autoVehicleCount)}
              <div className="field quote-auto">
                <Button
                  variant="ghost"
                  icon="refresh"
                  disabled={!typed}
                  onClick={() => {
                    setSaved(null);
                    setFields((current) => ({ ...current, roomCount: null, vehicleCount: null }));
                  }}
                >
                  Back to auto counts
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Stay and services" description="The hotel grade and what the quote includes, each with its rate.">
            <div className="form-grid">
              {choose("grade", "Hotel grade", GUEST_GRADES.map((grade) => [grade, grade]))}
              <div className="field full quote-services">
                {air ? service("tickets", "Air tickets", adultFare === null ? "" : `${rupees(adultFare)} an adult`) : null}
                {service("guide", "Tour guide", rates.guidePerDay === null ? "" : `${rupees(rates.guidePerDay)} a day`)}
                {service("meals", "Dinner", mealRate ? `${rupees(mealRate.dinner)} a person a night` : "No rate for this grade")}
                {service("lunch", "Lunch", mealRate ? `${rupees(mealRate.lunch)} a person a day` : "No rate for this grade")}
              </div>
              <div className="field">
                <label className="label" htmlFor="quote-seasonPercent">
                  Profit margin for this quote, percent
                </label>
                <input
                  className="input"
                  id="quote-seasonPercent"
                  name="seasonPercent"
                  inputMode="numeric"
                  autoComplete="off"
                  value={fields.seasonPercent}
                  aria-describedby={helpId("quote-seasonPercent")}
                  onChange={(event) => set("seasonPercent", event.target.value)}
                />
                <p className="help" id={helpId("quote-seasonPercent")}>
                  Starts at the saved margin, {margin} percent. Guests always get the saved margin.
                </p>
              </div>
              <div className="field">
                <label className="label" htmlFor="quote-margin-slider">
                  Profit margin slider
                </label>
                <input
                  className="range"
                  id="quote-margin-slider"
                  type="range"
                  min={0}
                  max={MARGIN_MAX}
                  step={1}
                  value={marginSlider}
                  aria-valuetext={`${marginSlider} percent`}
                  onChange={(event) => set("seasonPercent", event.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card title="Changes and extras" description="One night, one day, a paid extra, and a vehicle mix the rate tables do not have.">
            <div className="stack">
              {fields.vehicle === OTHER ? (
                <section className="quote-part" aria-labelledby="quote-other-head">
                  <h4 id="quote-other-head">Other vehicle</h4>
                  <p className="help">Every amount is checked by the server.</p>
                  <div className="form-grid">
                    <div className="field full">
                      <label className="label" htmlFor="quote-otherNote">
                        The mix
                      </label>
                      <input className="input" id="quote-otherNote" name="otherNote" value={fields.otherNote} placeholder="For example, a Prado and a Gli car" onChange={(event) => set("otherNote", event.target.value)} />
                    </div>
                    {text("otherRent", "Rent per day", { numeric: true })}
                    {text("otherFuel", "Fuel per day", { numeric: true })}
                    {text("otherToll", "Toll", { numeric: true })}
                    {text("otherSeats", "Seats", { numeric: true })}
                  </div>
                </section>
              ) : null}
              <section className="quote-part" aria-labelledby="quote-night-head">
                <h4 id="quote-night-head">Change one night</h4>
                <p className="help">A different hotel rate on one night. The other nights stay as they were.</p>
                <div className="form-grid">
                  {text("night", "Night number", { numeric: true, optional: true })}
                  {text("nightRate", "Rate for that night", { numeric: true, optional: true })}
                  <div className="field full">
                    <label className="label" htmlFor="quote-nightHotel">
                      Hotel for that night <span className="opt">(optional)</span>
                    </label>
                    <input className="input" id="quote-nightHotel" name="nightHotel" value={fields.nightHotel} onChange={(event) => set("nightHotel", event.target.value)} />
                  </div>
                </div>
              </section>
              <section className="quote-part" aria-labelledby="quote-day-head">
                <h4 id="quote-day-head">Change one day</h4>
                <p className="help">No vehicle, a jeep, or a higher vehicle on one day.</p>
                <div className="form-grid">
                  {choose("dayChange", "That day", [["", "Keep the vehicle"], ["clear", "No vehicle"], ["jeep", "Jeep"], ["vehicle", "Higher vehicle"]])}
                  {text("day", "Day number", { numeric: true, optional: !fields.dayChange })}
                  {fields.dayChange === "vehicle" ? choose("dayVehicle", "Higher vehicle", [["", "Choose a vehicle"], ...vehicles.map((name): [string, string] => [name, name])]) : null}
                  {fields.dayChange === "jeep" ? text("dayRent", "Jeep rent", { numeric: true }) : null}
                  {fields.dayChange === "jeep" ? text("dayFuel", "Jeep fuel", { numeric: true }) : null}
                </div>
              </section>
              <section className="quote-part" aria-labelledby="quote-extra-head">
                <h4 id="quote-extra-head">Paid extra</h4>
                <p className="help">One added cost, such as a permit or an entry ticket.</p>
                <div className="form-grid">
                  {text("extraName", "What it is", { optional: true })}
                  {text("extraAmount", "Amount", { numeric: true, optional: true })}
                </div>
              </section>
            </div>
          </Card>
          {result ? (
            <Card title="Nights and days" description="Each night's hotel rate and each day's vehicle. The edited night or day is marked.">
              <div className="form-grid">
                <Table label="Nights" flat>
                  <thead>
                    <tr>
                      <th scope="col">Night</th>
                      <th scope="col" className="r">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.nights.map((row) => (
                      <tr key={row.night} className={row.night === editedNight ? "is-edited" : undefined}>
                        <td>Night {row.night}</td>
                        <td className="r">{rupees(row.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Table label="Days" flat>
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Vehicle</th>
                      <th scope="col" className="r">
                        Rent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.days.map((row) => (
                      <tr key={row.day} className={row.day === editedDay ? "is-edited" : undefined}>
                        <td>Day {row.day}</td>
                        <td>{row.cleared ? "No vehicle" : row.vehicle}</td>
                        <td className="r">{rupees(row.rent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          ) : null}
        </div>

        <section className="card quote-result" aria-label="This quote" aria-busy={pricing}>
          <div className="card-head">
            <div>
              <h3>This quote</h3>
              <p>
                {fields.place}, {fields.days} days, {fields.adults} adults{pricing ? " · pricing…" : ""}
              </p>
            </div>
          </div>
          <div className="card-body" aria-live="polite">
            {priced && "error" in priced ? <Alert tone="warning" title="This quote cannot be priced yet" role="status">{priced.error}</Alert> : null}
            {result ? (
              <>
                <dl className="sum">
                  {result.lines.map((line, index) => (
                    <Fragment key={`${index}-${line.label}`}>
                      <dt>
                        {line.label}
                        {line.working ? <span className="help sum-working">{line.working}</span> : null}
                      </dt>
                      <dd>{rupees(line.amount)}</dd>
                    </Fragment>
                  ))}
                  <dt className="sum-sub">Subtotal</dt>
                  <dd className="sum-sub">{rupees(result.subtotal)}</dd>
                  <dt>Profit, {result.seasonPercent} percent</dt>
                  <dd>{rupees(result.profit)}</dd>
                  <dt className="sum-total">Guest total</dt>
                  <dd className="sum-total">{rupees(result.total)}</dd>
                  {result.averageNightly ? (
                    <>
                      <dt>Average nightly rate</dt>
                      <dd>{rupees(result.averageNightly)}</dd>
                      <dt>Hotel grade</dt>
                      <dd>
                        {result.averageGrade}
                        {result.nearestGrade ? " (nearest)" : ""}
                      </dd>
                    </>
                  ) : null}
                </dl>
                <p className="help">The guest sees one total, {rupees(result.total)}, with no lines and no profit.</p>
              </>
            ) : !priced ? (
              <p className="help">Pricing…</p>
            ) : null}
          </div>
        </section>
      </div>
      </fieldset>
      <SaveBar label="Save quote" pending={saving} result={saved} hint="Saving keeps this quote with its nights and days." />
    </form>
  );
}

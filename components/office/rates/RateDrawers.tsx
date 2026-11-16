"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Drawer } from "@/components/office/ui/Drawer";
import { Field, helpId } from "@/components/office/ui/Field";
import type { IconName } from "@/components/office/ui/Icon";
import { postOfficeForm } from "@/lib/http/office-client";
import { AIR_RATE_CITY, HOTEL_GRADES } from "@/lib/quote";

type DrawerFormProps = {
  kind: string;
  button: string;
  icon: IconName;
  title: string;
  description: string;
  submit: string;
  // The office top bar label while the save runs, such as "Adding hotel rate" (BR-98).
  busyLabel: string;
  // Shown beside the buttons after a save, such as "Hotel rate added: Khaplu, Air, Deluxe."
  onSaved: (message: string) => void;
  children: React.ReactNode;
};

// A button that opens a drawer with one form. The form posts to POST /api/office/rates with its kind,
// and the server checks every field and the role. A refused save keeps the drawer open with what was
// typed. A saved one closes it and reloads the rates.
function DrawerForm({ kind, button, icon, title, description, submit, busyLabel, onSaved, children }: DrawerFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const close = () => {
    if (pending) return;
    setOpen(false);
    setError("");
  };

  // A plain submit, not a form action: a form action resets the fields, which would hide what the
  // server refused.
  const send = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    start(async () => {
      const result = await postOfficeForm("/api/office/rates", form, busyLabel);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setError("");
      onSaved(result.message ?? "Saved.");
      router.refresh();
    });
  };

  return (
    <>
      <Button icon={icon} onClick={() => setOpen(true)}>
        {button}
      </Button>
      <Drawer open={open} title={title} description={description} onClose={close}>
        <form className="stack" onSubmit={send} aria-busy={pending}>
          <input type="hidden" name="kind" value={kind} />
          {error ? <Alert tone="danger" title="Not saved" role="alert">{error}</Alert> : null}
          {/* The fields are locked while the save runs, as on every office form (T-50). */}
          <fieldset className="form-lock" disabled={pending}>
            <div className="form-grid">{children}</div>
          </fieldset>
          <div className="row-tools">
            <Button variant="ghost" disabled={pending} onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={pending} busy={pending}>
              {submit}
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}

function MoneyField({ id, name, label, defaultValue = "", help }: { id: string; name: string; label: string; defaultValue?: string; help?: string }) {
  return (
    <Field id={id} label={label} help={help}>
      <span className="money">
        <span className="affix" aria-hidden="true">
          Rs
        </span>
        <input className="input" id={id} name={name} inputMode="numeric" autoComplete="off" defaultValue={defaultValue} aria-describedby={help ? helpId(id) : undefined} required />
      </span>
    </Field>
  );
}

function Check({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="check">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

// Air, then the start cities that start road trips. A rate row starts from one of these.
function CitySelect({ id, cities }: { id: string; cities: string[] }) {
  return (
    <Field id={id} label="Start city" help="Air is for air trips from every start city.">
      <select className="select" id={id} name="startCity" defaultValue={cities[0] ?? AIR_RATE_CITY} aria-describedby={helpId(id)}>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
        <option value={AIR_RATE_CITY}>Air</option>
      </select>
    </Field>
  );
}

// The buttons above a rate table, and the last saved message.
function Actions({ children, message }: { children: React.ReactNode; message: string }) {
  return (
    <div className="stack">
      <div className="row-tools">{children}</div>
      {message ? <Alert tone="success" title={message} role="status" /> : null}
    </div>
  );
}

type RateDrawerProps = {
  // Every place on a hotel rate, a vehicle rate, or a jeep line.
  places: string[];
  // The start cities that start road trips.
  roadCities: string[];
};

function RenamePlace({ places, onSaved }: { places: string[]; onSaved: (message: string) => void }) {
  return (
    <DrawerForm
      kind="place_rename"
      button="Rename a place"
      icon="edit"
      title="Rename a place"
      description="Renames the place on every hotel rate, vehicle rate, and jeep line in one save. A public Places page is not changed."
      submit="Rename place"
      busyLabel="Renaming place"
      onSaved={onSaved}
    >
      <Field id="rename-place" label="Place">
        <select className="select" id="rename-place" name="place" defaultValue={places[0] ?? ""}>
          {places.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>
      </Field>
      <Field
        id="rename-name"
        label="New name"
        help="Tour prices and the package builder on the website look places up by name, so they still use the old name until they are changed too."
      >
        <input className="input" id="rename-name" name="name" autoComplete="off" required aria-describedby={helpId("rename-name")} />
      </Field>
    </DrawerForm>
  );
}

// BR-90: the Hotels tab. A new place name adds the place with this, its first hotel rate.
export function HotelRateDrawers({ places, roadCities }: RateDrawerProps) {
  const [message, setMessage] = useState("");
  return (
    <Actions message={message}>
      <DrawerForm
        kind="hotel_rate_add"
        button="Add rate"
        icon="plus"
        title="Add a hotel rate"
        description="One place, start city, and grade. Type a new place name to add the place."
        submit="Add hotel rate"
        busyLabel="Adding hotel rate"
        onSaved={setMessage}
      >
        <Field id="add-hotel-place" label="Place" help="Choose a place or type a new one.">
          <input className="input" id="add-hotel-place" name="place" list="add-hotel-places" autoComplete="off" required aria-describedby={helpId("add-hotel-place")} />
          <datalist id="add-hotel-places">
            {places.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
        </Field>
        <CitySelect id="add-hotel-city" cities={roadCities} />
        <Field id="add-hotel-grade" label="Grade">
          <select className="select" id="add-hotel-grade" name="grade" defaultValue="Deluxe">
            {HOTEL_GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </Field>
        <MoneyField id="add-hotel-twin" name="twin" label="Twin, per room per night" />
        <MoneyField id="add-hotel-triple" name="triple" label="3-share, per room per night" />
        <Field id="add-hotel-name" label="Hotel" optional>
          <input className="input" id="add-hotel-name" name="hotelName" autoComplete="off" />
        </Field>
        <div className="field full">
          <Check name="offered" label="Offered on quotes" defaultChecked />
        </div>
      </DrawerForm>
      <RenamePlace places={places} onSaved={setMessage} />
    </Actions>
  );
}

// BR-90: the Vehicles tab. A vehicle rate is added to a place that already has rates.
export function VehicleRateDrawers({ places, roadCities, vehicles }: RateDrawerProps & { vehicles: string[] }) {
  const [message, setMessage] = useState("");
  return (
    <Actions message={message}>
      <DrawerForm
        kind="vehicle_rate_add"
        button="Add rate"
        icon="plus"
        title="Add a vehicle rate"
        description="One vehicle for a place and start city. Add a new place on the Hotels tab first, with its first hotel rate."
        submit="Add vehicle rate"
        busyLabel="Adding vehicle rate"
        onSaved={setMessage}
      >
        <Field id="add-vehicle-place" label="Place">
          <select className="select" id="add-vehicle-place" name="place" defaultValue={places[0] ?? ""}>
            {places.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </Field>
        <CitySelect id="add-vehicle-city" cities={roadCities} />
        <Field id="add-vehicle-name" label="Vehicle" help="Choose a vehicle or type a new one.">
          <input className="input" id="add-vehicle-name" name="vehicle" list="add-vehicle-names" autoComplete="off" required aria-describedby={helpId("add-vehicle-name")} />
          <datalist id="add-vehicle-names">
            {vehicles.map((vehicle) => (
              <option key={vehicle} value={vehicle} />
            ))}
          </datalist>
        </Field>
        <Field id="add-vehicle-seats" label="Seats">
          <input className="input" id="add-vehicle-seats" name="seats" inputMode="numeric" autoComplete="off" required />
        </Field>
        <MoneyField id="add-vehicle-rent" name="rent" label="Rent, per day" />
        <MoneyField id="add-vehicle-fuel" name="fuel" label="Fuel, per day" />
        <MoneyField id="add-vehicle-toll" name="toll" label="Toll, per trip" />
        <div className="field full">
          <Check name="live" label="On for quotes" defaultChecked />
        </div>
      </DrawerForm>
      <RenamePlace places={places} onSaved={setMessage} />
    </Actions>
  );
}

// BR-91: the Start cities tab. A start city is not deleted.
export function StartCityDrawer() {
  const [message, setMessage] = useState("");
  return (
    <Actions message={message}>
      <DrawerForm
        kind="start_city"
        button="Add start city"
        icon="plus"
        title="Add a start city"
        description="A road start city needs its own hotel and vehicle rates. Until it has them, no place is offered from it."
        submit="Add start city"
        busyLabel="Adding start city"
        onSaved={setMessage}
      >
        <Field id="add-city-name" label="City">
          <input className="input" id="add-city-name" name="name" autoComplete="off" required />
        </Field>
        <div className="field full quote-checks">
          <Check name="road" label="Starts road trips" defaultChecked />
          <Check name="air" label="Starts air trips" defaultChecked />
        </div>
        <MoneyField id="add-city-air" name="airExtra" label="Air extra, per adult" defaultValue="0" help="Added to the Islamabad ticket." />
        <Field id="add-city-after" label="Long-route extra after this many days" optional help="Road trips only. Leave it blank for no long-route extra.">
          <input className="input" id="add-city-after" name="longRouteAfterDays" inputMode="numeric" autoComplete="off" aria-describedby={helpId("add-city-after")} />
        </Field>
        <MoneyField id="add-city-long" name="longRoutePerVehicleDay" label="Long-route extra, per vehicle per day" defaultValue="0" />
      </DrawerForm>
    </Actions>
  );
}

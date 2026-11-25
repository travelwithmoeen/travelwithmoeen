"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SavedBy } from "@/components/office/activity";
import { RepeatItem, useKeyedList } from "@/components/office/content/Repeat";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Drawer } from "@/components/office/ui/Drawer";
import { Field, helpId } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";
import { DAY_PLAN_LIMITS, DAY_PLAN_PART_LABELS, DAY_PLAN_PARTS, type DayPlanPart, type DayPlanRow, type DayPlanSection } from "@/lib/package";

const PATH = "/api/office/day-plans";

const PART_HELP: Record<DayPlanPart, string> = {
  out_air: "The first days of a trip by air.",
  out_road: "The first days of a trip by road.",
  middle: "In order after the way out. A short trip leaves the last ones out, and a long trip adds free days after them.",
  back_air: "The last days of a trip by air.",
  back_road: "The last days of a trip by road.",
};

type Notice = { tone: "success" | "danger"; text: string } | null;

// The drawer edits a new day in a part (null id) or a stored day.
type Editing = { id: number | null; part: DayPlanPart; title: string; overnight: string; pricePlace: string; sections: DayPlanSection[] } | null;

type HotelNamesLine = { grade: string; names: string; savedBy?: SavedBy };

type DayPlansPanelProps = {
  places: string[];
  place: string;
  days: DayPlanRow[];
  hotelNames: HotelNamesLine[];
  daySavedBy: Record<number, string>;
  // T-59: the options that swap to a day, by day id.
  swapOptions: Record<number, string[]>;
};

// T-58 (BR-105, BR-111, BR-116). Every save goes to POST /api/office/day-plans, which checks the rates
// permission, the place, and every field again.
export function DayPlansPanel({ places, place, days, hotelNames, daySavedBy, swapOptions }: DayPlansPanelProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, start] = useTransition();

  const post = (form: FormData, label: string, onDone: () => void, onError: (text: string) => void) =>
    start(async () => {
      const result = await postOfficeForm(PATH, form, label);
      if (!result.ok) {
        onError(result.error);
        return;
      }
      onDone();
      setNotice({ tone: "success", text: result.message ?? "Saved." });
      router.refresh();
    });

  const showError = (text: string) => setNotice({ tone: "danger", text });

  const close = () => {
    if (pending) return;
    setEditing(null);
    setError("");
  };

  const openDay = (next: Editing) => {
    setNotice(null);
    setDeleting(null);
    setError("");
    setEditing(next);
  };

  const move = (day: DayPlanRow, direction: "up" | "down") => {
    const form = new FormData();
    form.set("action", "move");
    form.set("id", String(day.id));
    form.set("direction", direction);
    setNotice(null);
    post(form, "Moving day", () => undefined, showError);
  };

  const remove = (day: DayPlanRow) => {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", String(day.id));
    post(form, "Deleting day", () => setDeleting(null), showError);
  };

  // A plain submit, not a form action, so a refused save keeps what was typed.
  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    form.set("place", place);
    if (editing.id === null) {
      form.set("action", "add");
      form.set("part", editing.part);
    } else {
      form.set("action", "update");
      form.set("id", String(editing.id));
    }
    post(
      form,
      editing.id === null ? "Adding day" : "Saving day",
      () => {
        setEditing(null);
        setError("");
      },
      setError,
    );
  };

  const saveNames = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set("action", "hotel_names");
    form.set("place", place);
    setNotice(null);
    post(form, "Saving hotel names", () => undefined, showError);
  };

  return (
    <div className="stack day-plans">
      <div className="toolbar">
        <label className="label" htmlFor="day-plans-place">
          Place
        </label>
        <select
          className="select"
          id="day-plans-place"
          value={place}
          disabled={pending}
          onChange={(event) => router.push(`/office/rates/day-plans?${new URLSearchParams({ place: event.target.value })}`)}
        >
          {places.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <Alert tone="info" title="How a package uses these days">
        A package has the way out for its travel mode, then the middle days in order, then the way back. Extra days are free days at the last overnight place. {"{ORIGIN}"} in a title or paragraph becomes the trip&apos;s start city.
      </Alert>

      {notice ? <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} /> : null}

      {DAY_PLAN_PARTS.map((part) => {
        const partDays = days.filter((day) => day.part === part);
        const label = DAY_PLAN_PART_LABELS[part];
        return (
          <Card
            key={part}
            title={label}
            description={PART_HELP[part]}
            flush={partDays.length > 0}
            actions={
              <Button
                size="sm"
                icon="plus"
                disabled={pending || partDays.length >= DAY_PLAN_LIMITS.daysPerPart}
                onClick={() => openDay({ id: null, part, title: "", overnight: "", pricePlace: "", sections: [] })}
              >
                Add day<span className="sr-only"> to {label.toLowerCase()}</span>
              </Button>
            }
          >
            {partDays.length === 0 ? (
              <p className="muted">No days yet.</p>
            ) : (
              <Table label={`${place}, ${label.toLowerCase()}`}>
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Overnight</th>
                    <th scope="col">Paragraphs</th>
                    <th scope="col" className="r">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partDays.map((day, index) => {
                    const name = `day ${index + 1}, ${day.title}`;
                    return (
                      <tr key={day.id}>
                        {/* The title is the first cell, so on a phone it heads the row's card. */}
                        <td>
                          <b>
                            <span className="muted">{index + 1}.</span> {day.title}
                          </b>
                          {daySavedBy[day.id] ? <small className="cell-sub">{daySavedBy[day.id]}</small> : null}
                          {/* T-59: a day an option swaps to is left out of the normal middle days. */}
                          {swapOptions[day.id] ? <small className="cell-sub">Only in packages with {swapOptions[day.id].join(" or ")}</small> : null}
                        </td>
                        <td data-label="Overnight">
                          {/* One child, so on a phone the priced-as line stays under the place, not under the label. */}
                          <span>
                            {day.overnight}
                            <small className="cell-sub">Priced as {day.pricePlace ?? "the quote's place"}</small>
                          </span>
                        </td>
                        <td data-label="Paragraphs">{day.sections.length ? day.sections.map((section) => section.label).join(", ") : <span className="muted">None</span>}</td>
                        <td data-label="Actions" className="day-tools">
                          <div className="row-tools">
                            {deleting === day.id ? (
                              <div className="alert a-danger" role="alertdialog" aria-label={`Delete ${name}?`}>
                                <Icon name="alert" />
                                <div className="confirm-row">
                                  <b>Delete {day.title}? This cannot be undone.</b>
                                  <Button variant="danger" size="sm" busy={pending} disabled={pending} onClick={() => remove(day)}>
                                    Delete day
                                  </Button>
                                  <Button variant="ghost" size="sm" disabled={pending} onClick={() => setDeleting(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" iconOnly icon="arrowUp" disabled={pending || index === 0} onClick={() => move(day, "up")}>
                                  <span className="sr-only">Move {name} up</span>
                                </Button>
                                <Button size="sm" variant="ghost" iconOnly icon="arrowDown" disabled={pending || index === partDays.length - 1} onClick={() => move(day, "down")}>
                                  <span className="sr-only">Move {name} down</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  icon="edit"
                                  disabled={pending}
                                  onClick={() => openDay({ id: day.id, part, title: day.title, overnight: day.overnight, pricePlace: day.pricePlace ?? "", sections: day.sections })}
                                >
                                  Edit<span className="sr-only"> {name}</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  icon="trash"
                                  disabled={pending}
                                  onClick={() => {
                                    setNotice(null);
                                    setDeleting(day.id);
                                  }}
                                >
                                  Delete<span className="sr-only"> {name}</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>
        );
      })}

      <Card
        title="Hotel names"
        description="One line for each grade, shown on the package, such as Hotel Himalaya – Kesar Place Skardu. A package joins the lines of the places its nights are priced at. Leave a line blank to leave it out."
      >
        <div className="stack">
          {hotelNames.map((line) => {
            const id = `hotel-names-${line.grade.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <form className="hotel-names-row" key={line.grade} onSubmit={saveNames} aria-busy={pending || undefined}>
                <input type="hidden" name="grade" value={line.grade} />
                <Field id={id} label={line.grade} help={line.savedBy?.text}>
                  <input
                    className="input"
                    id={id}
                    name="names"
                    defaultValue={line.names}
                    maxLength={DAY_PLAN_LIMITS.hotelNames}
                    autoComplete="off"
                    disabled={pending}
                    aria-describedby={line.savedBy ? helpId(id) : undefined}
                  />
                </Field>
                <Button type="submit" size="md" disabled={pending}>
                  Save<span className="sr-only"> {line.grade} hotel names</span>
                </Button>
              </form>
            );
          })}
        </div>
      </Card>

      <Drawer
        open={editing !== null}
        title={editing ? (editing.id === null ? `Add a day to ${DAY_PLAN_PART_LABELS[editing.part].toLowerCase()}` : `Edit ${editing.title}`) : ""}
        description={place}
        onClose={close}
      >
        {editing ? <DayForm key={editing.id ?? `new-${editing.part}`} editing={editing} places={places} error={error} pending={pending} onSubmit={save} onCancel={close} /> : null}
      </Drawer>
    </div>
  );
}

type DayFormProps = {
  editing: NonNullable<Editing>;
  places: string[];
  error: string;
  pending: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

// Its own component, so each day opens with its own paragraphs.
function DayForm({ editing, places, error, pending, onSubmit, onCancel }: DayFormProps) {
  const sections = useKeyedList<DayPlanSection>(editing.sections);
  return (
    <form className="stack" onSubmit={onSubmit} aria-busy={pending || undefined}>
      {error ? (
        <Alert tone="danger" title="Not saved" role="alert">
          {error}
        </Alert>
      ) : null}
      <fieldset className="form-lock" disabled={pending}>
        <div className="stack">
          <Field id="day-title" label="Title" help={`Up to ${DAY_PLAN_LIMITS.title} characters, such as {ORIGIN} to Skardu.`}>
            <input className="input" id="day-title" name="title" defaultValue={editing.title} maxLength={DAY_PLAN_LIMITS.title} required autoComplete="off" aria-describedby={helpId("day-title")} />
          </Field>
          <Field id="day-overnight" label="Overnight place" help={`Shown on the package, up to ${DAY_PLAN_LIMITS.overnight} characters, such as Skardu or Khaplu.`}>
            <input className="input" id="day-overnight" name="overnight" defaultValue={editing.overnight} maxLength={DAY_PLAN_LIMITS.overnight} required autoComplete="off" aria-describedby={helpId("day-overnight")} />
          </Field>
          <Field id="day-price-place" label="Priced as" optional help="The rate place this night is priced at, and whose hotel names the package shows. Blank uses the quote's own place.">
            <select className="select" id="day-price-place" name="pricePlace" defaultValue={editing.pricePlace} aria-describedby={helpId("day-price-place")}>
              <option value="">The quote&apos;s place</option>
              {places.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
          <div className="repeat">
            {sections.items.map((section, index) => (
              <RepeatItem key={section.key} label="Paragraph" index={index} count={sections.items.length} onMove={(step) => sections.move(section.key, step)} onRemove={() => sections.remove(section.key)}>
                <Field id={`day-section-${section.key}-label`} label="Label" help={`Such as Morning, Afternoon, or Evening. Up to ${DAY_PLAN_LIMITS.label} characters.`}>
                  <input
                    className="input"
                    id={`day-section-${section.key}-label`}
                    name="sectionLabel"
                    value={section.value.label}
                    maxLength={DAY_PLAN_LIMITS.label}
                    autoComplete="off"
                    aria-describedby={helpId(`day-section-${section.key}-label`)}
                    onChange={(event) => sections.update(section.key, { label: event.target.value })}
                  />
                </Field>
                <Field id={`day-section-${section.key}-text`} label="Text">
                  <textarea
                    className="textarea"
                    id={`day-section-${section.key}-text`}
                    name="sectionText"
                    rows={4}
                    value={section.value.text}
                    maxLength={DAY_PLAN_LIMITS.text}
                    onChange={(event) => sections.update(section.key, { text: event.target.value })}
                  />
                </Field>
              </RepeatItem>
            ))}
          </div>
          <div>
            <Button variant="ghost" icon="plus" disabled={sections.items.length >= DAY_PLAN_LIMITS.sections} onClick={() => sections.add({ label: "", text: "" })}>
              Add paragraph
            </Button>
            <p className="help">Up to {DAY_PLAN_LIMITS.sections} paragraphs a day.</p>
          </div>
        </div>
      </fieldset>
      <div className="row-tools">
        <Button variant="ghost" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={pending} busy={pending}>
          {editing.id === null ? "Add day" : "Save day"}
        </Button>
      </div>
    </form>
  );
}

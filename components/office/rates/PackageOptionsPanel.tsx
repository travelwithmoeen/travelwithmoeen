"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Drawer } from "@/components/office/ui/Drawer";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Field, helpId } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";
import { DAY_PLAN_LIMITS, PACKAGE_OPTION_LIMITS, type PackageOption } from "@/lib/package";

const PATH = "/api/office/package-options";

type SwapDay = { id: number; place: string; title: string };
type Notice = { tone: "success" | "danger"; text: string } | null;

// The drawer edits a new option (null) or a stored one.
type Editing = { option: PackageOption | null } | null;

type PackageOptionsPanelProps = {
  options: PackageOption[];
  places: string[];
  middleDays: SwapDay[];
  savedBy: Record<number, string>;
};

// What an option does, in a few words, for the list.
function summary(option: PackageOption, middleDays: SwapDay[]) {
  const parts: string[] = [];
  if (option.dayOne) parts.push(`Day 1 paragraph: ${option.dayOne.label}`);
  if (option.swapTo !== null) {
    const target = middleDays.find((day) => day.id === option.swapTo);
    parts.push(`${target?.title ?? "A day"} instead of ${option.swapFrom}`);
  }
  if (option.restDays) parts.push("Rest days");
  if (option.badge) parts.push(`Badge: ${option.badge}`);
  if (option.intro) parts.push("Opening paragraph");
  if (option.notIncluded.length) parts.push(`${option.notIncluded.length} not included ${option.notIncluded.length === 1 ? "line" : "lines"}`);
  return parts.length ? parts.join(" · ") : "Nothing yet";
}

// T-59 (BR-107, BR-116). Every save goes to POST /api/office/package-options, which checks the rates
// permission and every field again.
export function PackageOptionsPanel({ options, places, middleDays, savedBy }: PackageOptionsPanelProps) {
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

  const open = (option: PackageOption | null) => {
    setNotice(null);
    setDeleting(null);
    setError("");
    setEditing({ option });
  };

  const close = () => {
    if (pending) return;
    setEditing(null);
    setError("");
  };

  const send = (values: Record<string, string>, label: string, onDone: () => void = () => undefined) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(values)) form.set(key, value);
    post(form, label, onDone, showError);
  };

  // A plain submit, not a form action, so a refused save keeps what was typed.
  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    if (editing.option) {
      form.set("action", "update");
      form.set("id", String(editing.option.id));
    } else {
      form.set("action", "add");
    }
    post(
      form,
      editing.option ? "Saving option" : "Adding option",
      () => {
        setEditing(null);
        setError("");
      },
      setError,
    );
  };

  return (
    <div className="stack">
      <div className="toolbar">
        <span className="spacer" />
        <Button variant="primary" icon="plus" disabled={pending || options.length >= PACKAGE_OPTION_LIMITS.options} onClick={() => open(null)}>
          Add option
        </Button>
      </div>

      <Alert tone="info" title="How a package uses its options">
        Each package ticks the options it wants. An option can add a paragraph to day 1, swap one middle day for another, add rest days, change the badge and the opening paragraph, and add Services not included lines. When two ticked options set the same badge or opening paragraph, the one higher in this list wins.
      </Alert>

      {notice ? <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} /> : null}

      {options.length === 0 ? (
        <EmptyState icon="sliders" title="No package options yet">
          Add one, such as Autumn season, Basho instead of Deosai, or Relaxed pace.
        </EmptyState>
      ) : (
        <Table label="Package options">
          <thead>
            <tr>
              <th scope="col">Option</th>
              <th scope="col">Offered at</th>
              <th scope="col">What it does</th>
              <th scope="col" className="r">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((option, index) => (
              <tr key={option.id}>
                <td>
                  <b>{option.name}</b>
                  {savedBy[option.id] ? <small className="cell-sub">{savedBy[option.id]}</small> : null}
                </td>
                <td data-label="Offered at">{option.places.length ? option.places.join(", ") : "Every place"}</td>
                <td data-label="What it does">{summary(option, middleDays)}</td>
                <td data-label="Actions" className="day-tools">
                  <div className="row-tools">
                    {deleting === option.id ? (
                      <div className="alert a-danger" role="alertdialog" aria-label={`Delete the option ${option.name}?`}>
                        <Icon name="alert" />
                        <div className="confirm-row">
                          <b>Delete {option.name}? This cannot be undone.</b>
                          <Button variant="danger" size="sm" busy={pending} disabled={pending} onClick={() => send({ action: "delete", id: String(option.id) }, "Deleting option", () => setDeleting(null))}>
                            Delete option
                          </Button>
                          <Button variant="ghost" size="sm" disabled={pending} onClick={() => setDeleting(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" iconOnly icon="arrowUp" disabled={pending || index === 0} onClick={() => send({ action: "move", id: String(option.id), direction: "up" }, "Moving option")}>
                          <span className="sr-only">Move {option.name} up</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          iconOnly
                          icon="arrowDown"
                          disabled={pending || index === options.length - 1}
                          onClick={() => send({ action: "move", id: String(option.id), direction: "down" }, "Moving option")}
                        >
                          <span className="sr-only">Move {option.name} down</span>
                        </Button>
                        <Button size="sm" variant="ghost" icon="edit" disabled={pending} onClick={() => open(option)}>
                          Edit<span className="sr-only"> {option.name}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="trash"
                          disabled={pending}
                          onClick={() => {
                            setNotice(null);
                            setDeleting(option.id);
                          }}
                        >
                          Delete<span className="sr-only"> {option.name}</span>
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Drawer open={editing !== null} title={editing?.option ? `Edit ${editing.option.name}` : "Add a package option"} description="Leave a part blank when the option does not change it." onClose={close}>
        {editing ? <OptionForm key={editing.option?.id ?? "new"} option={editing.option} places={places} middleDays={middleDays} error={error} pending={pending} onSubmit={save} onCancel={close} /> : null}
      </Drawer>
    </div>
  );
}

type OptionFormProps = {
  option: PackageOption | null;
  places: string[];
  middleDays: SwapDay[];
  error: string;
  pending: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function OptionForm({ option, places, middleDays, error, pending, onSubmit, onCancel }: OptionFormProps) {
  const limits = PACKAGE_OPTION_LIMITS;
  // The day it replaces is a middle day of the swap day's place, so the list follows the swap day.
  const [swapTo, setSwapTo] = useState(option?.swapTo ? String(option.swapTo) : "");
  const [swapFrom, setSwapFrom] = useState(option?.swapFrom ?? "");
  const target = middleDays.find((day) => String(day.id) === swapTo);
  const replaceable = target ? [...new Set(middleDays.filter((day) => day.place === target.place && day.id !== target.id).map((day) => day.title))] : [];
  return (
    <form className="stack" onSubmit={onSubmit} aria-busy={pending || undefined}>
      {error ? (
        <Alert tone="danger" title="Not saved" role="alert">
          {error}
        </Alert>
      ) : null}
      <fieldset className="form-lock" disabled={pending}>
        <div className="stack">
          <Field id="option-name" label="Name" help={`Up to ${limits.name} characters, such as Autumn season. Two options cannot share a name.`}>
            <input className="input" id="option-name" name="name" defaultValue={option?.name ?? ""} maxLength={limits.name} required autoComplete="off" aria-describedby={helpId("option-name")} />
          </Field>

          <fieldset className="stack">
            <legend className="label">Offered at</legend>
            <p className="help">Tick none to offer it at every place.</p>
            <div className="place-picks">
              {places.map((place) => (
                <label className="check" key={place}>
                  <input type="checkbox" name="places" value={place} defaultChecked={option?.places.includes(place) ?? false} />
                  <span>{place}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="stack">
            <legend className="label">Paragraph added to day 1</legend>
            <Field id="option-day-one-label" label="Label" optional help={`Such as Autumn. Up to ${DAY_PLAN_LIMITS.label} characters.`}>
              <input className="input" id="option-day-one-label" name="dayOneLabel" defaultValue={option?.dayOne?.label ?? ""} maxLength={DAY_PLAN_LIMITS.label} autoComplete="off" aria-describedby={helpId("option-day-one-label")} />
            </Field>
            <Field id="option-day-one-text" label="Text" optional>
              <textarea className="textarea" id="option-day-one-text" name="dayOneText" rows={3} defaultValue={option?.dayOne?.text ?? ""} maxLength={DAY_PLAN_LIMITS.text} />
            </Field>
          </fieldset>

          <fieldset className="stack">
            <legend className="label">Swap a middle day</legend>
            <Field id="option-swap-to" label="Day to swap in" optional help="A middle day on the Day plans screen. It only appears in packages with this option.">
              <select
                className="select"
                id="option-swap-to"
                name="swapTo"
                value={swapTo}
                aria-describedby={helpId("option-swap-to")}
                onChange={(event) => {
                  setSwapTo(event.target.value);
                  setSwapFrom("");
                }}
              >
                <option value="">No swap</option>
                {/* PR 71 review: each day names its place, since titles repeat across places. */}
                {middleDays.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.place}: {day.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="option-swap-from" label="Day it replaces" optional help={target ? `A middle day of ${target.place}.` : "Choose the day to swap in first."}>
              <select className="select" id="option-swap-from" name="swapFrom" value={swapFrom} disabled={!target} aria-describedby={helpId("option-swap-from")} onChange={(event) => setSwapFrom(event.target.value)}>
                <option value="">Choose a day</option>
                {replaceable.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>

          <label className="check">
            <input type="checkbox" name="restDays" defaultChecked={option?.restDays ?? false} />
            <span>
              Rest days
              <small>One for every three middle days, at least one, always leaving one sightseeing day.</small>
            </span>
          </label>

          <Field id="option-badge" label="Header badge" optional help={`Up to ${limits.badge} characters.`}>
            <input className="input" id="option-badge" name="badge" defaultValue={option?.badge ?? ""} maxLength={limits.badge} autoComplete="off" aria-describedby={helpId("option-badge")} />
          </Field>
          <Field id="option-intro" label="Opening paragraph" optional help={`Replaces the package's opening paragraph. Up to ${limits.intro.toLocaleString("en-US")} characters.`}>
            <textarea className="textarea" id="option-intro" name="intro" rows={3} defaultValue={option?.intro ?? ""} maxLength={limits.intro} aria-describedby={helpId("option-intro")} />
          </Field>
          <Field id="option-not-included" label="Services not included, one per line" optional help={`Up to ${limits.notIncludedLines} lines of ${limits.notIncludedLine} characters.`}>
            <textarea className="textarea" id="option-not-included" name="notIncluded" rows={3} defaultValue={option?.notIncluded.join("\n") ?? ""} aria-describedby={helpId("option-not-included")} />
          </Field>
        </div>
      </fieldset>
      <div className="row-tools">
        <Button variant="ghost" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={pending} busy={pending}>
          {option ? "Save option" : "Add option"}
        </Button>
      </div>
    </form>
  );
}

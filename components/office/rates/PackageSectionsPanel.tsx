"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RepeatItem, useKeyedList } from "@/components/office/content/Repeat";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Drawer } from "@/components/office/ui/Drawer";
import { EmptyState } from "@/components/office/ui/EmptyState";
import { Field, helpId } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";
import { PACKAGE_SECTION_KIND_LABELS, PACKAGE_SECTION_KINDS, PACKAGE_SECTION_LIMITS, type PackageSection, type PackageSectionKind, type SectionRow } from "@/lib/package";

const PATH = "/api/office/package-sections";

type Notice = { tone: "success" | "danger"; text: string } | null;

// The drawer edits a new section (null) or a stored one.
type Editing = { section: PackageSection | null } | null;

function count(total: number, one: string, many: string) {
  return `${total} ${total === 1 ? one : many}`;
}

// What a section holds, in a few words, for the list.
function summary(section: PackageSection) {
  const label = PACKAGE_SECTION_KIND_LABELS[section.kind];
  if (section.kind === "text") return `${label} · ${count(section.body.length, "paragraph", "paragraphs")}`;
  if (section.kind === "rows") return `${label} · ${count(section.body.length, "row", "rows")}`;
  return `${label} · ${count(section.body.length, "item", "items")}`;
}

// T-60 (BR-108, BR-116). Every save goes to POST /api/office/package-sections, which checks the rates
// permission and every field again.
export function PackageSectionsPanel({ sections, savedBy }: { sections: PackageSection[]; savedBy: Record<number, string> }) {
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

  const open = (section: PackageSection | null) => {
    setNotice(null);
    setDeleting(null);
    setError("");
    setEditing({ section });
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
    if (editing.section) {
      form.set("action", "update");
      form.set("id", String(editing.section.id));
    } else {
      form.set("action", "add");
    }
    post(
      form,
      editing.section ? "Saving section" : "Adding section",
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
        <Button variant="primary" icon="plus" disabled={pending || sections.length >= PACKAGE_SECTION_LIMITS.sections} onClick={() => open(null)}>
          Add section
        </Button>
      </div>

      <Alert tone="info" title="The end of every package">
        These sections follow the flight ticket note on every package, in this order, such as check-in and check-out, payment procedure, cancellation policy, code of conduct, and contact.
      </Alert>

      {notice ? <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} /> : null}

      {sections.length === 0 ? (
        <EmptyState icon="file" title="No fixed sections yet">
          Add one, such as Check-in and check-out or Cancellation policy.
        </EmptyState>
      ) : (
        <Table label="Fixed sections">
          <thead>
            <tr>
              <th scope="col">Section</th>
              <th scope="col">Holds</th>
              <th scope="col" className="r">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, index) => (
              <tr key={section.id}>
                <td>
                  <b>
                    <span className="muted">{index + 1}.</span> {section.title}
                  </b>
                  {savedBy[section.id] ? <small className="cell-sub">{savedBy[section.id]}</small> : null}
                </td>
                <td data-label="Holds">{summary(section)}</td>
                <td data-label="Actions" className="day-tools">
                  <div className="row-tools">
                    {deleting === section.id ? (
                      <div className="alert a-danger" role="alertdialog" aria-label={`Delete the section ${section.title}?`}>
                        <Icon name="alert" />
                        <div className="confirm-row">
                          <b>Delete {section.title}? This cannot be undone.</b>
                          <Button variant="danger" size="sm" busy={pending} disabled={pending} onClick={() => send({ action: "delete", id: String(section.id) }, "Deleting section", () => setDeleting(null))}>
                            Delete section
                          </Button>
                          <Button variant="ghost" size="sm" disabled={pending} onClick={() => setDeleting(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" iconOnly icon="arrowUp" disabled={pending || index === 0} onClick={() => send({ action: "move", id: String(section.id), direction: "up" }, "Moving section")}>
                          <span className="sr-only">Move {section.title} up</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          iconOnly
                          icon="arrowDown"
                          disabled={pending || index === sections.length - 1}
                          onClick={() => send({ action: "move", id: String(section.id), direction: "down" }, "Moving section")}
                        >
                          <span className="sr-only">Move {section.title} down</span>
                        </Button>
                        <Button size="sm" variant="ghost" icon="edit" disabled={pending} onClick={() => open(section)}>
                          Edit<span className="sr-only"> {section.title}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="trash"
                          disabled={pending}
                          onClick={() => {
                            setNotice(null);
                            setDeleting(section.id);
                          }}
                        >
                          Delete<span className="sr-only"> {section.title}</span>
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

      <Drawer open={editing !== null} title={editing?.section ? `Edit ${editing.section.title}` : "Add a fixed section"} description="Shown at the end of every package." onClose={close}>
        {editing ? <SectionForm key={editing.section?.id ?? "new"} section={editing.section} error={error} pending={pending} onSubmit={save} onCancel={close} /> : null}
      </Drawer>
    </div>
  );
}

type SectionFormProps = {
  section: PackageSection | null;
  error: string;
  pending: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

// Its own component, so each section opens with its own rows and items. Changing the kind keeps what
// was typed for the other kinds until the drawer closes, and only the chosen kind is sent.
function SectionForm({ section, error, pending, onSubmit, onCancel }: SectionFormProps) {
  const limits = PACKAGE_SECTION_LIMITS;
  const [kind, setKind] = useState<PackageSectionKind>(section?.kind ?? "text");
  const [text, setText] = useState(section?.kind === "text" ? (section.body as string[]).join("\n\n") : "");
  const rows = useKeyedList<SectionRow>(section?.kind === "rows" ? (section.body as SectionRow[]) : [{ label: "", value: "" }]);
  const steps = useKeyedList<{ text: string }>(section?.kind === "steps" ? (section.body as string[]).map((step) => ({ text: step })) : [{ text: "" }]);
  return (
    <form className="stack" onSubmit={onSubmit} aria-busy={pending || undefined}>
      {error ? (
        <Alert tone="danger" title="Not saved" role="alert">
          {error}
        </Alert>
      ) : null}
      <fieldset className="form-lock" disabled={pending}>
        <div className="stack">
          <Field id="section-title" label="Title" help={`Up to ${limits.title} characters, such as Cancellation policy.`}>
            <input className="input" id="section-title" name="title" defaultValue={section?.title ?? ""} maxLength={limits.title} required autoComplete="off" aria-describedby={helpId("section-title")} />
          </Field>
          <Field id="section-kind" label="Holds">
            <select className="select" id="section-kind" name="kind" value={kind} onChange={(event) => setKind(event.target.value as PackageSectionKind)}>
              {PACKAGE_SECTION_KINDS.map((value) => (
                <option key={value} value={value}>
                  {PACKAGE_SECTION_KIND_LABELS[value]}
                </option>
              ))}
            </select>
          </Field>

          {kind === "text" ? (
            <Field id="section-text" label="Text" help={`A blank line starts a new paragraph. Up to ${limits.text.toLocaleString("en-US")} characters.`}>
              <textarea className="textarea" id="section-text" name="text" rows={8} value={text} maxLength={limits.text} aria-describedby={helpId("section-text")} onChange={(event) => setText(event.target.value)} />
            </Field>
          ) : null}

          {kind === "rows" ? (
            <>
              <div className="repeat">
                {rows.items.map((row, index) => (
                  <RepeatItem key={row.key} label="Row" index={index} count={rows.items.length} onMove={(step) => rows.move(row.key, step)} onRemove={() => rows.remove(row.key)}>
                    <Field id={`section-row-${row.key}-label`} label="Label" help={`Such as Check-in. Up to ${limits.rowLabel} characters.`}>
                      <input
                        className="input"
                        id={`section-row-${row.key}-label`}
                        name="rowLabel"
                        value={row.value.label}
                        maxLength={limits.rowLabel}
                        autoComplete="off"
                        aria-describedby={helpId(`section-row-${row.key}-label`)}
                        onChange={(event) => rows.update(row.key, { label: event.target.value })}
                      />
                    </Field>
                    <Field id={`section-row-${row.key}-value`} label="Value" help={`Such as 2:00 pm. Up to ${limits.rowValue} characters.`}>
                      <input
                        className="input"
                        id={`section-row-${row.key}-value`}
                        name="rowValue"
                        value={row.value.value}
                        maxLength={limits.rowValue}
                        autoComplete="off"
                        aria-describedby={helpId(`section-row-${row.key}-value`)}
                        onChange={(event) => rows.update(row.key, { value: event.target.value })}
                      />
                    </Field>
                  </RepeatItem>
                ))}
              </div>
              <div>
                <Button variant="ghost" icon="plus" disabled={rows.items.length >= limits.rows} onClick={() => rows.add({ label: "", value: "" })}>
                  Add row
                </Button>
                <p className="help">Up to {limits.rows} rows.</p>
              </div>
            </>
          ) : null}

          {kind === "steps" ? (
            <>
              <div className="repeat">
                {steps.items.map((step, index) => (
                  <RepeatItem key={step.key} label="Item" index={index} count={steps.items.length} onMove={(move) => steps.move(step.key, move)} onRemove={() => steps.remove(step.key)}>
                    <Field id={`section-step-${step.key}`} label="Text" help={`Up to ${limits.step} characters.`}>
                      <input
                        className="input"
                        id={`section-step-${step.key}`}
                        name="step"
                        value={step.value.text}
                        maxLength={limits.step}
                        autoComplete="off"
                        aria-describedby={helpId(`section-step-${step.key}`)}
                        onChange={(event) => steps.update(step.key, { text: event.target.value })}
                      />
                    </Field>
                  </RepeatItem>
                ))}
              </div>
              <div>
                <Button variant="ghost" icon="plus" disabled={steps.items.length >= limits.steps} onClick={() => steps.add({ text: "" })}>
                  Add item
                </Button>
                <p className="help">Up to {limits.steps} items, numbered 1, 2, 3 on the package.</p>
              </div>
            </>
          ) : null}
        </div>
      </fieldset>
      <div className="row-tools">
        <Button variant="ghost" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={pending} busy={pending}>
          {section ? "Save section" : "Add section"}
        </Button>
      </div>
    </form>
  );
}

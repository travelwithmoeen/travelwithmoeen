"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SavedBy } from "@/components/office/activity";
import { photoStyle } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { SaveBar } from "@/components/office/content/SaveBar";
import { UploadProgress } from "@/components/office/content/UploadProgress";
import { postOfficeFormWithUploads, useUploadProgress } from "@/components/office/content/uploads";
import { Alert } from "@/components/office/ui/Alert";
import { buttonClass } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { apiPath } from "@/lib/http/api-path";
import type { ActionResult } from "@/lib/http/result";
import type { SavedQuoteDesk } from "@/lib/http/site-content";
import { QUOTE_PACKAGE_LIMITS } from "@/lib/package";

const SLOTS = [...Array(QUOTE_PACKAGE_LIMITS.pictures).keys()].map((index) => index + 1);

// T-61 (BR-109, BR-113, BR-114, design section 15): the Package tab of a saved quote. The choices save
// through POST /api/office/quotes/[id]/package, which checks the rates permission and every field
// again. The preview and the downloads are built from the saved choices and today's data.
export function PackageTab({ desk, savedBy }: { desk: SavedQuoteDesk; savedBy?: SavedBy }) {
  const { quote, settings, packageError } = desk;
  const documentPath = apiPath(`/api/office/quotes/${quote.id}/package`);
  const [result, setResult] = useState<ActionResult | null>(null);
  // The preview reloads after each save.
  const [version, setVersion] = useState(0);

  return (
    <div className="stack">
      {packageError ? (
        <Alert tone="warning" title="No package for this quote" role="status">
          {packageError} The quote itself is priced as before.
        </Alert>
      ) : null}

      {/* After a save the page brings back the saved choices, and the form starts again from them,
          so an uploaded picture is then one of the package's own pictures. */}
      <PackageForm
        key={JSON.stringify(settings)}
        desk={desk}
        savedBy={savedBy}
        result={result}
        onSaved={(saved) => {
          setResult(saved);
          if (saved.ok) setVersion((value) => value + 1);
        }}
      />

      {packageError ? null : (
        <Card
          title="Preview"
          description="The document as the guest gets it. Download PDF opens it with the print dialog, where you choose Save as PDF."
          actions={
            <div className="row-tools">
              <a className={buttonClass()} href={`${documentPath}?print=1`} target="_blank" rel="noopener">
                <Icon name="file" />
                Download PDF
              </a>
              <a className={buttonClass()} href={`${documentPath}?format=word`} download>
                <Icon name="file" />
                Download Word
              </a>
            </div>
          }
        >
          <iframe className="package-preview" key={version} src={`${documentPath}?v=${version}`} title={`Package preview for quote ${quote.id}`} />
        </Card>
      )}
    </div>
  );
}

type PackageFormProps = {
  desk: SavedQuoteDesk;
  savedBy?: SavedBy;
  result: ActionResult | null;
  onSaved: (result: ActionResult) => void;
};

function PackageForm({ desk, savedBy, result, onSaved }: PackageFormProps) {
  const router = useRouter();
  const { quote, settings, options, gallery, canUpload } = desk;
  const uploads = useUploadProgress();
  const [pending, start] = useTransition();
  // Each address once: two gallery photos can share a file. A picture this package has that is not
  // in the gallery is one uploaded for it.
  const choices: { src: string; alt: string }[] = [];
  for (const photo of gallery) {
    if (!choices.some((choice) => choice.src === photo.src)) choices.push(photo);
  }
  for (const picture of settings.pictures) {
    if (!choices.some((photo) => photo.src === picture)) choices.push({ src: picture, alt: "Picture uploaded for this package" });
  }
  const [picked, setPicked] = useState<string[]>(SLOTS.map((slot) => settings.pictures[slot - 1] ?? ""));
  const [chosen, setChosen] = useState<string[]>(SLOTS.map(() => ""));
  const setAt = (list: string[], index: number, value: string) => list.map((item, at) => (at === index ? value : item));

  // A plain submit, not a form action, so a refused save keeps what was chosen.
  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    start(async () => {
      const saved = await postOfficeFormWithUploads(`/api/office/quotes/${quote.id}/package`, form, uploads.begin("Saving package"));
      onSaved(saved);
      if (saved.ok) router.refresh();
    });
  };

  return (
    <form className="stack" onSubmit={save} aria-busy={pending || undefined}>
      <fieldset className="form-lock" disabled={pending}>
        <div className="stack">
          <Card title="Package" description="Prices use today's rates and day plans, rounded up to the next 10,000." savedBy={savedBy}>
            <div className="stack">
              <Field id="package-title" label="Title" help={`Up to ${QUOTE_PACKAGE_LIMITS.title} characters.`}>
                <input
                  className="input"
                  id="package-title"
                  name="title"
                  defaultValue={settings.title}
                  maxLength={QUOTE_PACKAGE_LIMITS.title}
                  required
                  autoComplete="off"
                  aria-describedby={helpId("package-title")}
                />
              </Field>
              <label className="check">
                <input name="allGrades" type="checkbox" defaultChecked={settings.allGrades} />
                <span>
                  All categories
                  <small>Prices Deluxe, Executive, Luxury, and Ultra Luxury. Off shows only {quote.grade}.</small>
                </span>
              </label>
              <label className="check">
                <input name="flightNote" type="checkbox" defaultChecked={settings.flightNote} />
                <span>
                  Flight ticket note
                  <small>{quote.mode === "air" ? "The adult and child fares from the pricing rules." : "Shown on air trips only."}</small>
                </span>
              </label>
            </div>
          </Card>

          <Card title="Options" description={options.length > 0 ? `The options offered for ${quote.place}.` : `No options are offered for ${quote.place}.`}>
            {options.length > 0 ? (
              <div className="stack">
                {options.map((option) => (
                  <label className="check" key={option.id}>
                    <input name="optionId" type="checkbox" value={option.id} defaultChecked={settings.optionIds.includes(option.id)} />
                    <span>{option.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="muted">Add one on the Package options tab.</p>
            )}
          </Card>

          <Card
            title="Pictures"
            description={
              canUpload ? "Up to 3, from the gallery or uploaded. The first is the widest." : "Up to 3, from the gallery. The first is the widest. Only the Owner can upload a new picture."
            }
          >
            <div className="stack">
              {SLOTS.map((slot, index) => (
                <div className="stack" key={slot}>
                  <Field id={`package-picture-${slot}`} label={`Picture ${slot}`} optional={slot > 1}>
                    <div className="package-picture">
                      <span className="package-thumb" style={photoStyle(chosen[index] || picked[index])} aria-hidden="true">
                        {chosen[index] || picked[index] ? null : <Icon name="image" />}
                      </span>
                      <select
                        className="select"
                        id={`package-picture-${slot}`}
                        name={`picture${slot}`}
                        value={picked[index]}
                        onChange={(event) => setPicked((list) => setAt(list, index, event.target.value))}
                      >
                        <option value="">No picture</option>
                        {choices.map((photo) => (
                          <option key={photo.src} value={photo.src}>
                            {photo.alt || photo.src}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                  {canUpload ? (
                    <FileField
                      label={`Or upload picture ${slot}`}
                      fileName={`picture${slot}File`}
                      onFile={(url) => setChosen((list) => setAt(list, index, url))}
                      help="JPEG, PNG, or WebP. 5 MB or less. An upload takes the place of the gallery choice."
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </fieldset>
      <UploadProgress progress={uploads.progress} onCancel={uploads.cancel} />
      <SaveBar label="Save package" pending={pending} result={result} hint="The preview and the downloads use the saved choices." />
    </form>
  );
}

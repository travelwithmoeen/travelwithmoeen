"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { chooseDensity, chooseTheme, type OfficeDensity, type OfficeTheme } from "@/components/office/appearance";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { PageHead } from "@/components/office/ui/PageHead";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

const THEME_CHOICES: [OfficeTheme, string][] = [
  ["system", "System"],
  ["light", "Light"],
  ["dark", "Dark"],
  ["hc", "High contrast"],
];
const DENSITY_CHOICES: [OfficeDensity, string][] = [
  ["comfortable", "Comfortable"],
  ["compact", "Compact"],
];

type SettingsScreenProps = {
  name: string | null;
  email: string;
  roleName: string;
  theme: OfficeTheme;
  density: OfficeDensity;
};

// One group of segmented buttons. A press applies at once, with no Save button (BR-121).
function Choices<T extends string>({ label, choices, value, onChoose }: { label: string; choices: [T, string][]; value: T; onChoose: (next: T) => void }) {
  return (
    <div className="seg-mini" role="group" aria-label={label}>
      {choices.map(([choice, text]) => (
        <button className="seg-btn" type="button" key={choice} aria-pressed={value === choice} onClick={() => onChoose(choice)}>
          {text}
        </button>
      ))}
    </div>
  );
}

// T-62 (BR-117 to BR-121): the person's own name, and how the office looks in this browser.
export function SettingsScreen({ name, email, roleName, theme: startTheme, density: startDensity }: SettingsScreenProps) {
  const router = useRouter();
  const [theme, setTheme] = useState(startTheme);
  const [density, setDensity] = useState(startDensity);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [saving, start] = useTransition();

  // A plain submit, not a form action, so a refused name stays in the field.
  const saveName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    start(async () => {
      const saved = await postOfficeForm("/api/office/settings/profile", form, "Saving your name");
      setResult(saved);
      // The account menu, the Users list, and "Saved by" read the name from the server.
      if (saved.ok) router.refresh();
    });
  };

  return (
    <>
      <PageHead title="Settings" description="Your own name, and how the office looks to you in this browser." />
      <div className="stack">
        <Card title="Profile" description="Your name shows in place of your email in the account menu, the Users list, and Saved by.">
          <form className="stack" onSubmit={saveName} aria-busy={saving || undefined}>
            <fieldset className="form-lock" disabled={saving}>
              <Field id="settings-name" label="Name" optional help="Up to 60 characters. Leave it empty to show your email.">
                <input className="input" id="settings-name" name="name" defaultValue={name ?? ""} autoComplete="name" aria-describedby={helpId("settings-name")} />
              </Field>
            </fieldset>
            {result ? <Alert tone={result.ok ? "success" : "danger"} title={result.ok ? result.message ?? "Saved." : result.error} role={result.ok ? "status" : "alert"} /> : null}
            <div className="row-tools">
              <Button variant="primary" type="submit" disabled={saving} busy={saving}>
                Save name
              </Button>
            </div>
          </form>
          <dl className="settings-facts">
            <dt>Email</dt>
            <dd>{email}</dd>
            <dt>Role</dt>
            <dd>{roleName}</dd>
          </dl>
          <p className="help">The Owner changes logins and roles under Users.</p>
        </Card>

        <Card title="Appearance" description="System follows the light or dark setting of this device. The choice applies at once and is kept in this browser.">
          <Choices
            label="Appearance"
            choices={THEME_CHOICES}
            value={theme}
            onChoose={(next) => {
              chooseTheme(next);
              setTheme(next);
            }}
          />
        </Card>

        <Card title="Density" description="Compact makes buttons, fields, and the gaps between them smaller, so more rows fit on the screen.">
          <Choices
            label="Density"
            choices={DENSITY_CHOICES}
            value={density}
            onChoose={(next) => {
              chooseDensity(next);
              setDensity(next);
            }}
          />
        </Card>
      </div>
    </>
  );
}

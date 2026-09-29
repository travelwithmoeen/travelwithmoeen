"use client";

import { useActionState } from "react";
import { updateSiteSettingsAction } from "@/lib/office/actions";
import type { SiteSettings } from "@/lib/content";
import type { ActionResult } from "@/lib/office/users";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export function SiteForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(updateSiteSettingsAction, null as ActionResult | null);

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <label className="block text-sm font-medium">
        Phone
        <input className={inputClass} name="phoneDisplay" defaultValue={settings.phoneDisplay} required />
      </label>
      <label className="block text-sm font-medium">
        WhatsApp number
        <input className={inputClass} name="phoneE164" defaultValue={settings.phoneE164} required />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input className={inputClass} name="email" type="email" defaultValue={settings.email} required />
      </label>
      <label className="block text-sm font-medium">
        Address
        <textarea className={inputClass} name="address" rows={2} defaultValue={settings.address} required />
      </label>
      <label className="block text-sm font-medium">
        Map link
        <input className={inputClass} name="mapsUrl" defaultValue={settings.mapsUrl} />
      </label>
      <label className="block text-sm font-medium">
        Facebook
        <input className={inputClass} name="facebookUrl" defaultValue={settings.facebookUrl} />
      </label>
      <label className="block text-sm font-medium">
        Instagram
        <input className={inputClass} name="instagramUrl" defaultValue={settings.instagramUrl} />
      </label>
      <label className="block text-sm font-medium">
        TikTok
        <input className={inputClass} name="tiktokUrl" defaultValue={settings.tiktokUrl} />
      </label>
      <label className="block text-sm font-medium">
        YouTube
        <input className={inputClass} name="youtubeUrl" defaultValue={settings.youtubeUrl} />
      </label>
      {state ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.ok ? state.message : state.error}</p> : null}
      <button className="rounded-md bg-slate-900 px-4 py-2 text-white" type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save site details"}
      </button>
    </form>
  );
}

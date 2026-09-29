"use client";

import { useActionState } from "react";
import { deletePhotoAction, savePhotoAction } from "@/lib/office/actions";
import type { ActionResult } from "@/lib/office/users";
import type { GalleryImage } from "@/data/gallery";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

function PhotoFields({ photo }: { photo?: GalleryImage }) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => savePhotoAction(formData),
    null,
  );
  const [removed, remove, removing] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => deletePhotoAction(formData),
    null,
  );

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <form action={action} className="grid gap-3 md:grid-cols-2">
        {photo ? <input type="hidden" name="id" value={photo.id} /> : null}
        <label className="block text-sm font-medium md:col-span-2">
          Photo path
          <input className={inputClass} name="src" defaultValue={photo?.src ?? ""} />
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Replace photo
          <input className={inputClass} name="photo" type="file" accept="image/*" />
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Description
          <input className={inputClass} name="alt" defaultValue={photo?.alt ?? ""} required />
        </label>
        <label className="block text-sm font-medium">
          Group
          <select className={inputClass} name="category" defaultValue={photo?.category ?? "private"}>
            <option value="private">Private</option>
            <option value="group">Group</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Shape
          <select className={inputClass} name="span" defaultValue={photo?.span ?? ""}>
            <option value="">Normal</option>
            <option value="tall">Tall</option>
            <option value="wide">Wide</option>
            <option value="large">Large</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input name="homeOnly" type="checkbox" defaultChecked={photo?.homeOnly} />
          Home page only
        </label>
        {state ? (
          <p className={`text-sm md:col-span-2 ${state.ok ? "text-green-700" : "text-red-700"}`}>
            {state.ok ? state.message : state.error}
          </p>
        ) : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" type="submit" disabled={pending}>
          {photo ? "Save photo" : "Add photo"}
        </button>
      </form>
      {photo ? (
        <form action={remove} className="mt-3">
          <input type="hidden" name="id" value={photo.id} />
          {removed && !removed.ok ? <p className="text-sm text-red-700">{removed.error}</p> : null}
          <button className="text-sm text-red-700" type="submit" disabled={removing}>
            Remove photo
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function GalleryEditor({ photos }: { photos: GalleryImage[] }) {
  return (
    <div className="space-y-4">
      {photos.map((photo) => (
        <PhotoFields key={photo.id} photo={photo} />
      ))}
      <h2 className="pt-4 text-lg font-semibold">Add a photo</h2>
      <PhotoFields />
    </div>
  );
}

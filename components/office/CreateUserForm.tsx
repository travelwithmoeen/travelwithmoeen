"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

export function CreateUserForm() {
  const [state, action, pending] = useActionState(
    officeFormAction("/api/office/users", "/office/users"),
    null as ActionResult | null,
  );

  return (
    <form action={action} className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Create a login</h2>
      <label className="mt-4 block text-sm font-medium" htmlFor="email">
        Email
      </label>
      <input className="mt-1 w-full rounded-md border px-3 py-2" id="email" name="email" type="email" required />
      <label className="mt-4 block text-sm font-medium" htmlFor="password">
        Password
      </label>
      <input className="mt-1 w-full rounded-md border px-3 py-2" id="password" name="password" type="password" required />
      <label className="mt-4 block text-sm font-medium" htmlFor="role">
        Role
      </label>
      <select className="mt-1 w-full rounded-md border px-3 py-2" id="role" name="role" defaultValue="editor">
        <option value="editor">Editor</option>
        <option value="manager">Manager</option>
        <option value="owner">Owner</option>
      </select>
      {state ? (
        <p className={`mt-4 text-sm ${state.ok ? "text-green-700" : "text-red-700"}`}>
          {state.ok ? state.message : state.error}
        </p>
      ) : null}
      <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white" type="submit" disabled={pending}>
        Create login
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

export function LoginForm() {
  const [state, action, pending] = useActionState(officeFormAction("/api/office/login", "/office"), null as ActionResult | null);

  return (
    <form action={action} className="mx-auto mt-24 max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-slate-900">Office sign in</h1>
      <p className="mt-2 text-sm text-slate-600">Use the email and password for your login.</p>
      <label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="email">
        Email
      </label>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
      />
      <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="password">
        Password
      </label>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {state && !state.ok ? <p className="mt-4 text-sm text-red-700">{state.error}</p> : null}
      <button
        className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

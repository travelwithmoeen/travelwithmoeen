"use client";

import { apiPath } from "@/lib/http/api-path";

export function SignOutButton() {
  return (
    <button
      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
      type="button"
      onClick={async () => {
        await fetch(apiPath("/api/office/logout"), { method: "POST", credentials: "include" });
        window.location.assign("/office/login");
      }}
    >
      Sign out
    </button>
  );
}

"use client";

import { useActionState } from "react";
import { changeRoleAction, removeUserAction } from "@/lib/office/actions";
import type { ActionResult } from "@/lib/office/users";
import type { Role } from "@/lib/auth/permissions";

export function UserControls({
  userId,
  role,
  isSelf,
}: {
  userId: number;
  role: Role;
  isSelf: boolean;
}) {
  const [roleState, changeRole, rolePending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => changeRoleAction(formData),
    null,
  );
  const [removeState, removeUser, removePending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => removeUserAction(formData),
    null,
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={changeRole} className="flex items-center gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select className="rounded-md border px-2 py-1 text-sm" name="role" defaultValue={role}>
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
        </select>
        <button className="rounded-md border px-3 py-1 text-sm" type="submit" disabled={rolePending}>
          Save role
        </button>
      </form>
      {isSelf ? null : (
        <form action={removeUser}>
          <input type="hidden" name="userId" value={userId} />
          <button className="text-sm text-red-700" type="submit" disabled={removePending}>
            Remove
          </button>
        </form>
      )}
      {roleState ? <p className={roleState.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{roleState.ok ? roleState.message : roleState.error}</p> : null}
      {removeState && !removeState.ok ? <p className="text-sm text-red-700">{removeState.error}</p> : null}
    </div>
  );
}

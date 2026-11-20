"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { initialsOf } from "@/components/office/people";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { PageHead } from "@/components/office/ui/PageHead";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";
import Link from "next/link";
import type { OfficeRoleChoice, OfficeUserRow } from "@/lib/http/office-session";

type Notice = { tone: "success" | "danger"; text: string } | null;

// Pending role changes, by login id, as the chosen role id.
function withoutUser(roles: Record<number, number>, userId: number) {
  const rest = { ...roles };
  delete rest[userId];
  return rest;
}


export function UsersPanel({ users, roles: roleList, selfId }: { users: OfficeUserRow[]; roles: OfficeRoleChoice[]; selfId: number }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Record<number, number>>({});
  const [removing, setRemoving] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, start] = useTransition();
  // A new login starts on the least access: the Editor role if it is there, else the first role that is not Owner.
  const defaultRoleId =
    roleList.find((role) => role.name.toLowerCase() === "editor")?.id ?? roleList.find((role) => !role.isOwner)?.id ?? roleList[0]?.id ?? 0;

  // Calls an existing users route. The server checks the role and the last-Owner rule.
  const send = (path: string, form: FormData, label: string, after: () => void) =>
    start(async () => {
      const result = await postOfficeForm(path, form, label);
      if (!result.ok) {
        setNotice({ tone: "danger", text: result.error });
        return;
      }
      setNotice({ tone: "success", text: result.message ?? "Saved." });
      after();
      router.refresh();
    });

  const create = (form: FormData) =>
    send("/api/office/users", form, "Adding user", () => {
      setCreating(false);
      setShowPassword(false);
    });

  const saveRole = (user: OfficeUserRow) => {
    const form = new FormData();
    form.set("userId", String(user.id));
    form.set("role", String(roles[user.id]));
    send("/api/office/users/role", form, "Saving role", () => setRoles((current) => withoutUser(current, user.id)));
  };

  const remove = (user: OfficeUserRow) => {
    const form = new FormData();
    form.set("userId", String(user.id));
    send("/api/office/users/remove", form, "Removing user", () => setRemoving(null));
  };

  return (
    <>
      <PageHead
        title="Users"
        description="Office logins and their roles. Only the Owner sees this page."
        actions={
          creating ? null : (
            <Button variant="primary" icon="plus" onClick={() => setCreating(true)}>
              Create login
            </Button>
          )
        }
      />

      {notice ? <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} /> : null}

      {creating ? (
        <Card title="Create a login" description="They sign in at /office/login with this email and password.">
          <form action={create} className="stack">
            <div className="form-grid">
              <Field id="new-email" label="Email">
                <input className="input" id="new-email" name="email" type="email" autoComplete="off" required />
              </Field>
              <Field id="new-role" label="Role">
                <select className="select" id="new-role" name="role" defaultValue={String(defaultRoleId)}>
                  {roleList.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="field full">
                <label className="label" htmlFor="new-password">
                  Password
                </label>
                <div className="pw">
                  <input
                    className="input"
                    id="new-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-describedby={helpId("new-password")}
                  />
                  <Button variant="ghost" size="sm" icon="eye" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </Button>
                </div>
                <p className="help" id={helpId("new-password")}>
                  At least 8 characters. Give it to them in person or by phone.
                </p>
              </div>
            </div>
            <div className="row-tools">
              <Button variant="ghost" disabled={pending} onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon="plus" disabled={pending} busy={pending}>
                Create login
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Table label="Office logins">
        <thead>
          <tr>
            <th scope="col">Login</th>
            <th scope="col">Role</th>
            <th scope="col" className="r">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const self = user.id === selfId;
            const chosen = roles[user.id] ?? user.roleId;
            const changed = chosen !== user.roleId;
            const chosenName = roleList.find((role) => role.id === chosen)?.name ?? user.roleName;
            return (
              <tr key={user.id}>
                <td>
                  <span className="user-cell">
                    <span className="avatar" aria-hidden="true">
                      {initialsOf(user.email, user.name)}
                    </span>
                    {/* T-62 (BR-119): the name above the email. With no name, the email as before. */}
                    <span>
                      <b>{user.name || user.email}</b>
                      {user.name ? <small className="cell-sub">{user.email}</small> : null}
                      {self ? <small className="cell-sub">You</small> : null}
                    </span>
                  </span>
                </td>
                <td data-label="Role">
                  <label className="sr-only" htmlFor={`role-${user.id}`}>
                    Role for {user.email}
                  </label>
                  <select
                    className="select select-sm"
                    id={`role-${user.id}`}
                    value={chosen}
                    disabled={pending}
                    onChange={(event) => setRoles((current) => ({ ...current, [user.id]: Number(event.target.value) }))}
                  >
                    {roleList.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td data-label="Actions">
                  <div className="row-tools">
                    {changed ? (
                      <>
                        <Button size="sm" variant="primary" disabled={pending} busy={pending} onClick={() => saveRole(user)}>
                          Make {chosenName}
                        </Button>
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setRoles((current) => withoutUser(current, user.id))}>
                          Cancel
                        </Button>
                      </>
                    ) : removing === user.id ? (
                      <>
                        <span className="help">Remove this login?</span>
                        <Button size="sm" variant="danger" disabled={pending} busy={pending} onClick={() => remove(user)}>
                          Remove login
                        </Button>
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setRemoving(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : self ? (
                      <span className="muted">You</span>
                    ) : (
                      <Button size="sm" variant="ghost" icon="trash" onClick={() => setRemoving(user.id)}>
                        Remove<span className="sr-only"> {user.email}</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Card title="What each role can do" description="Only the Owner can create a login or change a role. The last Owner cannot be removed or changed to another role.">
        <p className="help">
          Each role and its permissions are on the <Link href="/office/roles">Roles</Link> page. A change there applies on the next page each person opens.
        </p>
      </Card>
    </>
  );
}

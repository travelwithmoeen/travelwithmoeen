"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Badge } from "@/components/office/ui/Badge";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Drawer } from "@/components/office/ui/Drawer";
import { Field, helpId } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";
import type { OfficePermission, OfficeRoleRow } from "@/lib/http/office-session";

type Notice = { tone: "success" | "danger"; text: string } | null;

// The drawer edits a new role (null id) or an existing one.
type Editing = { id: number | null; name: string; permissions: string[] } | null;

function logins(count: number) {
  return `${count} ${count === 1 ? "login" : "logins"}`;
}

type RolesPanelProps = { roles: OfficeRoleRow[]; permissions: OfficePermission[]; ownerOnly: string[] };

// T-63 (BR-123 to BR-127, design section 17). Every save goes to POST /api/office/roles, which checks
// the Owner, the name, and each permission key again.
export function RolesPanel({ roles, permissions, ownerOnly }: RolesPanelProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, start] = useTransition();

  const close = () => {
    if (pending) return;
    setEditing(null);
    setError("");
  };

  const post = (form: FormData, label: string, onDone: () => void, onError: (text: string) => void) =>
    start(async () => {
      const result = await postOfficeForm("/api/office/roles", form, label);
      if (!result.ok) {
        onError(result.error);
        return;
      }
      onDone();
      setNotice({ tone: "success", text: result.message ?? "Saved." });
      router.refresh();
    });

  // A plain submit, not a form action, so a refused save keeps what was typed and ticked.
  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    form.set("action", editing.id === null ? "add" : "update");
    if (editing.id !== null) form.set("roleId", String(editing.id));
    post(
      form,
      editing.id === null ? "Adding role" : "Saving role",
      () => {
        setEditing(null);
        setError("");
      },
      setError,
    );
  };

  const remove = (role: OfficeRoleRow) => {
    const form = new FormData();
    form.set("action", "delete");
    form.set("roleId", String(role.id));
    post(
      form,
      "Deleting role",
      () => setDeleting(null),
      (text) => setNotice({ tone: "danger", text }),
    );
  };

  const toggle = (key: string, on: boolean) =>
    setEditing((current) =>
      current ? { ...current, permissions: on ? [...current.permissions, key] : current.permissions.filter((item) => item !== key) } : current,
    );

  return (
    <>
      <PageHead
        title="Roles"
        description="What each role may do in the office. A change applies on each person's next page or save, with no sign-out."
        actions={
          <Button
            variant="primary"
            icon="plus"
            onClick={() => {
              setNotice(null);
              setEditing({ id: null, name: "", permissions: [] });
            }}
          >
            Add role
          </Button>
        }
      />

      {notice ? <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} /> : null}

      <Table label="Roles and their permissions">
        <thead>
          <tr>
            <th scope="col">Role</th>
            {permissions.map((permission) => (
              <th scope="col" key={permission.key} title={permission.name}>
                {permission.short}
              </th>
            ))}
            <th scope="col">Logins</th>
            <th scope="col" className="r">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>
                <b>{role.name}</b>
                {role.isOwner ? (
                  <small className="cell-sub">
                    <Badge tone="accent">Every permission</Badge>
                  </small>
                ) : null}
              </td>
              {permissions.map((permission) => {
                const yes = role.permissions.includes(permission.key);
                return (
                  <td key={permission.key} data-label={permission.short}>
                    {yes ? <Icon name="check" className="yes" /> : <span className="muted" aria-hidden="true">—</span>}
                    <span className="sr-only">{yes ? "Yes" : "No"}</span>
                  </td>
                );
              })}
              <td data-label="Logins" className="nowrap">
                {logins(role.logins)}
              </td>
              <td data-label="Actions">
                <div className="row-tools">
                  {role.isOwner ? (
                    <span className="muted">Cannot be changed</span>
                  ) : deleting === role.id ? (
                    <div className="alert a-danger" role="alertdialog" aria-label={`Delete the role ${role.name}?`}>
                      <Icon name="alert" />
                      <div className="confirm-row">
                        {role.logins > 0 ? (
                          <b>
                            {logins(role.logins)} {role.logins === 1 ? "has" : "have"} this role. Move these logins to another role first.
                          </b>
                        ) : (
                          <>
                            <b>Delete {role.name}? This cannot be undone.</b>
                            <Button variant="danger" size="sm" busy={pending} disabled={pending} onClick={() => remove(role)}>
                              Delete role
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" disabled={pending} onClick={() => setDeleting(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="edit"
                        onClick={() => {
                          setNotice(null);
                          setEditing({ id: role.id, name: role.name, permissions: role.permissions });
                        }}
                      >
                        Edit<span className="sr-only"> {role.name}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="trash"
                        onClick={() => {
                          setNotice(null);
                          setDeleting(role.id);
                        }}
                      >
                        Delete<span className="sr-only"> {role.name}</span>
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card title="Only the Owner" description="These stay with the Owner role and cannot be given to another role.">
        <ul className="owner-only">
          {ownerOnly.map((item) => (
            <li key={item}>
              <Icon name="lock" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Drawer
        open={editing !== null}
        title={editing?.id === null ? "Add a role" : `Edit ${roles.find((role) => role.id === editing?.id)?.name ?? "role"}`}
        description="Tick what this role may do. The Users page gives a role to a login."
        onClose={close}
      >
        {editing ? (
          <form className="stack" onSubmit={save} aria-busy={pending}>
            {error ? (
              <Alert tone="danger" title="Not saved" role="alert">
                {error}
              </Alert>
            ) : null}
            <fieldset className="form-lock" disabled={pending}>
              <div className="stack">
                <Field id="role-name" label="Name" help="2 to 40 characters. Two roles cannot share a name.">
                  <input
                    className="input"
                    id="role-name"
                    name="name"
                    value={editing.name}
                    onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                    minLength={2}
                    maxLength={40}
                    required
                    autoComplete="off"
                    aria-describedby={helpId("role-name")}
                  />
                </Field>
                <fieldset className="stack">
                  <legend className="label">Permissions</legend>
                  {permissions.map((permission) => (
                    <label className="check" key={permission.key}>
                      <input
                        type="checkbox"
                        name="permission"
                        value={permission.key}
                        checked={editing.permissions.includes(permission.key)}
                        onChange={(event) => toggle(permission.key, event.target.checked)}
                      />
                      <span>
                        {permission.name}
                        <small>{permission.help}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
              </div>
            </fieldset>
            <div className="row-tools">
              <Button variant="ghost" disabled={pending} onClick={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={pending} busy={pending}>
                {editing.id === null ? "Add role" : "Save role"}
              </Button>
            </div>
          </form>
        ) : null}
      </Drawer>
    </>
  );
}

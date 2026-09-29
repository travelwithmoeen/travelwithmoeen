import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/auth/permissions";
import { CreateUserForm } from "@/components/office/CreateUserForm";
import { UserControls } from "@/components/office/UserControls";

export default async function UsersPage() {
  const actor = await getCurrentUser();
  if (!actor || !canManageUsers(actor.role)) redirect("/office");
  const rows = await db.select().from(users).orderBy(asc(users.email));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Users</h1>
      <CreateUserForm />
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl bg-white p-4 shadow">
            <p className="font-medium">{row.email}</p>
            <p className="mb-3 text-sm text-slate-500">{row.role}</p>
            <UserControls userId={row.id} role={row.role} isSelf={row.id === actor.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

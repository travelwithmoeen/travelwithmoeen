import { redirect } from "next/navigation";
import { CreateUserForm } from "@/components/office/CreateUserForm";
import { UserControls } from "@/components/office/UserControls";
import { getOfficeSession, getOfficeUsers } from "@/lib/http/office-session";

export default async function UsersPage() {
  const actor = await getOfficeSession();
  if (!actor?.canManageUsers) redirect("/office");
  const rows = await getOfficeUsers();

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

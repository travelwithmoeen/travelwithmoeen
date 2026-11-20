import { redirect } from "next/navigation";
import { RolesPanel } from "@/components/office/roles/RolesPanel";
import { getOfficeRoles, getOfficeSession } from "@/lib/http/office-session";

// T-63 (BR-123): Owner only. The route refuses everyone else as well.
export default async function RolesPage() {
  const actor = await getOfficeSession();
  if (!actor?.canManageRoles) redirect("/office");
  const { roles, permissions, ownerOnly } = await getOfficeRoles();
  return <RolesPanel roles={roles} permissions={permissions} ownerOnly={ownerOnly} />;
}

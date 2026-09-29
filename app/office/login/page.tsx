import { redirect } from "next/navigation";
import { LoginForm } from "@/components/office/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";

export default async function OfficeLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/office");
  return (
    <div className="min-h-screen bg-slate-100">
      <LoginForm />
    </div>
  );
}

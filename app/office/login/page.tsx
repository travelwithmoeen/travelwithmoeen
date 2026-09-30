import { redirect } from "next/navigation";
import { LoginForm } from "@/components/office/LoginForm";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeLoginPage() {
  const user = await getOfficeSession();
  if (user) redirect("/office");
  return (
    <div className="min-h-screen bg-slate-100">
      <LoginForm />
    </div>
  );
}

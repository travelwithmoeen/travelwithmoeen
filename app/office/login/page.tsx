import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/office/LoginForm";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeLoginPage() {
  const user = await getOfficeSession();
  if (user) redirect("/office");
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <main id="main" className="login" tabIndex={-1}>
        <div className="login-box">
          <div className="login-brand">
            {/* preload, because priority is deprecated in Next 16. */}
            <Image className="logo" src="/images/logo/logo.png" alt="" width={64} height={64} preload />
            <b>Travel With Moeen Office</b>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}

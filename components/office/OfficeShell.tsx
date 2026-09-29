import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/office/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent, canManageUsers } from "@/lib/auth/permissions";

const linkClass = "rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100";

export async function OfficeShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/office/login");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Office</p>
            <p className="font-semibold">{user.email}</p>
            <p className="text-sm text-slate-600">{user.role}</p>
          </div>
          <form action={logoutAction}>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="submit">
              Sign out
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-1 px-4 pb-3">
          <Link className={linkClass} href="/office">
            Home
          </Link>
          {canManageUsers(user.role) ? (
            <Link className={linkClass} href="/office/users">
              Users
            </Link>
          ) : null}
          {canEditContent(user.role) ? (
            <>
              <Link className={linkClass} href="/office/tours">
                Tours
              </Link>
              <Link className={linkClass} href="/office/places">
                Places
              </Link>
              <Link className={linkClass} href="/office/blog">
                Blog
              </Link>
              <Link className={linkClass} href="/office/gallery">
                Gallery
              </Link>
              <Link className={linkClass} href="/office/reviews">
                Reviews
              </Link>
              <Link className={linkClass} href="/office/slides">
                Home slides
              </Link>
              <Link className={linkClass} href="/office/site">
                Site details
              </Link>
            </>
          ) : null}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DENSITY_COOKIE, THEME_COOKIE, readDensity, readTheme } from "@/components/office/appearance";
import { SettingsScreen } from "@/components/office/settings/SettingsScreen";
import { getOfficeSession } from "@/lib/http/office-session";

// T-62 (BR-117): every signed-in Owner, Manager, and Editor, for their own login only.
export default async function SettingsPage() {
  const user = await getOfficeSession();
  if (!user) redirect("/office/login");
  const cookieStore = await cookies();
  return (
    <SettingsScreen
      name={user.name}
      email={user.email}
      role={user.role}
      theme={readTheme(cookieStore.get(THEME_COOKIE)?.value)}
      density={readDensity(cookieStore.get(DENSITY_COOKIE)?.value)}
    />
  );
}

import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { DENSITY_COOKIE, THEME_COOKIE, readDensity, readTheme, rootAttributes } from "@/components/office/appearance";
import "@/components/office/meadow.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// The Meadow root. Every office token and class is scoped under .office, so the public site
// keeps its own look. T-62 (BR-121): the person's Appearance and Density are read from their cookies
// here, on the server, so an office page, the sign-in page included, opens in that look with no flash.
export default async function OfficeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = readTheme(cookieStore.get(THEME_COOKIE)?.value);
  const density = readDensity(cookieStore.get(DENSITY_COOKIE)?.value);
  return (
    <div className={`office ${inter.variable} ${jetBrainsMono.variable}`} {...rootAttributes(theme, density)}>
      {children}
    </div>
  );
}

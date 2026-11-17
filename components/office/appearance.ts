// T-62 (BR-120, BR-121): a person's Appearance and Density choice for the office. It is kept in two
// cookies in that browser, for one year, under /office, so the sign-in page uses it too. The
// office layout reads both on the server, so the first paint is already in the chosen look.

export const THEME_COOKIE = "twm_office_theme";
export const DENSITY_COOKIE = "twm_office_density";

export const THEMES = ["system", "light", "dark", "hc"] as const;
export const DENSITIES = ["comfortable", "compact"] as const;
export type OfficeTheme = (typeof THEMES)[number];
export type OfficeDensity = (typeof DENSITIES)[number];

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// A stored value, or the default for a missing or unknown one: light and comfortable, today's look.
export function readTheme(value: string | undefined): OfficeTheme {
  return (THEMES as readonly string[]).includes(value ?? "") ? (value as OfficeTheme) : "light";
}

export function readDensity(value: string | undefined): OfficeDensity {
  return (DENSITIES as readonly string[]).includes(value ?? "") ? (value as OfficeDensity) : "comfortable";
}

// The attributes for the office root. System leaves data-theme off, so the device setting decides.
export function rootAttributes(theme: OfficeTheme, density: OfficeDensity) {
  return {
    "data-office-root": "",
    ...(theme === "system" ? {} : { "data-theme": theme }),
    "data-density": density,
  };
}

// Called in the browser on a press on the Settings page: the cookie is set the way the sidebar
// cookie is, and the change shows at once. The root is found by data-office-root, not by .office,
// because the page-move bar's root also has the .office class (T-50).
export function chooseTheme(theme: OfficeTheme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/office; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
  const root = document.querySelector<HTMLElement>("[data-office-root]");
  if (!root) return;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function chooseDensity(density: OfficeDensity) {
  document.cookie = `${DENSITY_COOKIE}=${density}; path=/office; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
  document.querySelector<HTMLElement>("[data-office-root]")?.setAttribute("data-density", density);
}

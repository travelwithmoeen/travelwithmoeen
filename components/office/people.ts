// T-62 (BR-119): how the office shows a person. With a name, the name and its initials. With no
// name, or for a removed login, the email as before.

export function shownName(email: string, name: string | null | undefined) {
  return name?.trim() || email;
}

// From the name, the first letters of its first two words. With no name, from the email.
export function initialsOf(email: string, name: string | null | undefined = null) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return `${[...words[0]][0]}${[...words[1]][0]}`.toUpperCase();
  if (words.length === 1) return [...words[0]].slice(0, 2).join("").toUpperCase();
  return email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "?";
}

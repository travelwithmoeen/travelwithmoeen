import { eq } from "drizzle-orm";
import { authenticate } from "../lib/auth/authenticate";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { savePriceAs, updateTourAs } from "../lib/office/content-writes";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { getTour } from "../lib/content";

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password) {
    throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  }

  const wrong = await authenticate(email, "not-the-password");
  if (wrong) throw new Error("A wrong password was accepted.");

  const owner = await authenticate(email, password);
  if (!owner || owner.role !== "owner") throw new Error("The Owner password was refused.");

  const editorEmail = "editor-step1-check@travelwithmoeen.test";
  const managerEmail = "manager-step1-check@travelwithmoeen.test";
  const editorPassword = `check-${Date.now()}-editor`;
  const managerPassword = `check-${Date.now()}-manager`;
  await db.delete(users).where(eq(users.email, editorEmail));
  await db.delete(users).where(eq(users.email, managerEmail));

  let editorId = 0;
  let managerId = 0;
  try {
    const editorCreated = await createUserAs(owner, {
      email: editorEmail,
      password: editorPassword,
      role: "editor",
    });
    const managerCreated = await createUserAs(owner, {
      email: managerEmail,
      password: managerPassword,
      role: "manager",
    });
    if (!editorCreated.ok || !managerCreated.ok) {
      throw new Error("The Owner could not create an Editor and a Manager.");
    }

    const editor = await authenticate(editorEmail, editorPassword);
    const manager = await authenticate(managerEmail, managerPassword);
    if (!editor || !manager) throw new Error("The new logins could not sign in.");
    editorId = editor.id;
    managerId = manager.id;

    const priceAttempt = await savePriceAs(editor);
    if (priceAttempt.ok || priceAttempt.error !== "You cannot change a price.") {
      throw new Error(`Editor price save was not refused: ${JSON.stringify(priceAttempt)}`);
    }

    const titleAttempt = await updateTourAs(manager, {
      id: "missing",
      name: "Changed by manager",
      location: "",
      region: "",
      description: "",
      duration: 1,
      image: "/images/twm-logo.webp",
      pdf: "",
      galleryImages: [],
      categories: [],
      packageTypes: [],
      transport: "By Road",
      included: [],
      notIncluded: [],
      featured: false,
      itinerary: [],
    });
    if (titleAttempt.ok || titleAttempt.error !== "You cannot edit a tour.") {
      throw new Error(`Manager tour save was not refused: ${JSON.stringify(titleAttempt)}`);
    }

    const sample = await getTour("1_day_by_road_trip_to_islamabad");
    if (!sample) throw new Error("Sample tour was not loaded.");
    const edited = await updateTourAs(editor, {
      id: sample.id,
      name: `${sample.name} Check`,
      location: sample.location,
      region: sample.region,
      description: sample.description,
      duration: sample.duration,
      image: "/images/twm-logo.webp",
      pdf: sample.pdf,
      galleryImages: sample.galleryImages,
      categories: sample.categories,
      packageTypes: sample.packageTypes,
      transport: sample.transport,
      included: sample.included,
      notIncluded: sample.notIncluded,
      featured: sample.featured ?? false,
      itinerary: sample.itinerary,
    });
    if (!edited.ok) throw new Error(edited.error);
    const seen = await getTour(sample.id);
    if (seen?.name !== `${sample.name} Check` || seen.image !== "/images/twm-logo.webp") {
      throw new Error("The Editor change was not stored.");
    }
    const restored = await updateTourAs(editor, {
      id: sample.id,
      name: sample.name,
      location: sample.location,
      region: sample.region,
      description: sample.description,
      duration: sample.duration,
      image: sample.image,
      pdf: sample.pdf,
      galleryImages: sample.galleryImages,
      categories: sample.categories,
      packageTypes: sample.packageTypes,
      transport: sample.transport,
      included: sample.included,
      notIncluded: sample.notIncluded,
      featured: sample.featured ?? false,
      itinerary: sample.itinerary,
    });
    if (!restored.ok) throw new Error(restored.error);
  } finally {
    if (editorId) await removeUserAs(owner, editorId);
    if (managerId) await removeUserAs(owner, managerId);
  }

  console.log("Step 1 server checks passed.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

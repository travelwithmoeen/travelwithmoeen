import { linkInferredTourPlaces } from "../lib/office/tour-places";

async function main() {
  const result = await linkInferredTourPlaces();
  console.log(`Inserted ${result.inserted} tour-place links. Existing links and tour text were left as they were.`);
  if (result.notes.length > 0) {
    console.log("Linked with a note:");
    for (const row of result.notes) console.log(`- ${row.name}: ${row.note}`);
  }
  if (result.unlinked.length > 0) {
    console.log("Not linked:");
    for (const row of result.unlinked) console.log(`- ${row.name} (${row.region}): ${row.note}`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

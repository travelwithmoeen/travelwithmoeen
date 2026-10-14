import { readFileSync } from "node:fs";
import path from "node:path";

const prototypeHtml = readFileSync(
  path.join(process.cwd(), "docs", "office-design", "meadow.html"),
  "utf8",
);

export function GET() {
  return new Response(prototypeHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}

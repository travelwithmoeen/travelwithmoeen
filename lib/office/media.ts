import { randomBytes } from "crypto";
import { del, put } from "@vercel/blob";
import { canEditContent } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function mediaToken() {
  const token = process.env.MEDIA_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Storage is not connected.");
  }
  return token;
}

export function officeMediaPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  let pathname = "";
  if (trimmed.startsWith("/")) {
    pathname = trimmed.slice(1);
  } else {
    try {
      pathname = decodeURIComponent(new URL(trimmed).pathname).replace(/^\/+/, "");
    } catch {
      return null;
    }
  }
  if (pathname.startsWith("backups/") || pathname.startsWith("images/") || pathname.startsWith("pdfs/")) {
    return null;
  }
  if (!pathname.startsWith("media/")) return null;
  const fileName = pathname.slice("media/".length);
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) return null;
  return `media/${fileName}`;
}

export function droppedOfficeFiles(before: string[], after: string[]) {
  const kept = new Set(after.map((value) => value.trim()).filter(Boolean));
  return before.filter((value) => {
    const trimmed = value.trim();
    return trimmed !== "" && !kept.has(trimmed);
  });
}

export async function deleteOfficeFiles(urls: string[]) {
  const paths = [...new Set(urls.map((url) => officeMediaPath(url)).filter((path) => path !== null))];
  if (paths.length === 0) return;
  try {
    await del(paths, { token: mediaToken() });
  } catch (error) {
    if (error instanceof Error && error.message === "Storage is not connected.") throw error;
    throw new Error("The file could not be removed.");
  }
}

function imageKind(bytes: Buffer): "jpg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  return null;
}

function isPdf(bytes: Buffer) {
  return bytes.length >= 5 && bytes.toString("ascii", 0, 5) === "%PDF-";
}

function fileName(kind: string) {
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${kind}`;
}

async function storePublicFile(bytes: Buffer, kind: string, contentType: string) {
  try {
    const blob = await put(`media/${fileName(kind)}`, bytes, {
      access: "public",
      token: mediaToken(),
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (error) {
    if (error instanceof Error && error.message === "Storage is not connected.") throw error;
    throw new Error("The file could not be saved.");
  }
}

export async function saveUploadedImage(actor: SessionUser, file: File): Promise<string | ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a photo.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("The file is larger than 5 MB.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("The file is larger than 5 MB.");
  }
  const kind = imageKind(bytes);
  if (!kind) {
    throw new Error("Use a JPEG, PNG, or WebP file.");
  }
  const contentType = kind === "png" ? "image/png" : kind === "webp" ? "image/webp" : "image/jpeg";
  return storePublicFile(bytes, kind, contentType);
}

export async function saveUploadedPdf(actor: SessionUser, file: File): Promise<string | ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a tour.");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("The file is larger than 10 MB.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_PDF_BYTES) {
    throw new Error("The file is larger than 10 MB.");
  }
  if (!isPdf(bytes)) {
    throw new Error("Use a PDF file.");
  }
  return storePublicFile(bytes, "pdf", "application/pdf");
}

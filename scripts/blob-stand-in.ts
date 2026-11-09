// T-56 (design section 14a): a local stand-in for the Vercel Blob service, so local runs and
// check-step3 never use a Vercel store. Start it with `npm run blob:local`. It answers the requests
// @vercel/blob 2.8.1 makes for what the site uses: put, head, del, list, and the browser upload() with
// a client token, and it serves each stored file at http://localhost:3100/<pathname>.
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";

const PORT = 3100;
const ORIGIN = `http://localhost:${PORT}`;
const ROOT = path.resolve(".local-blob");
const FILES = path.join(ROOT, "files");
const META = path.join(ROOT, "meta");
const STORE_ID = "localtest";
// Nothing the site sends is near this. It only stops a runaway body from filling the disk.
const MAX_BODY_BYTES = 64 * 1024 * 1024;
const SUFFIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  json: "application/json",
  txt: "text/plain",
};

type Meta = {
  pathname: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  etag: string;
  access: "public" | "private";
  cacheControl: string;
};

type TokenPayload = {
  pathname?: string;
  allowedContentTypes?: string[];
  maximumSizeInBytes?: number;
  validUntil?: number;
  addRandomSuffix?: boolean;
  allowOverwrite?: boolean;
  cacheControlMaxAge?: number;
};

class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function readWriteToken() {
  const token = process.env.MEDIA_READ_WRITE_TOKEN ?? "";
  if (token.split("_")[3] !== STORE_ID) {
    console.error(`The stand-in needs MEDIA_READ_WRITE_TOKEN with the store id "${STORE_ID}". See .env.example and design section 14a.`);
    process.exit(1);
  }
  return token;
}

const TOKEN = readWriteToken();

// The site and @vercel/blob only send names like media/upload-<suffix>.jpg, but a name must never
// reach outside .local-blob/.
function safePathname(value: string | null) {
  const pathname = (value ?? "").replace(/^\/+/, "");
  if (!pathname || pathname.includes("//") || pathname.includes("\\") || pathname.split("/").some((part) => part === "." || part === "..")) {
    throw new ApiError(400, "bad_request", "Invalid pathname");
  }
  return pathname;
}

function filePath(pathname: string) {
  return path.join(FILES, ...pathname.split("/"));
}

function metaPath(pathname: string) {
  return path.join(META, ...pathname.split("/")) + ".json";
}

function blobUrl(pathname: string) {
  return `${ORIGIN}/${pathname.split("/").map(encodeURIComponent).join("/")}`;
}

function downloadUrl(pathname: string) {
  return `${blobUrl(pathname)}?download=1`;
}

function fileName(pathname: string) {
  return pathname.split("/").pop() ?? pathname;
}

async function readMeta(pathname: string): Promise<Meta | null> {
  try {
    return JSON.parse(await fs.readFile(metaPath(pathname), "utf8")) as Meta;
  } catch {
    return null;
  }
}

// A URL from this stand-in, or a bare pathname. A URL from anywhere else is not in this store.
function pathnameOf(urlOrPathname: string) {
  if (urlOrPathname.startsWith("http://") || urlOrPathname.startsWith("https://")) {
    let url: URL;
    try {
      url = new URL(urlOrPathname);
    } catch {
      return null;
    }
    if (url.port !== String(PORT) || (url.hostname !== "localhost" && url.hostname !== "127.0.0.1")) return null;
    return decodeURIComponent(url.pathname).replace(/^\/+/, "");
  }
  return urlOrPathname.replace(/^\/+/, "");
}

function send(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

function cors(request: IncomingMessage, response: ServerResponse) {
  response.setHeader("access-control-allow-origin", "*");
  response.setHeader("access-control-allow-methods", "GET, HEAD, PUT, POST, OPTIONS");
  response.setHeader("access-control-allow-headers", request.headers["access-control-request-headers"] ?? "*");
  response.setHeader("access-control-expose-headers", "content-length, content-range, content-type, etag, last-modified");
  response.setHeader("access-control-max-age", "600");
}

async function readBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw new ApiError(400, "bad_request", `the file length cannot be greater than ${MAX_BODY_BYTES} bytes`);
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

function signatureMatches(payload: string, signature: string) {
  const expected = Buffer.from(createHmac("sha256", TOKEN).update(payload).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

// vercel_blob_client_<store id>_<base64 of "<hex HMAC>.<base64 payload>">, as
// generateClientTokenFromReadWriteToken makes it. The HMAC is checked with the local read-write token.
function clientTokenPayload(token: string): TokenPayload {
  const parts = token.split("_");
  if (parts[3] !== STORE_ID || !parts[4]) throw new ApiError(403, "forbidden", "Access denied, please provide a valid token for this resource.");
  const [signature = "", payload = ""] = Buffer.from(parts[4], "base64").toString().split(".");
  if (!payload || !signatureMatches(payload, signature)) {
    throw new ApiError(403, "forbidden", "Access denied, please provide a valid token for this resource.");
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64").toString()) as TokenPayload;
  } catch {
    throw new ApiError(403, "forbidden", "Access denied, please provide a valid token for this resource.");
  }
}

type Auth = { kind: "readWrite" } | { kind: "client"; payload: TokenPayload };

function authOf(request: IncomingMessage): Auth | null {
  const header = request.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  if (!token) return null;
  if (token.startsWith("vercel_blob_client_")) return { kind: "client", payload: clientTokenPayload(token) };
  const given = Buffer.from(token);
  const expected = Buffer.from(TOKEN);
  if (given.length === expected.length && timingSafeEqual(given, expected)) return { kind: "readWrite" };
  throw new ApiError(403, "forbidden", "Access denied, please provide a valid token for this resource.");
}

function requireAuth(request: IncomingMessage) {
  const auth = authOf(request);
  if (!auth) throw new ApiError(403, "forbidden", "Access denied, please provide a valid token for this resource.");
  return auth;
}

function requireReadWrite(request: IncomingMessage) {
  const auth = requireAuth(request);
  if (auth.kind !== "readWrite") {
    throw new ApiError(403, "client_token_not_allowed", "This operation is not available when using a client token. Use a read–write or OIDC token on the server.");
  }
}

function typeAllowed(contentType: string, allowed: string[]) {
  return allowed.some((rule) => {
    if (rule === contentType) return true;
    if (rule.endsWith("/*")) return contentType.startsWith(rule.slice(0, -1));
    return false;
  });
}

function withRandomSuffix(pathname: string) {
  const bytes = randomBytes(30);
  const suffix = [...bytes].map((byte) => SUFFIX_CHARS[byte % SUFFIX_CHARS.length]).join("");
  const slash = pathname.lastIndexOf("/");
  const dot = pathname.lastIndexOf(".");
  if (dot > slash + 1) return `${pathname.slice(0, dot)}-${suffix}${pathname.slice(dot)}`;
  return `${pathname}-${suffix}`;
}

// PUT /?pathname=<pathname>: put() on the server with the read-write token, or the browser's
// upload() with a client token. A client token upload is refused the way Vercel refuses it, with the
// messages @vercel/blob turns into its typed errors.
async function handlePut(request: IncomingMessage, url: URL, response: ServerResponse) {
  if (url.searchParams.has("fromUrl")) throw new ApiError(400, "bad_request", "copy() is not part of the local stand-in.");
  const auth = requireAuth(request);
  let pathname = safePathname(url.searchParams.get("pathname"));
  const extension = pathname.includes(".") ? (pathname.split(".").pop() ?? "").toLowerCase() : "";
  const contentType = String(request.headers["x-content-type"] ?? "") || CONTENT_TYPES[extension] || "application/octet-stream";
  const access = request.headers["x-vercel-blob-access"] === "private" ? "private" : "public";
  let addRandomSuffix = request.headers["x-add-random-suffix"] === "1";
  let allowOverwrite = request.headers["x-allow-overwrite"] === "1";
  let cacheSeconds = Number(request.headers["x-cache-control-max-age"] ?? 2592000);

  if (auth.kind === "client") {
    const token = auth.payload;
    if (typeof token.validUntil !== "number" || token.validUntil < Date.now()) throw new ApiError(400, "bad_request", "Token expired");
    if (token.pathname !== pathname) {
      throw new ApiError(400, "bad_request", `The "pathname" ${pathname} does not match the token payload "pathname" ${token.pathname ?? ""}.`);
    }
    if (token.allowedContentTypes && !typeAllowed(contentType, token.allowedContentTypes)) {
      throw new ApiError(400, "bad_request", `"contentType" ${contentType} is not allowed`);
    }
    addRandomSuffix = token.addRandomSuffix === true;
    allowOverwrite = token.allowOverwrite === true;
    if (typeof token.cacheControlMaxAge === "number") cacheSeconds = token.cacheControlMaxAge;
  }

  const declared = Number(request.headers["x-content-length"] ?? request.headers["content-length"] ?? NaN);
  const maximum = auth.kind === "client" ? auth.payload.maximumSizeInBytes : undefined;
  if (typeof maximum === "number" && Number.isFinite(declared) && declared > maximum) {
    throw new ApiError(400, "bad_request", `the file length cannot be greater than ${maximum} bytes`);
  }
  const body = await readBody(request);
  if (typeof maximum === "number" && body.length > maximum) {
    throw new ApiError(400, "bad_request", `the file length cannot be greater than ${maximum} bytes`);
  }

  if (addRandomSuffix) pathname = withRandomSuffix(pathname);
  if (!allowOverwrite && (await readMeta(pathname))) {
    throw new ApiError(400, "bad_request", "This blob already exists, use `allowOverwrite: true` if you want to overwrite it.");
  }
  const meta: Meta = {
    pathname,
    contentType,
    size: body.length,
    uploadedAt: new Date().toISOString(),
    etag: `"${createHash("md5").update(body).digest("hex")}"`,
    access,
    cacheControl: `public, max-age=${Number.isFinite(cacheSeconds) ? cacheSeconds : 2592000}`,
  };
  await fs.mkdir(path.dirname(filePath(pathname)), { recursive: true });
  await fs.mkdir(path.dirname(metaPath(pathname)), { recursive: true });
  await fs.writeFile(filePath(pathname), body);
  await fs.writeFile(metaPath(pathname), JSON.stringify(meta));
  send(response, 200, {
    url: blobUrl(pathname),
    downloadUrl: downloadUrl(pathname),
    pathname,
    contentType,
    contentDisposition: `inline; filename="${fileName(pathname)}"`,
    etag: meta.etag,
  });
}

// GET /?url=<url or pathname>: head().
async function handleHead(request: IncomingMessage, url: URL, response: ServerResponse) {
  requireReadWrite(request);
  const pathname = pathnameOf(url.searchParams.get("url") ?? "");
  const meta = pathname ? await readMeta(pathname) : null;
  if (!meta) throw new ApiError(404, "not_found", "The requested blob does not exist");
  send(response, 200, {
    url: blobUrl(meta.pathname),
    downloadUrl: downloadUrl(meta.pathname),
    pathname: meta.pathname,
    size: meta.size,
    contentType: meta.contentType,
    contentDisposition: `inline; filename="${fileName(meta.pathname)}"`,
    cacheControl: meta.cacheControl,
    uploadedAt: meta.uploadedAt,
    etag: meta.etag,
  });
}

async function allMeta(directory = META): Promise<Meta[]> {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  const found: Meta[] = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await allMeta(full)));
    else if (entry.name.endsWith(".json")) {
      try {
        found.push(JSON.parse(await fs.readFile(full, "utf8")) as Meta);
      } catch {
        // A half-written entry is skipped.
      }
    }
  }
  return found;
}

// GET /?prefix=&limit=&cursor=&mode=: list(). The cursor is the last pathname of the page.
async function handleList(request: IncomingMessage, url: URL, response: ServerResponse) {
  requireReadWrite(request);
  const prefix = url.searchParams.get("prefix") ?? "";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 1000) || 1000, 1), 1000);
  const after = url.searchParams.get("cursor") ? Buffer.from(url.searchParams.get("cursor") ?? "", "base64url").toString() : "";
  const folded = url.searchParams.get("mode") === "folded";
  const matching = (await allMeta())
    .filter((meta) => meta.pathname.startsWith(prefix))
    .sort((left, right) => (left.pathname < right.pathname ? -1 : 1));
  const folders = new Set<string>();
  const blobs: Meta[] = [];
  for (const meta of matching) {
    const rest = meta.pathname.slice(prefix.length);
    if (folded && rest.includes("/")) folders.add(prefix + rest.slice(0, rest.indexOf("/") + 1));
    else blobs.push(meta);
  }
  const start = after ? blobs.findIndex((meta) => meta.pathname > after) : 0;
  const page = start < 0 ? [] : blobs.slice(start, start + limit);
  const hasMore = start >= 0 && start + limit < blobs.length;
  send(response, 200, {
    blobs: page.map((meta) => ({
      url: blobUrl(meta.pathname),
      downloadUrl: downloadUrl(meta.pathname),
      pathname: meta.pathname,
      size: meta.size,
      uploadedAt: meta.uploadedAt,
      etag: meta.etag,
    })),
    cursor: hasMore ? Buffer.from(page[page.length - 1].pathname).toString("base64url") : undefined,
    hasMore,
    ...(folded ? { folders: [...folders].sort() } : {}),
  });
}

async function removeEmptyParents(file: string, stop: string) {
  let directory = path.dirname(file);
  while (directory.startsWith(stop) && directory !== stop) {
    try {
      await fs.rmdir(directory);
    } catch {
      return;
    }
    directory = path.dirname(directory);
  }
}

// POST /delete with {"urls": [...]}: del(). A name that is not stored is skipped, as Vercel does.
async function handleDelete(request: IncomingMessage, response: ServerResponse) {
  requireReadWrite(request);
  let urls: unknown;
  try {
    urls = (JSON.parse((await readBody(request)).toString()) as { urls?: unknown }).urls;
  } catch {
    throw new ApiError(400, "bad_request", "Invalid body");
  }
  if (!Array.isArray(urls)) throw new ApiError(400, "bad_request", "Invalid body");
  for (const value of urls) {
    const pathname = typeof value === "string" ? pathnameOf(value) : null;
    if (!pathname) continue;
    let safe: string;
    try {
      safe = safePathname(pathname);
    } catch {
      continue;
    }
    await fs.rm(filePath(safe), { force: true });
    await fs.rm(metaPath(safe), { force: true });
    await removeEmptyParents(filePath(safe), FILES);
    await removeEmptyParents(metaPath(safe), META);
  }
  send(response, 200, {});
}

// GET or HEAD /<pathname>: the stored file, with Range support, as the public store serves it.
async function serveFile(request: IncomingMessage, url: URL, response: ServerResponse) {
  let pathname: string;
  try {
    pathname = safePathname(decodeURIComponent(url.pathname));
  } catch {
    response.writeHead(404).end("Not found");
    return;
  }
  const meta = await readMeta(pathname);
  if (!meta) {
    response.writeHead(404).end("Not found");
    return;
  }
  if (meta.access === "private") {
    const auth = authOf(request);
    if (auth?.kind !== "readWrite") {
      response.writeHead(403).end("Forbidden");
      return;
    }
  }
  const bytes = await fs.readFile(filePath(pathname));
  const headers: Record<string, string> = {
    "content-type": meta.contentType,
    "accept-ranges": "bytes",
    etag: meta.etag,
    "last-modified": new Date(meta.uploadedAt).toUTCString(),
    "cache-control": meta.cacheControl,
    "content-disposition": `${url.searchParams.get("download") === "1" ? "attachment" : "inline"}; filename="${fileName(pathname)}"`,
  };
  const range = /^bytes=(\d*)-(\d*)$/.exec(String(request.headers.range ?? ""));
  let start = 0;
  let end = bytes.length - 1;
  let status = 200;
  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
    } else {
      start = Math.max(bytes.length - Number(range[2]), 0);
    }
    if (start > end || start >= bytes.length) {
      response.writeHead(416, { "content-range": `bytes */${bytes.length}` }).end();
      return;
    }
    status = 206;
    headers["content-range"] = `bytes ${start}-${end}/${bytes.length}`;
  }
  const slice = bytes.subarray(start, end + 1);
  headers["content-length"] = String(slice.length);
  response.writeHead(status, headers);
  response.end(request.method === "HEAD" ? undefined : slice);
}

async function route(request: IncomingMessage, response: ServerResponse) {
  cors(request, response);
  const url = new URL(request.url ?? "/", ORIGIN);
  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }
  if (request.method === "PUT" && url.pathname === "/") return handlePut(request, url, response);
  if (request.method === "POST" && url.pathname === "/delete") return handleDelete(request, response);
  if (request.method === "POST" && url.pathname === "/mpu") throw new ApiError(400, "bad_request", "Multipart uploads are not part of the local stand-in.");
  if (request.method === "GET" && url.pathname === "/") {
    if (url.searchParams.has("url")) return handleHead(request, url, response);
    return handleList(request, url, response);
  }
  if (request.method === "GET" || request.method === "HEAD") return serveFile(request, url, response);
  throw new ApiError(400, "bad_request", "This request is not part of the local stand-in.");
}

function handle(request: IncomingMessage, response: ServerResponse) {
  route(request, response).catch((error: unknown) => {
    const failure = error instanceof ApiError ? error : new ApiError(500, "internal_server_error", "The stand-in failed.");
    if (!(error instanceof ApiError)) console.error(error);
    if (!response.headersSent) send(response, failure.status, { error: { code: failure.code, message: failure.message } });
    else response.end();
  });
}

// Only the loopback addresses, so nothing outside this machine can reach it. localhost can resolve to
// either one, so it listens on both.
createServer(handle).listen(PORT, "127.0.0.1", () => {
  console.log(`Local media stand-in on ${ORIGIN}, store id ${STORE_ID}, files in ${path.relative(process.cwd(), ROOT)}/`);
});
createServer(handle)
  .on("error", () => {
    // This machine has no IPv6 loopback. 127.0.0.1 is enough.
  })
  .listen(PORT, "::1");

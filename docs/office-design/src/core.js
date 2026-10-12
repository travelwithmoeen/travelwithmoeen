/* Shared prototype engine, part 1: state, helpers, components, dialogs, toasts.
   Each version sets window.VERSION before this runs. */
(() => {
  const V = window.VERSION;
  const SEED = window.TWM_SEED;
  const KEY = `twm-office-${V.id}`;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(`${KEY}-${k}`); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(`${KEY}-${k}`, JSON.stringify(v)); } catch (e) {} },
    clear() { try { Object.keys(localStorage).filter((k) => k.startsWith(KEY)).forEach((k) => localStorage.removeItem(k)); } catch (e) {} },
  };

  const S = {
    data: store.get("data", null) || clone(SEED),
    role: store.get("role", "owner"),
    theme: store.get("theme", "system"),
    density: store.get("density", "comfortable"),
    signedIn: store.get("signedIn", true),
    sideCollapsed: store.get("sideCollapsed", false),
    recent: store.get("recent", []),
  };
  const save = () => store.set("data", S.data);

  /* ---------- Roles (mirror lib/auth/permissions.ts) ---------- */
  const can = {
    content: () => S.role === "owner" || S.role === "editor",
    rates: () => S.role === "owner" || S.role === "manager",
    users: () => S.role === "owner",
    backup: () => S.role === "owner",
    deleteTour: () => S.role === "owner",
    requestStatus: () => S.role === "owner" || S.role === "manager",
    requestDelete: () => S.role === "owner",
  };
  const ROLE_NAME = { owner: "Owner", manager: "Manager", editor: "Editor" };
  const ME = { owner: "moeen@travelwithmoeen.com", manager: "manager@travelwithmoeen.com", editor: "editor@travelwithmoeen.com" };

  /* ---------- Icons ---------- */
  const IC = {
    home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
    inbox: "M3 13h5l1.5 3h5L16 13h5M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z",
    users: "M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 20v-1a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    tag: "M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01",
    map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
    pin: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
    file: "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 13h8M8 17h5",
    image: "M4 4h16v16H4zM4 16l5-5 4 4 2-2 5 5M15.5 8.5h.01",
    star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z",
    slides: "M3 5h18v12H3zM8 21h8M12 17v4",
    sliders: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4v4M10 10v4M18 16v4",
    logout: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
    plus: "M12 5v14M5 12h14",
    trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    check: "M5 12.5l4.5 4.5L19 7",
    checkCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.5l2.5 2.5L16 9.5",
    alert: "M12 4 2.5 20h19zM12 10v4M12 17h.01",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
    errorCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16h.01",
    x: "M6 6l12 12M18 6 6 18",
    chevR: "M9 6l6 6-6 6", chevD: "M6 9l6 6 6-6", chevL: "M15 6l-6 6 6 6", chevU: "M6 15l6-6 6 6",
    upload: "M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
    download: "M12 4v12M7 11l5 5 5-5M4 20h16",
    menu: "M4 6h16M4 12h16M4 18h16",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
    undo: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
    calc: "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
    palette: "M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-1 3.7A1.5 1.5 0 0 1 12 21zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9",
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    arrowUp: "M12 19V5M6 11l6-6 6 6", arrowDown: "M12 5v14M6 13l6 6 6-6",
    refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
    external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
    sidebar: "M4 4h16v16H4zM9 4v16",
    keyboard: "M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M7 14h10",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
    mail: "M4 6h16v12H4zM4 7l8 6 8-6",
    whatsapp: "M4 20l1.4-4.2A8 8 0 1 1 8.4 18.7zM9 9.5c.5 2 2 3.6 4.4 4.6l1.2-1.2 1.9.8-.4 1.6c-3.6.3-7.6-3.4-7.7-7.2l1.6-.4.8 1.9z",
    sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
    activity: "M3 12h4l3-8 4 16 3-8h4",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5",
    help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01",
  };
  const icon = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${IC[n] || ""}"/></svg>`;

  /* ---------- Photo placeholders (no external images) ---------- */
  const PALETTES = [
    ["#ffcf8b", "#f08a5d"], ["#9be7ff", "#3f7fd8"], ["#b7e4a3", "#3f8f5a"], ["#c3b6ff", "#6d7fe0"],
    ["#e9eef6", "#9bb2d1"], ["#ffd77a", "#e0732e"], ["#a8edea", "#4f9fb8"], ["#f6c4d4", "#a06ab4"],
  ];
  const MOUNT = "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 400 200%27 preserveAspectRatio=%27none%27%3E%3Cpath d=%27M0 200V138l62-52 46 34 70-78 66 76 44-28 112 66v44z%27 fill=%27%230b1b33%27 fill-opacity=%27.30%27/%3E%3Cpath d=%27M0 200v-30l86-50 70 44 92-56 82 52 70-22v62z%27 fill=%27%230b1b33%27 fill-opacity=%27.48%27/%3E%3C/svg%3E')";
  const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const art = (seed) => { const [a, b] = PALETTES[hash(seed) % PALETTES.length]; return `background:${MOUNT} bottom/100% 72% no-repeat,linear-gradient(160deg,${a},${b})`; };

  /* ---------- Formatting ---------- */
  const rs = (n) => "Rs " + new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(n);
  const num = (n) => new Intl.NumberFormat("en-PK").format(n);
  const dt = (iso, opt = { dateStyle: "medium", timeStyle: "short" }) => new Intl.DateTimeFormat("en-US", { ...opt, timeZone: "Asia/Karachi" }).format(new Date(iso));
  const rel = (iso) => {
    const d = (Date.parse("2026-10-09T09:30:00+05:00") - Date.parse(iso)) / 36e5;
    const f = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
    return d < 1 ? "Just now" : d < 24 ? f.format(-Math.round(d), "hour") : f.format(-Math.round(d / 24), "day");
  };

  /* ---------- Component builders ---------- */
  const attrs = (o = {}) => Object.entries(o).filter(([, v]) => v !== false && v != null).map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`)).join(" ");
  const btn = (label, { v = "secondary", ic = "", size = "", href = "", a = {}, iconOnly = false } = {}) => {
    const cls = `btn btn-${v}${size ? " btn-" + size : ""}${iconOnly ? " btn-icon" : ""}`;
    const inner = `${ic ? icon(ic) : ""}${iconOnly ? `<span class="sr-only">${esc(label)}</span>` : `<span>${esc(label)}</span>`}`;
    return href ? `<a class="${cls}" href="${href}" ${attrs(a)}>${inner}</a>` : `<button type="${a.type || "button"}" class="${cls}" ${attrs({ ...a, type: null })}>${inner}</button>`;
  };
  const badge = (text, tone = "", dot = false) => `<span class="badge${tone ? " b-" + tone : ""}">${dot ? '<span class="dot" aria-hidden="true"></span>' : ""}${esc(text)}</span>`;
  const STATUS = { new: ["New", "info"], in_progress: ["In progress", "warning"], closed: ["Closed", ""] };
  const KIND = { contact: "Contact", custom: "Custom trip", booking: "Booking" };
  const statusBadge = (s) => badge(STATUS[s][0], STATUS[s][1], !!STATUS[s][1]);

  let fid = 0;
  const field = (label, control, { help = "", opt = false, name = "", full = false } = {}) => {
    const id = `f${++fid}`;
    const ctl = control.replace("__ID__", id).replace("__DESC__", help ? `${id}-help` : "");
    return `<div class="field${full ? " full" : ""}" data-field="${esc(name)}"><label class="label" for="${id}">${esc(label)}${opt ? ' <span class="opt">(optional)</span>' : ""}</label>${ctl}${help ? `<p class="help" id="${id}-help">${esc(help)}</p>` : ""}</div>`;
  };
  const input = (name, value = "", a = {}) => `<input class="input" id="__ID__" name="${esc(name)}" value="${esc(value)}" aria-describedby="__DESC__" ${attrs(a)}>`;
  const textarea = (name, value = "", rows = 4, a = {}) => `<textarea class="textarea" id="__ID__" name="${esc(name)}" rows="${rows}" aria-describedby="__DESC__" ${attrs(a)}>${esc(value)}</textarea>`;
  const select = (name, value, options, a = {}) => `<select class="select" id="__ID__" name="${esc(name)}" aria-describedby="__DESC__" ${attrs(a)}>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? "selected" : ""}>${esc(l)}</option>`; }).join("")}</select>`;
  const money = (name, value, a = {}) => `<div class="money"><span class="affix" aria-hidden="true">Rs</span><input class="input" id="__ID__" name="${esc(name)}" inputmode="numeric" autocomplete="off" value="${esc(value === "" ? "" : num(value))}" data-money aria-describedby="__DESC__" ${attrs(a)}></div>`;
  const check = (name, on, label, desc = "") => `<label class="check"><input type="checkbox" name="${esc(name)}" ${on ? "checked" : ""}><span>${esc(label)}${desc ? `<small>${esc(desc)}</small>` : ""}</span></label>`;
  const sw = (name, on, label, hideLabel = false) => `<label class="switch"><input type="checkbox" role="switch" name="${esc(name)}" ${on ? "checked" : ""}><span class="track" aria-hidden="true"><span class="thumb"></span></span><span class="${hideLabel ? "sr-only" : ""}">${esc(label)}</span></label>`;
  const drop = (name, current = "") => `
    <div class="drop" data-drop>
      <span class="drop-ic">${icon("upload")}</span>
      <div><label class="drop-label"><input type="file" id="__ID__" name="${esc(name)}" accept="image/jpeg,image/png,image/webp" data-file class="sr-only-file" aria-describedby="__DESC__"><b>Choose a photo</b> or drag it here</label></div>
      <p class="help">JPEG, PNG, or WebP. 5 MB or less.</p>
      <div class="drop-result" aria-live="polite">${current ? `<div class="filechip"><span class="fthumb" style="${art(current)}"></span><span class="fmeta">${esc(current.split("/").pop())}<small>Live on the site</small></span></div>` : ""}</div>
    </div>`;
  const alert = (tone, title, body = "", role = "note") => `<div class="alert a-${tone}" role="${role}">${icon({ info: "info", success: "checkCircle", warning: "alert", danger: "errorCircle" }[tone])}<div><b>${esc(title)}</b>${body ? `<p>${body}</p>` : ""}</div></div>`;
  const empty = (ic, title, body, action = "") => `<div class="empty"><span class="empty-ic">${icon(ic)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>${action}</div>`;
  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([l, h], i) => i === items.length - 1 ? `<li><span aria-current="page">${esc(l)}</span></li>` : `<li><a href="${h}">${esc(l)}</a>${icon("chevR")}</li>`).join("")}</ol></nav>`;
  const pageHead = (title, { desc = "", actions = "", crumb = null, badgeHtml = "" } = {}) => `
    <header class="page-head">
      <div class="ph-text">${crumb ? crumbs(crumb) : ""}<h1 tabindex="-1">${esc(title)}${badgeHtml ? " " + badgeHtml : ""}</h1>${desc ? `<p class="desc">${desc}</p>` : ""}</div>
      ${actions ? `<div class="ph-actions">${actions}</div>` : ""}
    </header>`;
  const tabs = (items, current, base) => `<div class="tabs" role="tablist">${items.map(([k, l, n]) => `<a class="tab" role="tab" href="${base}${k}" aria-selected="${k === current}">${esc(l)}${n != null ? ` <span class="tab-n">${n}</span>` : ""}</a>`).join("")}</div>`;
  const savebar = (label = "Save changes", always = false) => `
    <div class="savebar" data-savebar ${always ? "data-always" : ""} role="region" aria-label="Save">
      <span class="sb-msg" aria-live="polite"><span class="sb-dot" aria-hidden="true"></span><span data-sb-text>${always ? "Fill in the fields, then save." : "Unsaved changes"}</span></span>
      <span class="sb-actions">${always ? "" : btn("Discard", { a: { "data-action": "discard" } })}${btn(label, { v: "primary", a: { type: "submit" } })}</span>
    </div>`;

  /* ---------- Toasts ---------- */
  const toast = (title, { body = "", undo = null, tone = "success", action = null } = {}) => {
    const box = $("#toasts");
    const el = document.createElement("div");
    el.className = `toast t-${tone}`;
    el.setAttribute("role", "status");
    el.innerHTML = `${icon(tone === "success" ? "checkCircle" : "info")}<div><b>${esc(title)}</b>${body ? `<p>${esc(body)}</p>` : ""}</div><span class="toast-actions">${undo ? `<button class="btn btn-ghost btn-sm" data-undo>${icon("undo")}<span>Undo</span></button>` : ""}${action ? `<a class="btn btn-ghost btn-sm" href="${esc(action.href)}">${esc(action.label)}</a>` : ""}<button class="btn btn-ghost btn-sm btn-icon" data-close>${icon("x")}<span class="sr-only">Dismiss</span></button></span>`;
    box.appendChild(el);
    let left = undo ? 10000 : 6000, t0 = Date.now(), timer;
    const close = () => { el.classList.add("out"); setTimeout(() => el.remove(), 200); };
    const run = () => { t0 = Date.now(); timer = setTimeout(close, left); };
    const pause = () => { clearTimeout(timer); left -= Date.now() - t0; };
    el.addEventListener("mouseenter", pause); el.addEventListener("mouseleave", run);
    el.addEventListener("focusin", pause); el.addEventListener("focusout", run);
    el.querySelector("[data-close]").onclick = close;
    if (undo) el.querySelector("[data-undo]").onclick = () => { undo(); close(); toast("Restored"); };
    run();
  };

  /* ---------- Dialogs ---------- */
  let lastFocus = null, onCancelFn = null;
  const trap = (root) => (e) => {
    if (e.key !== "Tab") return;
    const f = $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', root).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const closeDialog = (cancelled = true) => {
    const d = $("#dlg-root");
    if (!d.innerHTML) return;
    const fn = onCancelFn; onCancelFn = null;
    if (cancelled && fn) setTimeout(fn, 0);
    d.innerHTML = "";
    document.body.classList.remove("modal-open");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };
  const dialog = ({ title, body, confirm = "Confirm", tone = "primary", cancel = "Cancel", icon: ic = "", form = "", onConfirm, onCancel = null, alertdialog = false, typeToConfirm = "" }) => {
    lastFocus = document.activeElement; onCancelFn = onCancel;
    const d = $("#dlg-root");
    d.innerHTML = `<div class="dlg-backdrop" data-dlg-close>
      <div class="dlg" role="${alertdialog ? "alertdialog" : "dialog"}" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-b">
        <form class="dlg-form" novalidate>
          <div class="dlg-body">${ic ? `<span class="dlg-ic dlg-ic-${tone}">${icon(ic)}</span>` : ""}<div class="dlg-text"><h2 id="dlg-t">${esc(title)}</h2><div id="dlg-b">${body}</div>${form}
          ${typeToConfirm ? field(`Type ${typeToConfirm} to confirm`, input("confirmText", "", { autocomplete: "off" }), { name: "confirmText" }) : ""}</div></div>
          <div class="dlg-foot">${btn(cancel, { a: { "data-dlg-cancel": true } })}${btn(confirm, { v: tone, a: { type: "submit", "data-dlg-ok": true, disabled: !!typeToConfirm } })}</div>
        </form>
      </div></div>`;
    document.body.classList.add("modal-open");
    const dlg = $(".dlg", d), frm = $("form", d);
    dlg.addEventListener("keydown", trap(dlg));
    $("[data-dlg-cancel]", d).onclick = () => closeDialog(true);
    d.querySelector(".dlg-backdrop").addEventListener("mousedown", (e) => { if (e.target.hasAttribute("data-dlg-close")) closeDialog(true); });
    if (typeToConfirm) frm.addEventListener("input", () => { $("[data-dlg-ok]", d).disabled = frm.confirmText.value.trim() !== typeToConfirm; });
    frm.onsubmit = (e) => {
      e.preventDefault();
      const r = onConfirm ? onConfirm(new FormData(frm), frm) : true;
      if (r && r.errors) { showErrors(frm, r.errors, false); return; }
      closeDialog(false);
    };
    (tone === "danger" ? $("[data-dlg-cancel]", d) : ($("input,select,textarea", $(".dlg-text", d)) || $("[data-dlg-ok]", d))).focus();
  };

  /* ---------- Validation display ---------- */
  const clearErrors = (form) => {
    $$(".err", form).forEach((e) => e.remove());
    $$('[aria-invalid="true"]', form).forEach((e) => e.removeAttribute("aria-invalid"));
    $$(".form-errors", form).forEach((e) => e.remove());
  };
  const showErrors = (form, errors, summary = true) => {
    clearErrors(form);
    const list = [];
    Object.entries(errors).forEach(([name, msg]) => {
      const el = form.querySelector(`[name="${CSS.escape(name)}"]`);
      if (!el) return;
      el.setAttribute("aria-invalid", "true");
      const id = `${el.id || name}-err`;
      const p = document.createElement("p");
      p.className = "err"; p.id = id; p.innerHTML = `${icon("errorCircle")}<span>${esc(msg)}</span>`;
      const host = el.closest(".field") || el.closest("td") || el.parentElement;
      const after = host.querySelector(".label") ? (el.closest(".money") || el.closest(".switch") || el) : (el.closest(".money") || el);
      after.insertAdjacentElement("afterend", p);
      el.setAttribute("aria-describedby", [id, el.getAttribute("aria-describedby")].filter(Boolean).join(" "));
      const label = form.querySelector(`label[for="${el.id}"]`)?.textContent.replace("(optional)", "").trim() || el.getAttribute("aria-label") || name;
      list.push([el.id, `${label}: ${msg.charAt(0).toLowerCase()}${msg.slice(1)}`]);
    });
    if (summary && list.length) {
      const box = document.createElement("div");
      box.className = "form-errors alert a-danger"; box.setAttribute("role", "alert"); box.tabIndex = -1;
      box.innerHTML = `${icon("errorCircle")}<div><b>${list.length === 1 ? "1 field needs a fix" : `${list.length} fields need a fix`}</b><ul>${list.map(([id, m]) => `<li><a href="#${id}" data-jump="${id}">${esc(m)}</a></li>`).join("")}</ul></div>`;
      form.prepend(box);
      box.focus();
    } else if (list.length) {
      document.getElementById(list[0][0])?.focus();
    }
  };

  /* ---------- Validation rules (mirror lib/rates.ts and lib/office) ---------- */
  const readAmount = (raw) => {
    const t = String(raw ?? "").replace(/,/g, "").trim();
    if (!t) return { error: "Enter an amount." };
    if (t.startsWith("-")) return { error: "Enter an amount that is not negative." };
    if (!/^\d+$/.test(t)) return { error: "Enter a number." };
    const n = Number(t);
    if (n > 10000000) return { error: "Enter an amount of 10,000,000 rupees or less." };
    return { value: n };
  };
  const readCount = (raw, max) => {
    const t = String(raw ?? "").trim();
    if (!/^\d+$/.test(t)) return { error: "Enter a number." };
    const n = Number(t);
    if (n < 1 || n > max) return { error: `Enter a number from 1 to ${max}.` };
    return { value: n };
  };
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  window.OFFICE = { V, S, save, store, can, ROLE_NAME, ME, esc, clone, $, $$, icon, IC, art, rs, num, dt, rel, btn, badge, STATUS, KIND, statusBadge, field, input, textarea, select, money, check, sw, drop, alert, empty, crumbs, pageHead, tabs, savebar, toast, dialog, closeDialog, showErrors, clearErrors, readAmount, readCount, isEmail, attrs };
})();

/* Shared prototype engine, part 3: router, saving, actions, palette, design-system page. */
(() => {
  const O = window.OFFICE;
  const { V, S, save, store, can, ROLE_NAME, ME, esc, clone, $, $$, icon, rs, num, dt, btn, badge, field, input, select, alert, empty, pageHead, toast, dialog, closeDialog, showErrors, clearErrors, readAmount, readCount, isEmail, SCREENS, shell, card } = O;
  const D = () => S.data;
  const root = $("#app");
  S.drawerWide = store.get("drawerWide", false);

  /* ---------- Routing ---------- */
  const parse = () => {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs = ""] = h.split("?");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    const q = Object.fromEntries(new URLSearchParams(qs));
    return { key: parts[0] || "dashboard", id: parts[1], q, full: location.hash };
  };
  const CONTENT = ["tours", "places", "blog", "gallery", "reviews", "slides", "site"];
  const allowed = (k) => {
    if (CONTENT.includes(k)) return can.content() || "These pages are open to the Owner and Editors.";
    if (k === "rates") return can.rates() || "Rates and quotes are open to the Owner and the Manager.";
    if (k === "users" || k === "backups") return can.users() || "This page is open to the Owner only.";
    return true;
  };

  const applyTheme = () => {
    const h = document.documentElement;
    if (S.theme === "system") h.removeAttribute("data-theme"); else h.setAttribute("data-theme", S.theme);
    h.setAttribute("data-density", S.density);
  };

  let lastRoute = "";
  const render = (opts = {}) => {
    applyTheme();
    const r = parse();
    if (!S.signedIn) {
      root.innerHTML = SCREENS.login();
      if (r.key !== "login") history.replaceState(null, "", "#/login");
      afterRender(true, r);
      return;
    }
    if (r.key === "login") { location.hash = "#/dashboard"; return; }
    let page;
    const ok = allowed(r.key);
    if (r.key === "system") page = SYSTEM();
    else if (ok !== true) page = SCREENS.denied(ok);
    else if (SCREENS[r.key]) page = SCREENS[r.key](r.id, r.q);
    else page = pageHead("Page not found", { desc: "The address may be mistyped." }) + btn("Go to dashboard", { href: "#/dashboard" });
    const navKey = r.key === "system" ? "" : r.key;
    const routeChanged = r.full !== lastRoute;
    const scrollY = window.scrollY;
    root.innerHTML = shell(navKey, page);
    afterRender(routeChanged && !opts.keepFocus, r);
    if (!routeChanged || opts.keepScroll) window.scrollTo(0, scrollY);
    lastRoute = r.full;
  };

  const afterRender = (moveFocus, r) => {
    document.body.classList.toggle("drawer-open", !!$(".drawer"));
    document.body.classList.remove("nav-open");
    applyFilters();
    $$("[data-money]").forEach(fmtMoney);
    if (r.key === "system") fillSystem();
    $$("[data-count]").forEach((el) => { const c = document.createElement("p"); c.className = "counter"; c.id = `${el.id}-count`; c.setAttribute("aria-live", "polite"); el.insertAdjacentElement("afterend", c); el.setAttribute("aria-describedby", [el.getAttribute("aria-describedby"), c.id].filter(Boolean).join(" ")); updateCount(el); });
    const h1 = ($(".drawer h2") || $("main h1"))?.textContent.trim();
    if (h1 && r.key !== "dashboard" && r.key !== "system") { S.recent = [{ href: location.hash, label: h1, ic: (O.navItems().find((i) => i.key === r.key) || {}).ic || "file" }, ...S.recent.filter((x) => x.href !== location.hash)].slice(0, 5); store.set("recent", S.recent); }
    if (moveFocus) {
      const target = $(".drawer h2") || $("main h1") || $("main");
      if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: !!$(".drawer") }); }
      if (!$(".drawer")) window.scrollTo(0, 0);
    }
    if (r.key === "users" && r.q.create) { history.replaceState(null, "", "#/users"); lastRoute = "#/users"; actions["create-user"](); }
    document.title = `${$("main h1")?.textContent.trim() || "Office"} · ${V.name} · Travel With Moeen`;
  };

  /* ---------- Filters ---------- */
  const applyFilters = () => {
    const main = $("#main"); if (!main) return;
    const qEl = $("[data-filter]", main);
    const q = (qEl?.value || "").trim().toLowerCase();
    const keys = $$("[data-filter-key]", main).map((s) => [s.dataset.filterKey, s.value]).filter(([, v]) => v);
    const items = $$("[data-search]", main);
    if (!items.length) return;
    const sortEl = $("[data-sort]", main);
    if (sortEl) {
      const [k, dir] = sortEl.value.split(":");
      const parent = items[0].parentElement;
      const val = (el) => el.getAttribute(`data-s-${k}`) || "";
      [...items].sort((a, b) => { const x = val(a), y = val(b); const n = /^-?\d+(\.\d+)?$/.test(x) && /^-?\d+(\.\d+)?$/.test(y); const c = n ? x - y : x.localeCompare(y); return dir === "desc" ? -c : c; }).forEach((el) => parent.appendChild(el));
    }
    let shown = 0;
    items.forEach((el) => {
      const ok = (!q || el.dataset.search.includes(q)) && keys.every(([k, v]) => el.getAttribute(`data-f-${k}`) === v);
      el.hidden = !ok; if (ok) shown++;
    });
    const c = $("[data-filter-count]", main);
    if (c) { const n = c.dataset.noun || "items"; c.textContent = q || keys.length ? `${shown} of ${items.length} ${n}` : `${items.length} ${n}`; }
    const host = items[0].closest(".tbl-wrap, .rowlist, .cardgrid, .photogrid, .board") || items[0].parentElement;
    let none = $(".no-results", main);
    if (shown === 0 && (q || keys.length)) {
      if (!none) { none = document.createElement("div"); none.className = "no-results"; host.insertAdjacentElement("afterend", none); }
      none.innerHTML = `${icon("search")}<div><b>No matches${q ? ` for “${esc(q)}”` : ""}</b><p>Check the spelling or clear the filters.</p></div><button class="btn btn-secondary btn-sm" data-action="clear-filters">Clear filters</button>`;
      host.hidden = true;
    } else { if (none) none.remove(); host.hidden = false; }
  };

  const updateCount = (el) => { const max = +el.dataset.count, n = el.value.length, c = document.getElementById(`${el.id}-count`); if (!c) return; c.textContent = `${n} / ${max} characters${n > max ? ". Longer than recommended." : ""}`; c.classList.toggle("over", n > max); };
  /* ---------- Money formatting ---------- */
  const fmtMoney = (el) => { const v = el.value.replace(/,/g, "").trim(); if (/^\d+$/.test(v)) el.value = num(Number(v)); };

  /* ---------- Dirty tracking ---------- */
  const changed = (el) => {
    if (el.type === "checkbox" || el.type === "radio") return el.checked !== el.defaultChecked;
    if (el.tagName === "SELECT") return [...el.options].some((o) => o.selected !== o.defaultSelected);
    if (el.type === "file") return !!el.files.length;
    return el.value !== el.defaultValue && !(el.hasAttribute("data-money") && el.value.replace(/,/g, "") === el.defaultValue.replace(/,/g, ""));
  };
  const markDirty = (form) => {
    if (!form || !form.hasAttribute("data-track")) return;
    let n = 0;
    $$("input[name], select[name], textarea[name]", form).forEach((el) => {
      const c = changed(el); if (c) n++;
      (el.closest(".field") || el.closest("td"))?.classList.toggle("is-changed", c);
    });
    const structural = form.dataset.structural ? +form.dataset.structural : 0;
    n += structural;
    if (n) form.dataset.dirty = "1"; else delete form.dataset.dirty;
    const t = $("[data-sb-text]", form);
    if (t && !form.hasAttribute("data-new")) t.textContent = n === 1 ? "1 unsaved change" : `${n} unsaved changes`;
  };
  const bumpStructural = (form) => { form.dataset.structural = String((+form.dataset.structural || 0) + 1); markDirty(form); };
  const dirtyForm = () => $("form[data-dirty]");

  /* ---------- File check (type by signature, size), like T-26 ---------- */
  const checkFile = async (inp) => {
    const form = inp.closest("form"), box = inp.closest("[data-drop]"), out = $(".drop-result", box);
    const f = inp.files[0];
    delete form.dataset.fileError; delete form.dataset.fileName;
    if (!f) return;
    const head = new Uint8Array(await f.slice(0, 12).arrayBuffer());
    const hex = [...head].map((b) => b.toString(16).padStart(2, "0")).join("");
    const kind = hex.startsWith("ffd8ff") ? "JPEG" : hex.startsWith("89504e47") ? "PNG" : hex.startsWith("52494646") && hex.slice(16, 24) === "57454250" ? "WebP" : "";
    let err = "";
    if (!kind) err = `${f.name} can't be used. Choose a JPEG, PNG, or WebP photo.`;
    else if (f.size > 5 * 1024 * 1024) err = `${f.name} is ${(f.size / 1048576).toFixed(1)} MB. Choose a photo of 5 MB or less.`;
    if (err) {
      form.dataset.fileError = err;
      out.innerHTML = `<p class="err" role="alert">${icon("errorCircle")}<span>${esc(err)}</span></p>`;
    } else {
      form.dataset.fileName = f.name;
      const url = URL.createObjectURL(f);
      out.innerHTML = `<div class="filechip"><span class="fthumb" style="background:url('${url}') center/cover"></span><span class="fmeta">${esc(f.name)}<small>${kind} · ${(f.size / 1048576).toFixed(1)} MB · saves when you press Save</small></span></div>`;
      const pv = $(".preview .pv-img, .preview .pv-slide-card");
      if (pv) pv.style.background = `url('${url}') center/cover`;
    }
    markDirty(form);
  };

  /* ---------- Saving ---------- */
  const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const zip = (fd, names, keys) => { const cols = names.map((n) => fd.getAll(n)); return cols[0].map((_, i) => Object.fromEntries(keys.map((k, j) => [k, k === "highlights" ? lines(cols[j][i]) : String(cols[j][i]).trim()]))).filter((o) => Object.values(o).some((v) => (Array.isArray(v) ? v.length : v))); };
  const log = (text, href) => { D().activity = [{ at: new Date().toISOString(), who: ME[S.role], text, href }, ...(D().activity || [])].slice(0, 40); };
  const stampIt = (x) => { x.updatedAt = new Date().toISOString(); x.updatedBy = ME[S.role]; };
  const done = (msg, body = "", go = null) => { toast(msg, { body }); if (go && location.hash !== go) location.hash = go; else render({ keepFocus: true, keepScroll: true }); };
  const nextId = (arr) => Math.max(0, ...arr.map((x) => +x.id || 0)) + 1;

  const SAVE = {
    login(fd, form) {
      const box = $("[data-login-error]", form);
      if (!isEmail(fd.get("email")) || String(fd.get("password")).length < 8) {
        box.innerHTML = alert("danger", "That email or password is not right.", "Check both and try again.", "alert");
        $(".alert", box).tabIndex = -1; $(".alert", box).focus();
        return;
      }
      S.signedIn = true; store.set("signedIn", true);
      location.hash = "#/dashboard"; render();
    },
    tour(fd, form) {
      const t = D().tours.find((x) => x.code === form.dataset.id), e = {};
      if (!String(fd.get("name")).trim()) e.name = "Enter a title.";
      const d = readCount(fd.get("duration"), 30); if (d.error) e.duration = d.error === "Enter a number." ? d.error : "Enter a number of days from 1 to 30.";
      if (form.dataset.fileError) e.photo = form.dataset.fileError;
      if (Object.keys(e).length) return showErrors(form, e);
      Object.assign(t, { name: fd.get("name").trim(), description: fd.get("description").trim(), location: fd.get("location").trim(), region: fd.get("region").trim(), duration: d.value, transport: fd.get("transport"), gallery: lines(fd.get("gallery")), included: lines(fd.get("included")), notIncluded: lines(fd.get("notIncluded")), categories: lines(fd.get("categories")), packageTypes: lines(fd.get("packageTypes")), featured: fd.has("featured"), days: zip(fd, ["day_title", "day_text", "day_hl"], ["title", "text", "highlights"]) });
      if (form.dataset.fileName) t.image = "/images/tours/" + form.dataset.fileName;
      stampIt(t); log(`Saved tour ${t.name}`, `#/tours/${t.code}`);
      save(); done("Tour saved.", "The public tour page is updated.");
    },
    place(fd, form) {
      const p = D().places.find((x) => x.slug === form.dataset.id);
      if (!String(fd.get("title")).trim()) return showErrors(form, { title: "Enter a title." });
      if (form.dataset.fileError) return showErrors(form, { photo: form.dataset.fileError });
      Object.assign(p, { title: fd.get("title").trim(), excerpt: fd.get("excerpt").trim(), location: fd.get("location").trim(), sections: zip(fd, ["sec_heading", "sec_body", "sec_image", "sec_hl"], ["heading", "body", "image", "highlights"]) });
      if (form.dataset.fileName) p.banner = "/images/destinations/" + form.dataset.fileName;
      stampIt(p); log(`Saved place ${p.title}`, `#/places/${p.slug}`);
      save(); done("Place saved.");
    },
    post(fd, form) {
      const p = D().posts.find((x) => x.slug === form.dataset.id);
      if (!String(fd.get("title")).trim()) return showErrors(form, { title: "Enter a title." });
      if (form.dataset.fileError) return showErrors(form, { photo: form.dataset.fileError });
      Object.assign(p, { title: fd.get("title").trim(), excerpt: fd.get("excerpt").trim(), author: fd.get("author").trim(), date: fd.get("date") || p.date, sections: zip(fd, ["sec_heading", "sec_body", "sec_image", "sec_hl"], ["heading", "body", "image", "highlights"]) });
      if (form.dataset.fileName) p.cover = "/images/blog/" + form.dataset.fileName;
      stampIt(p); log(`Saved post ${p.title}`, `#/blog/${p.slug}`);
      save(); done("Post saved.");
    },
    photo(fd, form) {
      const isNew = form.hasAttribute("data-new"), e = {};
      if (!String(fd.get("alt")).trim()) e.alt = "Enter a description.";
      if (form.dataset.fileError) e.photo = form.dataset.fileError;
      else if (isNew && !form.dataset.fileName) e.photo = "Choose a photo.";
      if (Object.keys(e).length) return showErrors(form, e);
      const vals = { alt: fd.get("alt").trim(), category: fd.get("category"), span: fd.get("span"), homeOnly: fd.has("homeOnly") };
      if (isNew) { D().photos.unshift({ id: nextId(D().photos), src: "/images/gallery/" + form.dataset.fileName, ...vals }); log("Added a gallery photo", "#/gallery"); save(); return done("Photo added.", "", "#/gallery"); }
      const p = D().photos.find((x) => String(x.id) === form.dataset.id); Object.assign(p, vals);
      if (form.dataset.fileName) p.src = "/images/gallery/" + form.dataset.fileName;
      save(); done("Photo saved.");
    },
    review(fd, form) {
      const isNew = form.hasAttribute("data-new"), e = {};
      if (!String(fd.get("name")).trim()) e.name = "Enter the guest's name.";
      if (!String(fd.get("text")).trim()) e.text = "Enter the review.";
      if (Object.keys(e).length) return showErrors(form, e);
      const vals = { name: fd.get("name").trim(), location: fd.get("location").trim(), avatar: fd.get("avatar").trim(), text: fd.get("text").trim(), rating: +fd.get("rating") };
      if (isNew) { D().reviews.unshift({ id: nextId(D().reviews), ...vals }); log(`Added a review from ${vals.name}`, "#/reviews"); save(); return done("Review added.", "", "#/reviews"); }
      Object.assign(D().reviews.find((x) => String(x.id) === form.dataset.id), vals); save(); done("Review saved.");
    },
    slide(fd, form) {
      const isNew = form.hasAttribute("data-new"), e = {};
      if (!String(fd.get("title")).trim()) e.title = "Enter a title.";
      const rot = String(fd.get("rotation")).trim();
      if (!/^-?\d+$/.test(rot) || Math.abs(+rot) > 30) e.rotation = "Enter a tilt from -30 to 30.";
      if (form.dataset.fileError) e.photo = form.dataset.fileError; else if (isNew && !form.dataset.fileName) e.photo = "Choose a photo.";
      if (Object.keys(e).length) return showErrors(form, e);
      const vals = { title: fd.get("title").trim(), rotation: +rot };
      if (isNew) { D().slides.push({ id: nextId(D().slides), image: "/images/slider/" + form.dataset.fileName, order: D().slides.length + 1, ...vals }); save(); return done("Slide added.", "", "#/slides"); }
      const s = D().slides.find((x) => String(x.id) === form.dataset.id); Object.assign(s, vals);
      if (form.dataset.fileName) s.image = "/images/slider/" + form.dataset.fileName;
      save(); done("Slide saved.");
    },
    site(fd, form) {
      const e = {}, g = (k) => String(fd.get(k) || "").trim();
      if (!g("phoneDisplay")) e.phoneDisplay = "Enter the phone number.";
      if (!/^92\d{10}$/.test(g("phoneE164"))) e.phoneE164 = "Enter 12 digits starting with 92, like 923339981177.";
      if (!isEmail(g("email"))) e.email = "Enter an email address, like info@travelwithmoeen.com.";
      if (!g("address")) e.address = "Enter the address.";
      ["mapsUrl", "facebookUrl", "instagramUrl", "tiktokUrl", "youtubeUrl"].forEach((k) => { if (g(k) && !/^https:\/\//.test(g(k))) e[k] = "Enter a link that starts with https://."; });
      if (Object.keys(e).length) return showErrors(form, e);
      Object.keys(D().site).forEach((k) => { if (fd.has(k)) D().site[k] = g(k); });
      log("Saved site details", "#/site"); save(); done("Site details saved.", "The header and footer are updated.");
    },
    hotels(fd, form) {
      const e = {}, next = [];
      D().hotels.forEach((h) => {
        const tw = readAmount(fd.get(`twin_${h.id}`)), tr = readAmount(fd.get(`triple_${h.id}`));
        if (tw.error) e[`twin_${h.id}`] = tw.error; if (tr.error) e[`triple_${h.id}`] = tr.error;
        next.push([h, { twin: tw.value, triple: tr.value, hotel: String(fd.get(`hotel_${h.id}`)).trim(), offered: fd.has(`offered_${h.id}`) }]);
      });
      if (Object.keys(e).length) return showErrors(form, e);
      let n = 0; next.forEach(([h, v]) => { if (JSON.stringify([h.twin, h.triple, h.hotel, h.offered]) !== JSON.stringify([v.twin, v.triple, v.hotel, v.offered])) { n++; Object.assign(h, v); } });
      log(`Saved ${n} hotel ${n === 1 ? "rate" : "rates"}`, "#/rates/hotels"); save(); done(n === 1 ? "1 hotel rate saved." : `${n} hotel rates saved.`, "New quotes use these rates now.");
    },
    vehicles(fd, form) {
      const e = {}, next = []; let forcedOff = 0;
      D().vehicles.forEach((v) => {
        const r = readAmount(fd.get(`rent_${v.id}`)), f = readAmount(fd.get(`fuel_${v.id}`)), t = readAmount(fd.get(`toll_${v.id}`)), s = readCount(fd.get(`seats_${v.id}`), 60);
        [["rent", r], ["fuel", f], ["toll", t], ["seats", s]].forEach(([k, x]) => { if (x.error) e[`${k}_${v.id}`] = x.error; });
        let live = fd.has(`live_${v.id}`);
        if (live && r.value === 0 && f.value === 0 && t.value === 0) { live = false; forcedOff++; }
        next.push([v, { rent: r.value, fuel: f.value, toll: t.value, seats: s.value, live }]);
      });
      if (Object.keys(e).length) return showErrors(form, e);
      next.forEach(([v, x]) => Object.assign(v, x));
      log("Saved vehicle rates", "#/rates/vehicles"); save(); done("Vehicle rates saved.", forcedOff ? "A vehicle with no rent, fuel, or toll stays off." : "New quotes use these rates now.");
    },
    air(fd, form) {
      const e = {}, v = {};
      Object.keys(D().air).forEach((k) => { const a = readAmount(fd.get(k)); if (a.error) e[k] = a.error; else v[k] = a.value; });
      if (Object.keys(e).length) return showErrors(form, e);
      Object.assign(D().air, v); save(); done("Air extras saved.");
    },
    jeeps(fd, form) {
      const e = {};
      D().jeeps.forEach((j) => { const a = readAmount(fd.get(`amount_${j.id}`)); if (a.error) e[`amount_${j.id}`] = a.error; });
      if (Object.keys(e).length) return showErrors(form, e);
      D().jeeps.forEach((j) => { j.amount = readAmount(fd.get(`amount_${j.id}`)).value; j.live = fd.has(`live_${j.id}`); });
      save(); done("Jeep lines saved.");
    },
    season(fd) {
      const p = +fd.get("percent"); if (p !== 15 && p !== 20) return;
      D().season = p; log(`Changed season profit to ${p} percent`, "#/rates/season"); save(); done("Season saved.", `Guest quotes now use ${p} percent profit.`);
    },
    "request-status"(fd, form) {
      const r = D().requests.find((x) => String(x.id) === form.dataset.id);
      r.status = fd.get("status"); save();
      done(`Status changed to ${O.STATUS[r.status][0]}.`);
    },
    quote(fd, form) {
      const e = {};
      const days = readCount(fd.get("days"), 30), adults = readCount(fd.get("adults"), 50);
      const ch = String(fd.get("children")).trim();
      if (days.error) e.days = "Enter a number of days from 1 to 30.";
      if (adults.error) e.adults = "Enter a number of adults from 1 to 50.";
      if (!/^\d+$/.test(ch) || +ch > 50) e.children = "Enter a number from 0 to 50.";
      if (fd.get("mode") === "road" && fd.get("start") === "Karachi") e.start = "Karachi starts are by air only. Choose Air or another city.";
      if (Object.keys(e).length) return showErrors(form, e);
      clearErrors(form);
      const pct = +fd.get("season");
      const isSpec = fd.get("place") === "Skardu Valley" && fd.get("mode") === "road" && fd.get("start") === "Islamabad" && fd.get("grade") === "Deluxe" && fd.get("vehicle") === "Gli Car" && days.value === 5 && adults.value === 2 && +ch === 0 && !fd.has("guide") && !fd.has("meals");
      const out = $("#quote-result");
      if (isSpec) {
        const sub = 117000, profit = Math.round(sub * pct / 100), total = sub + profit;
        out.innerHTML = `<div class="card-head"><div><h3>Quote</h3><p>Skardu Valley · road from Islamabad · Deluxe · Gli Car · 5 days · 2 adults</p></div></div><div class="card-body">
          <dl class="sum"><dt>Subtotal</dt><dd>${rs(sub)}</dd><dt>Profit, ${pct} percent</dt><dd>${rs(profit)}</dd><dt class="sum-total">Total</dt><dd class="sum-total">${rs(total)}</dd><dt>Per adult</dt><dd>${rs(total / 2)}</dd></dl>
          <p class="help">This is the Skardu test quote from design section 5: 117,000 before profit, ${pct === 20 ? "140,400 at 20 percent" : "134,550 at 15 percent"}.</p></div>`;
      } else {
        out.innerHTML = `<div class="card-head"><div><h3>Quote</h3></div></div><div class="card-body">${alert("info", "Priced by the office server", "The real office prices every trip with the one quote function in <b>lib/quote.ts</b>. This prototype only prices the spec example: Skardu Valley, Road, Islamabad, Deluxe, Gli Car, 5 days, 2 adults.")}</div>`;
      }
      out.querySelector("h3").setAttribute("tabindex", "-1"); out.querySelector("h3").focus();
    },
  };

  /* ---------- Actions ---------- */
  const undoable = (arr, idx, item, label, back) => {
    arr.splice(idx, 1); save();
    if (location.hash !== back) location.hash = back; else render({ keepFocus: true });
    toast(`${label} removed.`, { undo: () => { arr.splice(idx, 0, item); save(); render({ keepFocus: true }); } });
  };
  const actions = {
    "toggle-side"() { S.sideCollapsed = !S.sideCollapsed; store.set("sideCollapsed", S.sideCollapsed); render({ keepFocus: true, keepScroll: true }); $("[data-action=toggle-side]")?.focus(); },
    "set-theme"(el) { S.theme = el.dataset.v; store.set("theme", S.theme); render({ keepFocus: true, keepScroll: true }); toast(`Appearance: ${el.textContent.trim()}.`, { tone: "info", body: "Saved for your login." }); },
    "set-density"(el) { S.density = el.dataset.v; store.set("density", S.density); render({ keepFocus: true, keepScroll: true }); toast(`Density: ${el.textContent.trim()}.`, { tone: "info" }); },
    "drawer-wide"() { S.drawerWide = !S.drawerWide; store.set("drawerWide", S.drawerWide); const d = $(".drawer"); d?.classList.toggle("is-wide", S.drawerWide); const b = $("[data-action=drawer-wide]"); if (b) { b.setAttribute("aria-pressed", String(S.drawerWide)); b.title = S.drawerWide ? "Narrow the panel" : "Widen the panel"; } },
    "jump-sec"(el) { const t = document.getElementById(el.dataset.target); if (t) { t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); t.querySelector("input,select,textarea")?.focus({ preventScroll: true }); } },
    "clear-filters"() { const m = $("#main"); $$("[data-filter], [data-filter-key]", m).forEach((x) => (x.value = "")); applyFilters(); $("[data-filter]", m)?.focus(); },
    shortcuts() {
      const row = (k, d) => `<tr><td>${k.split(" ").map((x) => `<kbd>${x}</kbd>`).join(" ")}</td><td>${d}</td></tr>`;
      dialog({ title: "Keyboard shortcuts", confirm: "Close", tone: "secondary", cancel: "Cancel", icon: "keyboard",
        body: `<table class="kbd-table"><tbody>${row("Ctrl K", "Search and jump anywhere")}${row("/", "Search this list")}${row("Ctrl S", "Save the open form")}${row("j k", "Next or previous record in a panel or the inbox")}${row("Esc", "Close a panel, menu, or dialog")}${row("g d", "Go to Dashboard")}${row("g r", "Go to Requests")}${row("g q", "Go to Rates and quotes")}${row("g t", "Go to Tours")}${row("g p", "Go to Places")}${row("g b", "Go to Blog")}${row("[", "Collapse or expand the sidebar")}${row("?", "Show this list")}</tbody></table><p class="help">On a Mac, use Cmd instead of Ctrl.</p>` });
    },
    "open-nav"() { document.body.classList.add("nav-open"); $("[data-action=open-nav]")?.setAttribute("aria-expanded", "true"); $("#side .nav-item")?.focus(); },
    "close-nav"() { document.body.classList.remove("nav-open"); $("[data-action=open-nav]")?.setAttribute("aria-expanded", "false"); },
    "close-drawer"(el) { go(el.dataset.href); },
    "toggle-pop"(el) {
      const pop = el.nextElementSibling, open = pop.hidden;
      closePops(); pop.hidden = !open; el.setAttribute("aria-expanded", String(open));
      if (open) $("a,button", pop)?.focus();
    },
    "sheet-nav"() {
      const items = O.navItems().slice(4);
      dialog({ title: "More", body: `<nav class="sheet-nav" aria-label="More pages">${items.map((i) => `<a class="sheet-item" href="#/${i.key}" data-sheet-link>${icon(i.ic)}${esc(i.label)}</a>`).join("")}</nav>`, confirm: "Close", tone: "secondary", cancel: "Cancel" });
      $$("[data-sheet-link]").forEach((a) => a.addEventListener("click", () => closeDialog(false)));
    },
    palette() { openPalette(); },
    "sign-out"() { S.signedIn = false; store.set("signedIn", false); location.hash = "#/login"; render(); toast("You are signed out."); },
    "reset-demo"() { dialog({ title: "Reset the demo?", body: "<p>All changes you made in this prototype are cleared and the sample data comes back.</p>", confirm: "Reset demo", tone: "danger", icon: "refresh", alertdialog: true, onConfirm: () => { store.clear(); location.hash = "#/dashboard"; location.reload(); } }); },
    "toggle-pw"(el) { const i = el.previousElementSibling, show = i.type === "password"; i.type = show ? "text" : "password"; el.setAttribute("aria-pressed", String(show)); el.querySelector("span").textContent = show ? "Hide" : "Show"; },
    discard() { const f = dirtyForm(); if (f) delete f.dataset.dirty; render({ keepFocus: true, keepScroll: true }); toast("Changes discarded.", { tone: "info" }); },
    "rep-add"(el) {
      const form = el.closest("form"), k = el.dataset.target, tpl = $(`template[data-tpl="${k}"]`, form), box = $(`[data-repeat="${k}"]`, form);
      const frag = tpl.content.cloneNode(true), stamp = Date.now().toString(36);
      $$("[id]", frag).forEach((n) => { const old = n.id, nw = `${old}-${stamp}`; n.id = nw; $$(`[for="${old}"]`, frag).forEach((l) => l.setAttribute("for", nw)); $$(`[aria-describedby~="${old}-help"]`, frag).forEach((x) => x.setAttribute("aria-describedby", `${nw}-help`)); const h = $(`#${old}-help`, frag); if (h) h.id = `${nw}-help`; });
      box.appendChild(frag); renumber(box); bumpStructural(form);
      box.lastElementChild.querySelector("input,textarea")?.focus();
    },
    "rep-remove"(el) { const item = el.closest(".rep-item"), box = item.parentElement, form = el.closest("form"); const label = item.querySelector("[data-rep-label]").textContent; item.remove(); renumber(box); bumpStructural(form); toast(`${label.trim()} removed.`, { tone: "info", body: "Discard brings it back. Save makes it final." }); (box.lastElementChild?.querySelector("input") || $(`[data-action=rep-add][data-target="${box.dataset.repeat}"]`, form))?.focus(); },
    "rep-up"(el) { const it = el.closest(".rep-item"); if (it.previousElementSibling) { it.parentElement.insertBefore(it, it.previousElementSibling); renumber(it.parentElement); bumpStructural(el.closest("form")); el.focus(); } },
    "rep-down"(el) { const it = el.closest(".rep-item"); if (it.nextElementSibling) { it.parentElement.insertBefore(it.nextElementSibling, it); renumber(it.parentElement); bumpStructural(el.closest("form")); el.focus(); } },
    "delete-tour"(el) {
      const t = D().tours.find((x) => x.code === el.dataset.id);
      dialog({ title: `Delete “${t.name}”?`, body: `<p>The tour page, its photo list, and its day plan will be removed from the website. Bookings already saved stay in Requests. This can't be undone.</p>`, confirm: "Delete tour", tone: "danger", icon: "trash", alertdialog: true,
        onConfirm: () => { D().tours = D().tours.filter((x) => x !== t); save(); const f = dirtyForm(); if (f) delete f.dataset.dirty; location.hash = "#/tours"; toast("Tour deleted.", { body: t.name }); } });
    },
    "delete-photo"(el) { const a = D().photos, i = a.findIndex((x) => String(x.id) === el.dataset.id); undoable(a, i, a[i], "Photo", "#/gallery"); },
    "delete-review"(el) { const a = D().reviews, i = a.findIndex((x) => String(x.id) === el.dataset.id); undoable(a, i, a[i], "Review", "#/reviews"); },
    "delete-slide"(el) { const a = D().slides, i = a.findIndex((x) => String(x.id) === el.dataset.id); undoable(a, i, a[i], "Slide", "#/slides"); },
    "delete-request"(el) { const a = D().requests, i = a.findIndex((x) => String(x.id) === el.dataset.id); undoable(a, i, a[i], "Request", "#/requests"); },
    "slide-up"(el) { moveSlide(el, -1); }, "slide-down"(el) { moveSlide(el, 1); },
    "create-user"() {
      dialog({ title: "Create a login", body: "<p>They sign in at /office/login with this email and password.</p>", confirm: "Create login", icon: "users",
        form: `<div class="dlg-fields">${field("Email", input("email", "", { type: "email", autocomplete: "off" }), { name: "email" })}${field("Password", input("password", "", { type: "password", autocomplete: "new-password" }), { name: "password", help: "8 or more characters." })}${field("Role", select("role", "editor", [["editor", "Editor: website content"], ["manager", "Manager: rates and requests"], ["owner", "Owner: everything"]]), { name: "role" })}</div>`,
        onConfirm: (fd) => {
          const e = {}, email = String(fd.get("email")).trim().toLowerCase();
          if (!isEmail(email)) e.email = "Enter an email address.";
          else if (D().users.some((u) => u.email === email)) e.email = "That email already has a login.";
          if (String(fd.get("password")).length < 8) e.password = "Use a password of at least 8 characters.";
          if (Object.keys(e).length) return { errors: e };
          D().users.push({ id: nextId(D().users), email, role: fd.get("role"), lastSeen: "" }); save(); render({ keepFocus: true }); toast("Login created.", { body: email });
        } });
    },
    "remove-user"(el) {
      const u = D().users.find((x) => String(x.id) === el.dataset.id);
      dialog({ title: `Remove the login for ${u.email}?`, body: "<p>They can no longer sign in. Changes they made stay on the website.</p>", confirm: "Remove login", tone: "danger", icon: "trash", alertdialog: true,
        onConfirm: () => { D().users = D().users.filter((x) => x !== u); save(); render({ keepFocus: true }); toast("Login removed.", { body: u.email }); } });
    },
    "backup-now"(el) {
      el.disabled = true; el.setAttribute("aria-busy", "true"); el.querySelector("span").textContent = "Backing up…";
      setTimeout(() => {
        const at = new Date().toISOString(), stamp = at.replace(/[:.]/g, "-");
        D().backups.unshift({ name: `backups/preview-${stamp}.json`, at, size: 1468006 + Math.round(Math.random() * 20000), manual: true }); save();
        render({ keepFocus: true }); toast("Backup made.", { body: "It is now first in the list." });
      }, 1200);
    },
    "download-backup"(el) { toast("Download started.", { body: `${el.dataset.name} (prototype: no file is sent)`, tone: "info" }); },
  };
  const renumber = (box) => $$(".rep-item", box).forEach((it, i) => { const l = $("[data-rep-label]", it); l.textContent = l.textContent.replace(/\s*\d*\s*$/, ` ${i + 1}`); });
  const moveSlide = (el, dir) => {
    const L = [...D().slides].sort((a, b) => a.order - b.order), i = L.findIndex((s) => String(s.id) === el.dataset.id), j = i + dir;
    if (j < 0 || j >= L.length) return;
    [L[i].order, L[j].order] = [L[j].order, L[i].order]; save(); render({ keepFocus: true, keepScroll: true });
    toast(`${L[i].title} moved to position ${j + 1}.`, { tone: "info" });
    const b = $(`[data-action="slide-${dir < 0 ? "up" : "down"}"][data-id="${el.dataset.id}"]`); (b && !b.disabled ? b : $(`[data-id="${el.dataset.id}"]`))?.focus();
  };
  const closePops = () => $$(".pop").forEach((p) => { if (!p.hidden) { p.hidden = true; p.previousElementSibling?.setAttribute("aria-expanded", "false"); } });

  /* ---------- Navigation guard for unsaved changes ---------- */
  const go = (href) => {
    const f = dirtyForm();
    if (!f) { location.hash = href; return; }
    dialog({ title: "Leave without saving?", body: "<p>Your changes on this page will be lost.</p>", confirm: "Leave page", cancel: "Stay", tone: "danger", icon: "alert", alertdialog: true, onConfirm: () => { delete f.dataset.dirty; location.hash = href; } });
  };

  /* ---------- Command palette ---------- */
  const openPalette = () => {
    const base = O.navItems().map((i) => ({ label: i.label, hint: "Page", href: `#/${i.key}`, ic: i.ic }));
    const more = [
      ...(can.rates() ? [{ label: "New quote", hint: "Action", href: "#/rates/quote", ic: "calc" }] : []),
      ...(can.content() ? [{ label: "Add a gallery photo", hint: "Action", href: "#/gallery/new", ic: "plus" }, { label: "Add a review", hint: "Action", href: "#/reviews/new", ic: "plus" }] : []),
      ...(can.users() ? [{ label: "Create a login", hint: "Action", href: "#/users?create=1", ic: "plus" }] : []),
      ...(can.content() ? D().tours.map((t) => ({ label: t.name, hint: `Tour ${t.code}`, href: `#/tours/${t.code}`, ic: "map" })) : []),
      ...(can.content() ? D().places.map((p) => ({ label: p.title, hint: "Place", href: `#/places/${p.slug}`, ic: "pin" })) : []),
      ...(can.content() ? D().posts.map((p) => ({ label: p.title, hint: "Blog post", href: `#/blog/${p.slug}`, ic: "file" })) : []),
      ...D().requests.map((r) => ({ label: r.name, hint: `Request · ${O.KIND[r.kind]}`, href: `#/requests/${r.id}`, ic: "inbox" })),
      { label: "Design system", hint: "Help", href: "#/system", ic: "palette" },
    ];
    const all = [...base, ...more];
    const prev = document.activeElement;
    const pr = $("#pal-root");
    pr.innerHTML = `<div class="pal-backdrop" data-pal-close><div class="pal" role="dialog" aria-modal="true" aria-label="Search and jump">
      <div class="pal-in">${icon("search")}<input id="pal-q" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-autocomplete="list" placeholder="Search pages, tours, places, requests…" autocomplete="off"><kbd>Esc</kbd></div>
      <ul id="pal-list" role="listbox" aria-label="Results"></ul></div></div>`;
    const q = $("#pal-q"), list = $("#pal-list");
    let sel = 0, res = [];
    const draw = () => {
      const t = q.value.trim().toLowerCase();
      const recent = S.recent.map((x) => ({ ...x, hint: "Recent" }));
      res = (t ? all.filter((x) => (x.label + " " + x.hint).toLowerCase().includes(t)) : recent.concat(more.filter((x) => x.hint === "Action"), base)).slice(0, 10);
      sel = Math.min(sel, Math.max(0, res.length - 1));
      list.innerHTML = res.length ? res.map((x, i) => `<li role="option" id="pal-o${i}" aria-selected="${i === sel}" data-i="${i}">${icon(x.ic)}<span>${esc(x.label)}</span><small>${esc(x.hint)}</small></li>`).join("") : `<li class="pal-empty">No matches</li>`;
      q.setAttribute("aria-activedescendant", res.length ? `pal-o${sel}` : "");
    };
    const close = () => { pr.innerHTML = ""; prev?.focus?.(); };
    const pick = (i) => { const x = res[i]; if (!x) return; pr.innerHTML = ""; go(x.href); };
    q.addEventListener("input", () => { sel = 0; draw(); });
    q.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, res.length); draw(); $(`#pal-o${sel}`)?.scrollIntoView({ block: "nearest" }); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + res.length) % Math.max(1, res.length); draw(); $(`#pal-o${sel}`)?.scrollIntoView({ block: "nearest" }); }
      else if (e.key === "Enter") { e.preventDefault(); pick(sel); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") e.preventDefault();
    });
    list.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) pick(+li.dataset.i); });
    pr.querySelector(".pal-backdrop").addEventListener("mousedown", (e) => { if (e.target.hasAttribute("data-pal-close")) close(); });
    draw(); q.focus();
  };

  /* ---------- Design-system page ---------- */
  const TOKENS = [
    ["Surfaces", ["canvas", "surface", "surface-2", "surface-hover", "selected"]],
    ["Text", ["text", "text-2", "text-3", "link"]],
    ["Lines", ["border", "border-strong", "focus"]],
    ["Brand", ["primary", "primary-hover", "on-primary", "primary-soft", "accent", "accent-soft"]],
    ["Status", ["success-soft", "success-text", "warning-soft", "warning-text", "danger", "danger-soft", "danger-text", "info-soft", "info-text"]],
    ["Navigation", ["nav-bg", "nav-text", "nav-active", "nav-active-text", "nav-indicator"]],
  ];
  const PAIRS = window.CONTRAST_PAIRS;
  const SYSTEM = () => {
    const comp = `
      <div class="ds-row">${btn("Save changes", { v: "primary" })}${btn("Cancel")}${btn("Add day", { v: "ghost", ic: "plus" })}${btn("Delete tour", { v: "danger" })}${btn("Remove", { v: "danger-outline", ic: "trash" })}${btn("Saving…", { v: "primary", a: { "aria-busy": "true", disabled: true } })}${btn("More", { iconOnly: true, ic: "more" })}</div>
      <div class="form-grid ds-fields">${field("Tour title", input("x1", "Naran Kaghan"), {})}${field("Grade", select("x2", "Deluxe", ["Deluxe", "Executive"]), {})}${field("Twin rate", O.money("x3", 9000), { help: "Per night, whole rupees." })}
        <div class="field"><label class="label" for="x4">Toll</label><div class="money"><span class="affix" aria-hidden="true">Rs</span><input class="input" id="x4" value="-500" aria-invalid="true" aria-describedby="x4-err"></div><p class="err" id="x4-err">${icon("errorCircle")}<span>Enter an amount that is not negative.</span></p></div></div>
      <div class="ds-row">${O.check("x5", true, "Featured on the home page")}${O.sw("x6", true, "Gli Car")}${O.sw("x7", false, "Prado")}</div>
      <div class="ds-row">${O.statusBadge("new")}${O.statusBadge("in_progress")}${O.statusBadge("closed")}${badge("Booking", "outline")}${badge("★ Featured", "accent")}${badge("Off", "danger", true)}${badge("Offered", "success", true)}</div>
      <div class="ds-stack">${alert("info", "Season profit is 20 percent", "Change it under Rates, Season.")}${alert("success", "Import finished", "412 rates loaded.")}${alert("warning", "Season is at 15 percent", "Guest quotes use the lower profit.")}${alert("danger", "2 fields need a fix", "Toll: enter an amount that is not negative.")}</div>
      <div class="toast t-success static" role="presentation">${icon("checkCircle")}<div><b>Tour saved.</b><p>The public tour page is updated.</p></div><span class="toast-actions"><button class="btn btn-ghost btn-sm">${icon("undo")}<span>Undo</span></button></span></div>`;
    return `${pageHead(`${V.name} design system`, { desc: esc(V.summary), actions: btn("Open the dashboard", { v: "primary", href: "#/dashboard" }) })}
      <div class="ds-grid">
        ${card("What makes it different", `<ul class="ds-list">${V.traits.map((t) => `<li>${t}</li>`).join("")}</ul><p class="help">Inspired by ${esc(V.inspiration)}.</p>`)}
        ${card("Principles", `<ol class="ds-list">${V.principles.map((p) => `<li><b>${esc(p[0])}.</b> ${esc(p[1])}</li>`).join("")}</ol>`)}
      </div>
      ${card("Color tokens", `<p class="help">Values for the theme you are viewing. Switch the theme in the bar at the top.</p>${TOKENS.map(([g, ks]) => `<h4 class="ds-h">${g}</h4><div class="swatches">${ks.map((k) => `<div class="swatch"><span class="sw-chip" style="background:var(--${k})"></span><code>--${k}</code><small data-hex="${k}"></small></div>`).join("")}</div>`).join("")}`)}
      ${card("Contrast audit", `<p class="help">Measured live with the WCAG 2.2 formula. Text needs 4.5:1, field outlines and focus rings need 3:1.</p><div class="tbl-wrap flat"><table class="tbl tbl-plain"><thead><tr><th scope="col">Pair</th><th scope="col">Sample</th><th scope="col" class="r">Ratio</th><th scope="col">Needs</th><th scope="col">Result</th></tr></thead><tbody id="ds-contrast"></tbody></table></div><p class="help" id="ds-contrast-sum"></p>`)}
      ${card("Typography", `<p class="help">${esc(V.fontNote)}</p>${V.type.map(([n, css, s]) => `<div class="type-row"><small class="type-meta">${esc(n)}</small><span style="${css}">${esc(s)}</span></div>`).join("")}`)}
      ${card("Shape, space, motion", `<div class="ds-row">${["r-s", "r-m", "r-l", "r-xl"].map((r) => `<div class="shape"><span style="border-radius:var(--${r})"></span><code>--${r}</code></div>`).join("")}${["shadow-1", "shadow-2", "shadow-3"].map((s) => `<div class="shape"><span style="box-shadow:var(--${s});border-color:transparent"></span><code>--${s}</code></div>`).join("")}</div><p class="help">${esc(V.shapeNote)}</p>`)}
      ${card("Components", comp)}
      ${card("Layout and patterns", `<div class="tbl-wrap flat"><table class="tbl tbl-plain"><tbody>${V.patterns.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</tbody></table></div>`)}
      ${card("Standards", `<ul class="ds-list"><li><b>WCAG 2.2 AA:</b> contrast checked above for every theme, 2 px focus ring (3 px in high contrast), 32 px smallest target, errors named in words with an error summary, status messages announced.</li><li><b>WAI-ARIA 1.2:</b> dialogs trap focus and close with Esc, tabs and switches use their roles, the palette is a combobox.</li><li><b>ISO 9241-110:</b> save bar shows state, deletes confirm or undo, forms keep what you typed.</li><li><b>Unicode CLDR:</b> Rs amounts, dates, and times in Asia/Karachi through Intl.</li></ul>`)}
      ${card("Tokens for the codebase", `<p class="help">Paste into <code>app/office/office-theme.css</code>, scoped under <code>.office</code>.</p><pre class="code" tabindex="0">${esc(window.TOKEN_CSS)}</pre>`)}`;
  };
  const hexOf = (k) => getComputedStyle(document.documentElement).getPropertyValue(`--${k}`).trim();
  const lum = (h) => { const m = h.replace("#", ""); const [r, g, b] = [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const fillSystem = () => {
    $$("[data-hex]").forEach((el) => (el.textContent = hexOf(el.dataset.hex)));
    let pass = 0;
    $("#ds-contrast").innerHTML = PAIRS.map(([n, f, b, need]) => {
      const r = ratio(hexOf(f), hexOf(b)), ok = r >= need; if (ok) pass++;
      const sample = need === 3 ? `<span class="pair" style="background:var(--${b});border:2px solid var(--${f})"></span>` : `<span class="pair" style="background:var(--${b});color:var(--${f})">Aa</span>`;
      return `<tr><td data-label="Pair">${esc(n)}<small class="cell-sub"><code>--${f}</code> on <code>--${b}</code></small></td><td data-label="Sample">${sample}</td><td data-label="Ratio" class="r num">${r.toFixed(2)}:1</td><td data-label="Needs">${need}:1</td><td data-label="Result">${ok ? `<span class="pass">${icon("check")}Pass</span>` : `<span class="fail">${icon("x")}Fail</span>`}</td></tr>`;
    }).join("");
    $("#ds-contrast-sum").textContent = `${pass} of ${PAIRS.length} pairs pass in this theme. The build checks Light, Dark, and High contrast before writing the file.`;
  };

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#/']");
    if (a && dirtyForm() && !a.closest("form[data-dirty]") && !a.hasAttribute("data-sheet-link")) { e.preventDefault(); go(a.getAttribute("href")); return; }
    if (a && a.closest(".drawer-head") && dirtyForm()) { e.preventDefault(); go(a.getAttribute("href")); return; }
    const j = e.target.closest("[data-jump]");
    if (j) { e.preventDefault(); document.getElementById(j.dataset.jump)?.focus(); return; }
    const act = e.target.closest("[data-action]");
    if (act && actions[act.dataset.action]) { e.preventDefault(); actions[act.dataset.action](act); return; }
    if (!e.target.closest(".pop-wrap")) closePops();
    if (a && document.body.classList.contains("nav-open")) actions["close-nav"]();
  });
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("[data-filter]")) { applyFilters(); return; }
    if (t.closest("#pal-root,#dlg-root")) return;
    const form = t.closest("form[data-track]"); if (form) markDirty(form);
    if (t.dataset.count) updateCount(t);
    if (t.dataset.bindSrc) $$(`[data-bind="${t.dataset.bindSrc}"]`).forEach((el) => (el.textContent = t.value || "—"));
    if (t.dataset.bindRot) { const v = parseInt(t.value, 10); if (!isNaN(v) && Math.abs(v) <= 30) $$("[data-rot]").forEach((el) => (el.style.transform = `rotate(${v}deg)`)); }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("[data-filter-key], [data-sort]")) return applyFilters();
    if (t.matches("[data-file]")) return checkFile(t);
    if (t.matches("[data-demo]")) {
      const k = t.dataset.demo; S[k] = t.value; store.set(k, t.value);
      if (k === "role" && !S.signedIn) return render();
      render({ keepFocus: true, keepScroll: true });
      $(`[data-demo="${k}"]`)?.focus();
      if (k === "role") toast(`Viewing as ${ROLE_NAME[t.value]}.`, { tone: "info", body: "The menu and buttons now follow that role." });
      return;
    }
    if (t.matches("[data-instant-status]")) {
      const r = D().requests.find((x) => String(x.id) === t.dataset.id), from = r.status;
      r.status = t.value; log(`Moved ${r.name} to ${O.STATUS[r.status][0]}`, `#/requests/${r.id}`); save();
      render({ keepFocus: true, keepScroll: true });
      $(`[data-instant-status][data-id="${r.id}"][value="${r.status}"]`)?.focus();
      toast(`${r.name}: ${O.STATUS[r.status][0]}.`, { undo: () => { r.status = from; save(); render({ keepFocus: true, keepScroll: true }); } });
      return;
    }
    if (t.matches("[data-action-change=change-role]")) {
      const u = D().users.find((x) => String(x.id) === t.dataset.id), to = t.value;
      dialog({ title: `Make ${u.email} ${to === "editor" ? "an" : "a"} ${ROLE_NAME[to]}?`, body: `<p>${{ owner: "Owners can do everything, including logins and backups.", manager: "Managers change rates, quotes, and request status. They can't edit website text.", editor: "Editors change website content. They can't open Rates." }[to]}</p>`, confirm: "Change role", icon: "users", alertdialog: true,
        onConfirm: () => { u.role = to; save(); render({ keepFocus: true }); toast("Role saved.", { body: `${u.email} is now ${ROLE_NAME[to] === "Owner" ? "an" : "a"} ${ROLE_NAME[to]}.` }); },
        onCancel: () => { t.value = u.role; t.focus(); } });
    }
  });
  document.addEventListener("focusout", (e) => { if (e.target.matches("[data-money]")) fmtMoney(e.target); });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("form[data-form]"); if (!f) return;
    e.preventDefault();
    const fn = SAVE[f.dataset.form]; if (fn) fn(new FormData(f), f);
  });
  let gPending = 0;
  const typing = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && S.signedIn) { e.preventDefault(); openPalette(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && S.signedIn) {
      const f = dirtyForm() || $(".drawer form[data-track]") || $("#main form[data-track]");
      e.preventDefault(); if (f && !$("#dlg-root").innerHTML) f.requestSubmit(); return;
    }
    if (S.signedIn && !e.ctrlKey && !e.metaKey && !e.altKey && !typing(e.target) && !$("#dlg-root").innerHTML && !$("#pal-root").innerHTML) {
      if (gPending && Date.now() - gPending < 1200) {
        gPending = 0;
        const to = { d: "dashboard", r: "requests", q: "rates", t: "tours", p: "places", b: "blog" }[e.key];
        if (to) { e.preventDefault(); go(`#/${to}`); return; }
      }
      if (e.key === "g") { gPending = Date.now(); return; }
      if (e.key === "?") { e.preventDefault(); actions.shortcuts(); return; }
      if (e.key === "/") { const f = $("#main [data-filter]"); if (f) { e.preventDefault(); f.focus(); } return; }
      if (e.key === "[" && $(".side-toggle")) { e.preventDefault(); actions["toggle-side"](); return; }
      if (e.key === "j" || e.key === "k") { const l = $(e.key === "j" ? "[data-next]" : "[data-prev]"); if (l) { e.preventDefault(); go(l.getAttribute("href")); } return; }
    }
    if (e.key !== "Escape") return;
    if ($("#dlg-root").innerHTML) { closeDialog(true); return; }
    if ($("#pal-root").innerHTML) return;
    if ($$(".pop").some((p) => !p.hidden)) { const open = $$(".pop").find((p) => !p.hidden); closePops(); open.previousElementSibling?.focus(); return; }
    if (document.body.classList.contains("nav-open")) { actions["close-nav"](); $("[data-action=open-nav]")?.focus(); return; }
    const scrim = $(".drawer-scrim"); if (scrim) go(scrim.dataset.href);
  });
  window.addEventListener("hashchange", () => render());
  window.addEventListener("beforeunload", (e) => { if (dirtyForm()) { e.preventDefault(); e.returnValue = ""; } });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if ($("#ds-contrast")) fillSystem(); });

  render();
})();

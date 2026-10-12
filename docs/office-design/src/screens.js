/* Shared prototype engine, part 2: shell and screens. */
(() => {
  const O = window.OFFICE;
  const { V, S, can, ROLE_NAME, ME, esc, icon, art, rs, num, dt, rel, btn, badge, KIND, statusBadge, field, input, textarea, select, money, check, sw, drop, alert, empty, pageHead, tabs, savebar } = O;
  const D = () => S.data;

  /* ---------- Navigation model ---------- */
  const NAV = [
    ["Overview", [["dashboard", "Dashboard", "home", () => true], ["requests", "Requests", "inbox", () => true]]],
    ["Sales", [["rates", "Rates and quotes", "tag", can.rates]]],
    ["Content", [["tours", "Tours", "map", can.content], ["places", "Places", "pin", can.content], ["blog", "Blog", "file", can.content], ["gallery", "Gallery", "image", can.content], ["reviews", "Reviews", "star", can.content], ["slides", "Home slides", "slides", can.content], ["site", "Site details", "sliders", can.content]]],
    ["Admin", [["users", "Users", "users", can.users], ["backups", "Backups", "database", can.backup]]],
  ];
  const navItems = () => NAV.flatMap(([g, items]) => items.filter((i) => i[3]()).map((i) => ({ group: g, key: i[0], label: i[1], ic: i[2] })));
  const newCount = () => D().requests.filter((r) => r.status === "new").length;
  const navLink = (it, cur, cls = "nav-item") => `<a class="${cls}" href="#/${it.key}" title="${esc(it.label)}" ${it.key === cur ? 'aria-current="page"' : ""}>${icon(it.ic)}<span class="nav-label">${esc(it.label)}</span>${it.key === "requests" && newCount() ? `<span class="count" aria-label="${newCount()} new">${newCount()}</span>` : ""}</a>`;
  const initials = () => ({ owner: "MO", manager: "MA", editor: "ED" }[S.role]);

  const demoBar = () => `
    <div class="demo" role="region" aria-label="Prototype controls">
      <span class="demo-name"><b>${esc(V.name)}</b> <span class="demo-tag">${esc(V.tagline)}</span></span>
      <label class="demo-ctl">View as <select data-demo="role">${["owner", "manager", "editor"].map((r) => `<option value="${r}" ${S.role === r ? "selected" : ""}>${ROLE_NAME[r]}</option>`).join("")}</select></label>
      <label class="demo-ctl">Theme <select data-demo="theme">${[["system", "System"], ["light", "Light"], ["dark", "Dark"], ["hc", "High contrast"]].map(([v, l]) => `<option value="${v}" ${S.theme === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
      <span class="demo-tag">Demo controls</span>
      <a class="demo-link" href="#/system">${icon("palette")}Design system</a>
      <button class="demo-link" data-action="reset-demo">${icon("refresh")}Reset demo</button>
      <span class="demo-others">${V.others.map(([n, f]) => `<a href="${f}">${esc(n)}</a>`).join("")}</span>
    </div>`;

  const THEMES = [["system", "System"], ["light", "Light"], ["dark", "Dark"], ["hc", "High contrast"]];
  const newMenu = () => {
    const items = [
      ...(can.rates() ? [["#/rates/quote", "calc", "New quote"]] : []),
      ...(can.content() ? [["#/gallery/new", "image", "Gallery photo"], ["#/reviews/new", "star", "Review"], ["#/slides/new", "slides", "Home slide"]] : []),
      ...(can.users() ? [["#/users?create=1", "users", "Office login"]] : []),
    ];
    if (!items.length) return "";
    return `<div class="pop-wrap"><button class="btn btn-primary btn-sm" data-action="toggle-pop" aria-expanded="false" aria-haspopup="true">${icon("plus")}<span>New</span></button>
      <div class="pop pop-right" hidden>${items.map(([h, ic, l]) => `<a class="pop-item" href="${h}">${icon(ic)}${esc(l)}</a>`).join("")}</div></div>`;
  };
  const accountMenu = () => `
    <div class="pop-wrap me-wrap">
      <button class="me" data-action="toggle-pop" aria-expanded="false" aria-haspopup="true" title="${ME[S.role]}">
        <span class="avatar" aria-hidden="true">${initials()}</span><span class="me-text"><b>${ME[S.role]}</b><small>${ROLE_NAME[S.role]}</small></span>${icon("chevU", "me-chev")}
      </button>
      <div class="pop pop-up" hidden>
        <div class="pop-head"><b>${ME[S.role]}</b><small>Signed in as ${ROLE_NAME[S.role]}</small></div>
        <div class="pop-group" role="group" aria-labelledby="appear-l"><span class="pop-label" id="appear-l">${icon("sun")}Appearance</span>
          <div class="seg-mini">${THEMES.map(([v, l]) => `<button class="seg-btn" data-action="set-theme" data-v="${v}" aria-pressed="${S.theme === v}">${l}</button>`).join("")}</div></div>
        <div class="pop-group" role="group" aria-labelledby="dens-l"><span class="pop-label" id="dens-l">${icon("grid")}Density</span>
          <div class="seg-mini">${[["comfortable", "Comfortable"], ["compact", "Compact"]].map(([v, l]) => `<button class="seg-btn" data-action="set-density" data-v="${v}" aria-pressed="${S.density === v}">${l}</button>`).join("")}</div></div>
        <button class="pop-item" data-action="shortcuts">${icon("keyboard")}Keyboard shortcuts<kbd>?</kbd></button>
        <a class="pop-item" href="#/system">${icon("help")}Office guide and design</a>
        <button class="pop-item" data-action="sign-out">${icon("logout")}Sign out</button>
      </div>
    </div>`;

  const sideShell = (cur, page) => `
    <a class="skip" href="#main">Skip to content</a>
    ${demoBar()}
    <div class="app shell-side ${S.sideCollapsed ? "is-collapsed" : ""}">
      <aside class="side" id="side" aria-label="Office">
        <div class="brand"><span class="logo" aria-hidden="true">TM</span><span class="brand-text"><b>Travel With Moeen</b><small>Office</small></span>
          <button class="btn btn-ghost btn-icon btn-sm side-toggle" data-action="toggle-side" aria-pressed="${S.sideCollapsed}" title="Collapse sidebar ( [ )">${icon("sidebar")}<span class="sr-only">Collapse sidebar</span></button>
          <button class="btn btn-ghost btn-icon only-mobile side-close" data-action="close-nav">${icon("x")}<span class="sr-only">Close menu</span></button></div>
        <nav class="nav" aria-label="Main">${NAV.map(([g, items]) => { const vis = items.filter((i) => i[3]()); return vis.length ? `<div class="nav-sec">${g}</div>` + vis.map((i) => navLink({ key: i[0], label: i[1], ic: i[2] }, cur)).join("") : ""; }).join("")}</nav>
        ${accountMenu()}
      </aside>
      <div class="side-scrim" data-action="close-nav"></div>
      <div class="body">
        <header class="topbar">
          <button class="btn btn-ghost btn-icon only-mobile" data-action="open-nav" aria-controls="side" aria-expanded="false">${icon("menu")}<span class="sr-only">Open menu</span></button>
          ${V.palette ? `<button class="cmd" data-action="palette">${icon("search")}<span>Search or jump to…</span><kbd>Ctrl K</kbd></button>` : `<span class="topbar-title">${esc(navItems().find((i) => i.key === cur)?.label || "")}</span>`}
          <span class="spacer"></span>
          ${newMenu()}
          <button class="btn btn-ghost btn-icon btn-sm" data-action="shortcuts" title="Keyboard shortcuts ( ? )">${icon("keyboard")}<span class="sr-only">Keyboard shortcuts</span></button>
          <a class="btn btn-ghost btn-icon btn-sm" href="#/system" title="Office guide and design">${icon("help")}<span class="sr-only">Office guide and design</span></a>
        </header>
        <main id="main" class="main" tabindex="-1">${page}</main>
      </div>
    </div>`;

  const topShell = (cur, page) => {
    const items = navItems();
    const top = items.slice(0, 6), more = items.slice(6);
    const bottom = items.slice(0, 4), bMore = items.slice(4);
    const moreHas = more.some((i) => i.key === cur);
    return `
    <a class="skip" href="#main">Skip to content</a>
    ${demoBar()}
    <div class="app shell-top">
      <header class="appbar">
        <a class="brand" href="#/dashboard"><span class="logo" aria-hidden="true">TM</span><span class="brand-text"><b>Travel With Moeen</b><small>Office</small></span></a>
        <nav class="topnav" aria-label="Main">${top.map((i) => navLink(i, cur, "topnav-item")).join("")}
          ${more.length ? `<div class="pop-wrap"><button class="topnav-item" data-action="toggle-pop" aria-expanded="false" aria-haspopup="true" ${moreHas ? 'aria-current="page"' : ""}>${icon("grid")}<span class="nav-label">More</span>${icon("chevD")}</button>
            <div class="pop" hidden>${more.map((i) => navLink(i, cur, "pop-item")).join("")}</div></div>` : ""}
        </nav>
        <span class="spacer"></span>
        <button class="btn btn-ghost btn-icon appbar-btn" data-action="palette">${icon("search")}<span class="sr-only">Search</span></button>
        <div class="pop-wrap"><button class="avatar-btn" data-action="toggle-pop" aria-expanded="false" aria-haspopup="true"><span class="avatar" aria-hidden="true">${initials()}</span><span class="sr-only">Account</span></button>
          <div class="pop pop-right" hidden><div class="pop-head"><b>${ME[S.role]}</b><small>${ROLE_NAME[S.role]}</small></div><a class="pop-item" href="#/system">${icon("help")}Office guide and design</a><button class="pop-item" data-action="sign-out">${icon("logout")}Sign out</button></div></div>
      </header>
      <main id="main" class="main" tabindex="-1">${page}</main>
      <nav class="bottomnav" aria-label="Main, mobile">${bottom.map((i) => navLink(i, cur, "bn-item")).join("")}
        ${bMore.length ? `<button class="bn-item" data-action="sheet-nav" ${bMore.some((i) => i.key === cur) ? 'aria-current="page"' : ""}>${icon("grid")}<span class="nav-label">More</span></button>` : ""}</nav>
    </div>`;
  };

  const shell = (cur, page) => (V.shell === "top" ? topShell(cur, page) : sideShell(cur, page));

  /* ---------- Generic list view ---------- */
  const listView = (items, spec) => {
    if (!items.length) return empty(spec.emptyIc || "inbox", spec.emptyTitle || "Nothing here yet", spec.emptyBody || "");
    const search = (i) => esc((spec.search ? spec.search(i) : spec.title(i)).toLowerCase());
    if (V.list === "table") {
      return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${spec.cols.map(([l, , c]) => `<th scope="col" class="${c || ""}">${esc(l)}</th>`).join("")}</tr></thead><tbody>
        ${items.map((i) => `<tr data-search="${search(i)}" ${spec.filterAttrs ? spec.filterAttrs(i) : ""} ${spec.sortAttrs ? spec.sortAttrs(i) : ""}>${spec.cols.map(([l, fn, c], n) => `<td class="${c || ""}" data-label="${esc(l)}">${n === 0 ? `<a class="cell-link" href="${spec.href(i)}">${fn(i)}</a>` : fn(i)}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div>`;
    }
    if (V.list === "rows") {
      return `<ul class="rowlist" role="list">${items.map((i) => `<li data-search="${search(i)}" ${spec.filterAttrs ? spec.filterAttrs(i) : ""} ${spec.sortAttrs ? spec.sortAttrs(i) : ""}><a class="row" href="${spec.href(i)}" ${spec.current === spec.key(i) ? 'aria-current="true"' : ""}>
        ${spec.thumb ? `<span class="row-thumb" style="${art(spec.thumb(i))}" aria-hidden="true"></span>` : ""}
        <span class="row-main"><b>${esc(spec.title(i))}</b><small>${spec.sub(i)}</small></span>
        <span class="row-meta">${spec.meta ? spec.meta(i) : ""}</span>${icon("chevR", "row-chev")}</a></li>`).join("")}</ul>`;
    }
    return `<ul class="cardgrid" role="list">${items.map((i) => `<li data-search="${search(i)}" ${spec.filterAttrs ? spec.filterAttrs(i) : ""} ${spec.sortAttrs ? spec.sortAttrs(i) : ""}><a class="tile" href="${spec.href(i)}">
      ${spec.thumb ? `<span class="tile-img" style="${art(spec.thumb(i))}" aria-hidden="true">${spec.tileBadge ? spec.tileBadge(i) : ""}</span>` : ""}
      <span class="tile-body"><b class="tile-title">${esc(spec.title(i))}</b><small>${spec.sub(i)}</small><span class="tile-meta">${spec.meta ? spec.meta(i) : ""}</span></span></a></li>`).join("")}</ul>`;
  };
  const toolbar = (placeholder, extra = "", { sorts = null, noun = "" } = {}) => `<div class="toolbar"><div class="search-box">${icon("search")}<input class="input" type="search" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}" data-filter><kbd class="kbd-hint" aria-hidden="true">/</kbd></div>${extra}
    ${sorts ? `<label class="sort-l"><span class="sr-only">Sort by</span>${icon("arrowDown")}<select class="select select-sm" data-sort>${sorts.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join("")}</select></label>` : ""}
    <span class="filter-count" aria-live="polite" data-filter-count data-noun="${esc(noun)}"></span></div>`;
  const filterSelect = (key, label, opts) => `<label class="sr-only" for="fs-${key}">${esc(label)}</label><select class="select select-sm" id="fs-${key}" data-filter-key="${key}">${opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join("")}</select>`;

  /* ---------- Editor container: page, drawer, or page with live preview ---------- */
  const editorFrame = ({ title, crumb, listHtml, listHead, form, preview = "", danger = "", badgeHtml = "", desc = "", back, nav = null, site = "", meta = "", sections = null }) => {
    if (V.edit === "drawer") {
      const pos = nav ? `<span class="drawer-pos">${nav.index + 1} of ${nav.total}</span>${nav.prev ? btn("Previous", { v: "ghost", size: "sm", iconOnly: true, ic: "chevU", href: nav.prev, a: { "data-prev": true, title: "Previous ( k )" } }) : btn("Previous", { v: "ghost", size: "sm", iconOnly: true, ic: "chevU", a: { disabled: true } })}${nav.next ? btn("Next", { v: "ghost", size: "sm", iconOnly: true, ic: "chevD", href: nav.next, a: { "data-next": true, title: "Next ( j )" } }) : btn("Next", { v: "ghost", size: "sm", iconOnly: true, ic: "chevD", a: { disabled: true } })}<span class="drawer-sep" aria-hidden="true"></span>` : "";
      return `${listHead}${listHtml}
        <div class="drawer-scrim" data-href="${back}" data-action="close-drawer"></div>
        <aside class="drawer ${S.drawerWide ? "is-wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <div class="drawer-bar">${pos}${site ? `<a class="btn btn-ghost btn-sm" href="${esc(site)}" target="_blank" rel="noopener noreferrer">${icon("external")}<span>View on site</span><span class="sr-only"> (opens in a new tab)</span></a>` : ""}<span class="spacer"></span>
            ${btn(S.drawerWide ? "Narrow" : "Expand", { v: "ghost", size: "sm", iconOnly: true, ic: "sidebar", a: { "data-action": "drawer-wide", "aria-pressed": !!S.drawerWide, title: S.drawerWide ? "Narrow the panel" : "Widen the panel" } })}${btn("Close", { iconOnly: true, ic: "x", v: "ghost", size: "sm", href: back, a: { title: "Close ( Esc )" } })}</div>
          <div class="drawer-head"><div><h2 id="drawer-title" tabindex="-1">${esc(title)}${badgeHtml ? " " + badgeHtml : ""}</h2>${desc ? `<p class="desc">${desc}</p>` : ""}${meta ? `<p class="meta">${meta}</p>` : ""}</div></div>
          ${sections ? `<nav class="drawer-sections" aria-label="Sections">${sections.map(([id, l]) => `<button class="chip" data-action="jump-sec" data-target="${id}">${esc(l)}</button>`).join("")}</nav>` : ""}
          <div class="drawer-body">${form}${danger}</div>
        </aside>`;
    }
    if (V.edit === "preview") {
      return `${pageHead(title, { crumb, badgeHtml, desc })}<div class="edit-split"><div class="edit-main">${form}${danger}</div><aside class="preview" aria-label="Preview on the website"><p class="preview-label">${icon("eye")}Preview on the website</p>${preview}</aside></div>`;
    }
    return `${pageHead(title, { crumb, badgeHtml, desc })}${form}${danger}`;
  };
  const slug = (t) => "sec-" + String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const neighbors = (items, i, href) => ({ index: i, total: items.length, prev: i > 0 ? href(items[i - 1]) : "", next: i < items.length - 1 ? href(items[i + 1]) : "" });
  const savedMeta = (x) => (x && x.updatedAt ? `${icon("clock")}Last saved ${rel(x.updatedAt).toLowerCase()} by ${esc(x.updatedBy)}` : "");
  const card = (title, body, desc = "", extraCls = "") => `<section class="card ${extraCls}" id="${slug(title)}"><div class="card-head"><div><h3>${esc(title)}</h3>${desc ? `<p>${esc(desc)}</p>` : ""}</div></div><div class="card-body">${body}</div></section>`;
  const dangerCard = (title, body, action) => `<section class="card card-danger"><div class="card-head"><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div>${action}</div></section>`;

  const lines = (a) => (a || []).join("\n");
  const repeat = (kind, items, render, addLabel) => `
    <div class="repeat" data-repeat="${kind}">${items.map((it, i) => render(it, i)).join("")}</div>
    <template data-tpl="${kind}">${render({}, "__N__")}</template>
    ${btn(addLabel, { v: "ghost", ic: "plus", a: { "data-action": "rep-add", "data-target": kind } })}`;
  const repItem = (label, i, body) => `<fieldset class="rep-item"><legend class="rep-head"><span data-rep-label>${esc(label)} ${i === "__N__" ? "" : i + 1}</span></legend>
    <div class="rep-tools">${btn("Move up", { v: "ghost", size: "sm", iconOnly: true, ic: "arrowUp", a: { "data-action": "rep-up" } })}${btn("Move down", { v: "ghost", size: "sm", iconOnly: true, ic: "arrowDown", a: { "data-action": "rep-down" } })}${btn("Remove", { v: "ghost", size: "sm", ic: "trash", a: { "data-action": "rep-remove" } })}</div>${body}</fieldset>`;

  /* ---------- Screens ---------- */
  const SCREENS = {};

  const NOW = Date.parse("2026-10-09T09:30:00+05:00");
  const hoursAgo = (iso) => (NOW - Date.parse(iso)) / 36e5;
  SCREENS.dashboard = () => {
    const d = D(), R = d.requests, nw = R.filter((r) => r.status === "new"), prog = R.filter((r) => r.status === "in_progress");
    const stat = (ic, label, value, meta, href) => `<a class="stat" href="${href}"><span class="stat-k">${icon(ic)}${esc(label)}</span><span class="stat-v">${value}</span><span class="stat-m">${esc(meta)}</span></a>`;
    const latest = [...R].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5);
    const todo = [];
    const oldNew = nw.filter((r) => hoursAgo(r.at) > 24).length;
    if (oldNew) todo.push(["warning", "inbox", `${oldNew} new ${oldNew === 1 ? "request has" : "requests have"} waited more than a day`, "#/requests?status=new", "Reply"]);
    const stale = prog.filter((r) => hoursAgo(r.at) > 72).length;
    if (stale) todo.push(["info", "clock", `${stale} ${stale === 1 ? "request has" : "requests have"} been in progress for more than 3 days`, "#/requests?status=in_progress", "Review"]);
    if (can.rates()) {
      const off = d.hotels.filter((h) => !h.offered).length, voff = d.vehicles.filter((v) => !v.live).length, joff = d.jeeps.filter((j) => !j.live).length;
      if (off) todo.push(["info", "tag", `${off} hotel ${off === 1 ? "rate is" : "rates are"} not offered to guests`, "#/rates/hotels", "Check"]);
      if (voff) todo.push(["info", "tag", `${voff} ${voff === 1 ? "vehicle is" : "vehicles are"} switched off`, "#/rates/vehicles", "Check"]);
      if (joff) todo.push(["info", "tag", `${joff} jeep ${joff === 1 ? "line is" : "lines are"} switched off`, "#/rates/jeeps", "Check"]);
    }
    if (can.content()) {
      const f = d.tours.filter((t) => t.featured).length;
      if (f < 3) todo.push(["warning", "star", `Only ${f} ${f === 1 ? "tour is" : "tours are"} featured on the home page`, "#/tours", "Choose"]);
      const noAlt = d.photos.filter((p) => !p.alt.trim()).length;
      if (noAlt) todo.push(["warning", "image", `${noAlt} gallery ${noAlt === 1 ? "photo has" : "photos have"} no description`, "#/gallery", "Fix"]);
    }
    if (can.backup()) {
      const age = hoursAgo(d.backups[0].at);
      todo.push(age > 26 ? ["warning", "database", "The last backup is more than a day old", "#/backups", "Back up"] : ["success", "database", `Backup made ${rel(d.backups[0].at).toLowerCase()}`, "#/backups", "View"]);
    }
    const act = (d.activity || []).slice(0, 6);
    const greet = "Good morning";
    return `${pageHead(greet, { desc: `${dt("2026-10-09T09:30:00+05:00", { dateStyle: "full" })} · signed in as ${ROLE_NAME[S.role]}` })}
      <div class="stats">
        ${stat("inbox", "New requests", nw.length, nw.length ? `Oldest ${rel(nw[nw.length - 1].at).toLowerCase()}` : "All caught up", "#/requests?status=new")}
        ${stat("clock", "In progress", prog.length, "Waiting on you or the guest", "#/requests?status=in_progress")}
        ${can.rates() ? stat("tag", "Season profit", `${d.season}%`, "Used for guest quotes", "#/rates/season") : stat("map", "Tours live", d.tours.length, `${d.tours.filter((t) => t.featured).length} featured`, "#/tours")}
        ${can.backup() ? stat("database", "Last backup", dt(d.backups[0].at, { timeStyle: "short" }), dt(d.backups[0].at, { dateStyle: "medium" }), "#/backups") : stat("checkCircle", "Closed", R.filter((r) => r.status === "closed").length, "Requests done", "#/requests?status=closed")}
      </div>
      <div class="dash-grid">
        <section class="card"><div class="card-head"><div><h3>Latest requests</h3><p>Newest first</p></div>${btn("Open inbox", { v: "ghost", size: "sm", href: "#/requests" })}</div>
          <ul class="mini-list" role="list">${latest.map((r) => `<li><a href="#/requests/${r.id}"><span class="avatar sm" aria-hidden="true">${esc(r.name.slice(0, 1))}</span><span class="mini-main"><b>${esc(r.name)}</b><small>${esc(r.message.slice(0, 70))}${r.message.length > 70 ? "…" : ""}</small></span><span class="mini-meta"><small class="muted" title="${dt(r.at)}">${rel(r.at)}</small>${statusBadge(r.status)}</span></a></li>`).join("")}</ul></section>
        <section class="card"><div class="card-head"><div><h3>Needs attention</h3><p>${todo.filter((t) => t[0] !== "success").length ? "Things to look at today" : "Nothing waiting"}</p></div></div>
          <ul class="todo" role="list">${todo.length ? todo.map(([tone, ic, text, href, cta]) => `<li class="todo-${tone}"><span class="todo-ic">${icon(tone === "success" ? "checkCircle" : ic)}</span><span class="todo-t">${esc(text)}</span><a class="btn btn-ghost btn-sm" href="${href}">${esc(cta)}<span class="sr-only">: ${esc(text)}</span></a></li>`).join("") : `<li class="todo-success"><span class="todo-ic">${icon("checkCircle")}</span><span class="todo-t">All clear</span></li>`}</ul></section>
      </div>
      <div class="dash-grid">
        <section class="card"><div class="card-head"><div><h3>Recent activity</h3><p>Changes made in the office</p></div></div>
          <ol class="feed" role="list">${act.map((a) => `<li><span class="avatar sm" aria-hidden="true">${esc(a.who.slice(0, 2).toUpperCase())}</span><span class="feed-main"><a href="${a.href}">${esc(a.text)}</a><small>${esc(a.who)} · <time datetime="${a.at}" title="${dt(a.at)}">${rel(a.at)}</time></small></span></li>`).join("")}</ol></section>
        <section class="card"><div class="card-head"><div><h3>Quick actions</h3></div></div><div class="card-body quick">
          ${can.rates() ? btn("New quote", { ic: "calc", href: "#/rates/quote" }) + btn("Edit hotel rates", { ic: "tag", href: "#/rates/hotels" }) : ""}
          ${can.content() ? btn("Edit a tour", { ic: "map", href: "#/tours" }) + btn("Add a gallery photo", { ic: "image", href: "#/gallery/new" }) : ""}
          ${can.users() ? btn("Create a login", { ic: "users", href: "#/users?create=1" }) : ""}
          ${btn("Keyboard shortcuts", { ic: "keyboard", a: { "data-action": "shortcuts" } })}
        </div></section>
      </div>`;
  };

  /* Requests: table + page, inbox split, or board */
  const reqFilter = (q) => {
    let rows = [...D().requests].sort((a, b) => b.at.localeCompare(a.at));
    if (q.status) rows = rows.filter((r) => r.status === q.status);
    return rows;
  };
  const reqTabs = (q, extra = "") => {
    const R = D().requests, c = (s) => R.filter((r) => r.status === s).length;
    return `<div class="tabs" role="tablist">${[["", "All", R.length], ["new", "New", c("new")], ["in_progress", "In progress", c("in_progress")], ["closed", "Closed", c("closed")]].map(([k, l, n]) => `<a class="tab" role="tab" href="#/requests${k ? "?status=" + k : ""}${extra}" aria-selected="${(q.status || "") === k}">${l} <span class="tab-n">${n}</span></a>`).join("")}</div>`;
  };
  const wa = (phone) => { const d = String(phone || "").replace(/\D/g, ""); return d ? `https://wa.me/${d.startsWith("0") ? "92" + d.slice(1) : d}` : ""; };
  const reqDetail = (r, compact = false, nav = null) => `
    <div class="req-detail">
      ${compact ? `<div class="req-head"><div><h2 tabindex="-1" id="req-title">${esc(r.name)}</h2><p class="desc">${KIND[r.kind]} · <time datetime="${r.at}" title="${dt(r.at, { dateStyle: "full", timeStyle: "short" })}">${dt(r.at)}</time></p></div>
        <div class="req-nav">${nav ? `<span class="drawer-pos">${nav.index + 1} of ${nav.total}</span>${nav.prev ? btn("Previous request", { v: "ghost", size: "sm", iconOnly: true, ic: "chevU", href: nav.prev, a: { "data-prev": true, title: "Previous ( k )" } }) : ""}${nav.next ? btn("Next request", { v: "ghost", size: "sm", iconOnly: true, ic: "chevD", href: nav.next, a: { "data-next": true, title: "Next ( j )" } }) : ""}` : ""}</div></div>` : ""}
      <div class="contact-actions">
        ${r.phone ? `<a class="btn btn-secondary btn-sm" href="tel:${esc(r.phone.replace(/\s/g, ""))}">${icon("phone")}<span>Call</span></a><a class="btn btn-secondary btn-sm" href="${esc(wa(r.phone))}?text=${encodeURIComponent(`Assalam o Alaikum ${r.name.split(" ")[0]}, this is Travel With Moeen about your ${KIND[r.kind].toLowerCase()} request.`)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")}<span>WhatsApp</span><span class="sr-only"> (opens in a new tab)</span></a>` : ""}
        ${r.email ? `<a class="btn btn-secondary btn-sm" href="mailto:${esc(r.email)}?subject=${encodeURIComponent("Your request to Travel With Moeen")}">${icon("mail")}<span>Email</span></a>` : ""}
      </div>
      <dl class="dl">${r.phone ? `<dt>Phone</dt><dd>${esc(r.phone)}</dd>` : ""}${r.email ? `<dt>Email</dt><dd>${esc(r.email)}</dd>` : ""}${r.tour ? `<dt>Tour</dt><dd>${esc(r.tour)}</dd>` : ""}<dt>Received</dt><dd>${dt(r.at, { dateStyle: "full", timeStyle: "short" })}</dd></dl>
      <div class="message"><span class="message-k">Message</span>${esc(r.message)}</div>
      ${can.requestStatus() ? `<div class="status-row">
          <fieldset class="seg-status"><legend class="label">Status</legend><div class="seg-track">${[["new", "New"], ["in_progress", "In progress"], ["closed", "Closed"]].map(([v, l]) => `<label class="seg-opt"><input type="radio" name="req-status-${r.id}" value="${v}" ${r.status === v ? "checked" : ""} data-instant-status data-id="${r.id}"><span>${l}</span></label>`).join("")}</div></fieldset>
          ${can.requestDelete() ? btn("Delete request", { v: "danger-outline", size: "sm", ic: "trash", a: { "data-action": "delete-request", "data-id": r.id } }) : ""}
        </div><p class="help">Status saves as soon as you choose it. You can undo for 10 seconds.</p>` : alert("info", "Read only", "Editors can read requests. The Owner or a Manager changes the status.")}
    </div>`;
  SCREENS.requests = (id, q) => {
    const rows = reqFilter(q);
    const r = id ? D().requests.find((x) => String(x.id) === id) : null;
    const head = pageHead("Requests", { desc: "Messages, custom trips, and bookings from the website." });
    const kindOpts = [["", "All kinds"], ["booking", "Booking"], ["custom", "Custom trip"], ["contact", "Contact"]];
    const tb = toolbar("Search name, phone, or email", filterSelect("kind", "Kind", kindOpts), { noun: "requests", sorts: [["at:desc", "Newest first"], ["at:asc", "Oldest first"]] });
    const search = (x) => `${x.name} ${x.phone || ""} ${x.email || ""} ${x.message}`.toLowerCase();
    if (id && !r) return head + empty("inbox", "Request not found", "It may have been deleted.", btn("Back to requests", { href: "#/requests" }));

    if (V.requests === "inbox") {
      const list = rows.length ? `<ul class="rowlist inbox-list" role="list">${rows.map((x) => `<li data-search="${esc(search(x))}" data-f-kind="${x.kind}" data-s-at="${x.at}"><a class="row" href="#/requests/${x.id}${q.status ? "?status=" + q.status : ""}" ${r && r.id === x.id ? 'aria-current="true"' : ""}>
          <span class="avatar sm" aria-hidden="true">${esc(x.name.slice(0, 1))}</span><span class="row-main"><b>${esc(x.name)}${x.status === "new" ? ' <span class="unread" aria-label="New"></span>' : ""}</b><small>${esc(x.message.slice(0, 70))}</small></span>
          <span class="row-meta"><small title="${dt(x.at)}">${rel(x.at)}</small>${statusBadge(x.status)}</span></a></li>`).join("")}</ul>` : empty("inbox", "No requests here", "Try another status.");
      return `${head}${reqTabs(q)}<div class="inbox ${r ? "has-detail" : ""}"><div class="inbox-list-wrap">${tb}${list}</div>
        <section class="inbox-detail card" aria-label="Request detail">${r ? `<a class="btn btn-ghost btn-sm only-mobile" href="#/requests${q.status ? "?status=" + q.status : ""}">${icon("chevL")}<span>All requests</span></a>${reqDetail(r, true, rows.indexOf(r) >= 0 ? neighbors(rows, rows.indexOf(r), (x) => `#/requests/${x.id}${q.status ? "?status=" + q.status : ""}`) : null)}` : empty("inbox", "Choose a request", "Its message, contact details, and status appear here.")}</section></div>`;
    }
    if (V.requests === "board") {
      const col = (s, label) => { const items = D().requests.filter((x) => x.status === s).sort((a, b) => b.at.localeCompare(a.at)); return `<section class="board-col" aria-label="${label}"><h2 class="board-h">${statusBadge(s)}<span class="tab-n">${items.length}</span></h2>
        <ul role="list">${items.map((x) => `<li data-search="${esc(search(x))}" data-f-kind="${x.kind}"><a class="board-card" href="#/requests/${x.id}"><span class="bc-top"><b>${esc(x.name)}</b>${O.badge(KIND[x.kind], "outline")}</span><small>${esc(x.message.slice(0, 90))}</small><span class="bc-foot">${icon("clock")}${rel(x.at)}</span></a></li>`).join("") || `<li class="board-empty">Nothing here</li>`}</ul></section>`; };
      return `${head}${tb}<div class="board">${col("new", "New")}${col("in_progress", "In progress")}${col("closed", "Closed")}</div>
        ${r ? `<div class="drawer-scrim" data-href="#/requests" data-action="close-drawer"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="req-title"><div class="drawer-head"><span></span>${btn("Close", { iconOnly: true, ic: "x", v: "ghost", href: "#/requests" })}</div><div class="drawer-body">${reqDetail(r, true)}</div></aside>` : ""}`;
    }
    if (r) return `${pageHead(r.name, { crumb: [["Requests", "#/requests"], [r.name]], badgeHtml: statusBadge(r.status), desc: `${KIND[r.kind]} · ${dt(r.at)}` })}<div class="detail-grid"><section class="card"><div class="card-body">${reqDetail(r)}</div></section></div>`;
    return `${head}${reqTabs(q)}${tb}${rows.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Guest</th><th scope="col">Kind</th><th scope="col">Message</th><th scope="col">Received</th><th scope="col">Status</th></tr></thead><tbody>
      ${rows.map((x) => `<tr data-search="${esc(search(x))}" data-f-kind="${x.kind}"><td data-label="Guest"><a class="cell-link" href="#/requests/${x.id}"><b>${esc(x.name)}</b></a><small class="cell-sub">${esc(x.phone || x.email)}</small></td><td data-label="Kind">${badge(KIND[x.kind], "outline")}</td><td data-label="Message" class="clip">${esc(x.message)}</td><td data-label="Received" class="nowrap">${dt(x.at)}</td><td data-label="Status">${statusBadge(x.status)}</td></tr>`).join("")}
      </tbody></table></div>` : empty("inbox", "No requests here", "Try another status.")}`;
  };

  /* Rates */
  const moneyCell = (name, v, label) => `<div class="money money-sm"><span class="affix" aria-hidden="true">Rs</span><input class="input" name="${esc(name)}" id="${esc(name)}" inputmode="numeric" autocomplete="off" value="${esc(num(v))}" data-money aria-label="${esc(label)}"></div>`;
  const RATE_TABS = [["hotels", "Hotels"], ["vehicles", "Vehicles"], ["air", "Air extras"], ["jeeps", "Jeep lines"], ["season", "Season"], ["quote", "Quote"]];
  SCREENS.rates = (tab = "hotels") => {
    const d = D();
    const head = pageHead("Rates and quotes", { desc: "Prices behind every guest quote. A saved change applies to new quotes at once.", actions: tab !== "quote" ? btn("New quote", { ic: "calc", href: "#/rates/quote" }) : "" });
    const t = tabs(RATE_TABS.map(([k, l]) => [k, l, { hotels: d.hotels.length, vehicles: d.vehicles.length, jeeps: d.jeeps.length }[k]]), tab, "#/rates/");
    const uniq = (a) => [...new Set(a)];
    let body = "";
    if (tab === "hotels") {
      body = `${toolbar("Search hotel or place", filterSelect("place", "Place", [["", "All places"], ...uniq(d.hotels.map((h) => h.place)).map((p) => [p, p])]) + filterSelect("grade", "Grade", [["", "All grades"], ...["Deluxe", "Executive", "Luxury", "Ultra Luxury"].map((g) => [g, g])]), { noun: "hotel rates" })}
        <form data-form="hotels" data-track novalidate><div class="tbl-wrap"><table class="tbl tbl-edit"><thead><tr><th scope="col">Place</th><th scope="col">Start</th><th scope="col">Grade</th><th scope="col" class="r">Twin</th><th scope="col" class="r">3-share</th><th scope="col">Hotel</th><th scope="col">Offered</th></tr></thead><tbody>
        ${d.hotels.map((h) => { const L = `${h.place}, ${h.start}, ${h.grade}`; return `<tr data-search="${esc((h.place + " " + h.hotel).toLowerCase())}" data-f-place="${esc(h.place)}" data-f-grade="${esc(h.grade)}"><td data-label="Place">${esc(h.place)}</td><td data-label="Start">${esc(h.start)}</td><td data-label="Grade">${esc(h.grade)}</td>
          <td data-label="Twin" class="r">${moneyCell(`twin_${h.id}`, h.twin, `Twin rate, ${L}`)}</td><td data-label="3-share" class="r">${moneyCell(`triple_${h.id}`, h.triple, `3-share rate, ${L}`)}</td>
          <td data-label="Hotel"><input class="input input-sm" name="hotel_${h.id}" id="hotel_${h.id}" value="${esc(h.hotel)}" aria-label="Hotel name, ${esc(L)}"></td><td data-label="Offered">${sw(`offered_${h.id}`, h.offered, `Offered, ${L}`, true)}</td></tr>`; }).join("")}
        </tbody></table></div>${savebar()}</form>`;
    } else if (tab === "vehicles") {
      body = `${toolbar("Search vehicle or place", filterSelect("place", "Place", [["", "All places"], ...uniq(d.vehicles.map((h) => h.place)).map((p) => [p, p])]), { noun: "vehicle rates" })}
        <form data-form="vehicles" data-track novalidate><div class="tbl-wrap"><table class="tbl tbl-edit"><thead><tr><th scope="col">Place</th><th scope="col">Start</th><th scope="col">Vehicle</th><th scope="col" class="r">Rent</th><th scope="col" class="r">Fuel</th><th scope="col" class="r">Toll</th><th scope="col">Seats</th><th scope="col">On</th></tr></thead><tbody>
        ${d.vehicles.map((v) => { const L = `${v.place}, ${v.start}, ${v.vehicle}`; return `<tr data-search="${esc((v.place + " " + v.vehicle).toLowerCase())}" data-f-place="${esc(v.place)}"><td data-label="Place">${esc(v.place)}</td><td data-label="Start">${esc(v.start)}</td><td data-label="Vehicle">${esc(v.vehicle)}</td>
          <td data-label="Rent" class="r">${moneyCell(`rent_${v.id}`, v.rent, `Rent, ${L}`)}</td><td data-label="Fuel" class="r">${moneyCell(`fuel_${v.id}`, v.fuel, `Fuel, ${L}`)}</td><td data-label="Toll" class="r">${moneyCell(`toll_${v.id}`, v.toll, `Toll, ${L}`)}</td>
          <td data-label="Seats"><input class="input input-sm seats" name="seats_${v.id}" id="seats_${v.id}" inputmode="numeric" value="${v.seats}" aria-label="Seats, ${esc(L)}"></td><td data-label="On">${sw(`live_${v.id}`, v.live, `On, ${L}`, true)}</td></tr>`; }).join("")}
        </tbody></table></div>${savebar()}</form>`;
    } else if (tab === "air") {
      const F = [["islamabadTicket", "Islamabad ticket"], ["lahoreAdd", "Lahore add"], ["karachiAdd", "Karachi add"], ["welcomePack", "Welcome pack"], ["entry", "Entry"], ["infantExtra", "Infant extra"], ["sticker", "Sticker"]];
      body = `<form data-form="air" data-track novalidate>${card("Air extras", `<div class="form-grid">${F.map(([k, l]) => field(l, money(k, d.air[k]), { name: k })).join("")}</div>`, "Added to every By Air quote, per guest.")}${savebar()}</form>`;
    } else if (tab === "jeeps") {
      body = `<form data-form="jeeps" data-track novalidate><div class="tbl-wrap"><table class="tbl tbl-edit"><thead><tr><th scope="col">Jeep line</th><th scope="col">Place</th><th scope="col">Mode</th><th scope="col" class="r">Amount</th><th scope="col">On</th></tr></thead><tbody>
        ${d.jeeps.map((j) => `<tr><td data-label="Jeep line"><b>${esc(j.label)}</b></td><td data-label="Place">${esc(j.place)}</td><td data-label="Mode">${esc(j.mode)}</td><td data-label="Amount" class="r">${moneyCell(`amount_${j.id}`, j.amount, `Amount, ${j.label}`)}</td><td data-label="On">${sw(`live_${j.id}`, j.live, `On, ${j.label}`, true)}</td></tr>`).join("")}
        </tbody></table></div>${savebar()}</form>`;
    } else if (tab === "season") {
      body = `<form data-form="season" novalidate>${card("Season profit", `<fieldset class="radios"><legend class="label">Profit used for guest quotes</legend>
          <label class="radio-card"><input type="radio" name="percent" value="20" ${d.season === 20 ? "checked" : ""}><span><b>20 percent</b><small>Peak season</small></span></label>
          <label class="radio-card"><input type="radio" name="percent" value="15" ${d.season === 15 ? "checked" : ""}><span><b>15 percent</b><small>Off season</small></span></label></fieldset>
          <div class="row-actions">${btn("Save season", { v: "primary", a: { type: "submit" } })}</div>`, "A single quote can still use the other season.")}</form>`;
    } else {
      const vehicles = [...new Set(d.vehicles.filter((v) => v.live).map((v) => v.vehicle))];
      const countField = (label, name, value) => field(label, input(name, value, { inputmode: "numeric" }), { name });
      body = `<div class="quote-grid"><form data-form="quote" novalidate>${card("Trip", `<div class="form-grid">
          ${field("Place", select("place", "Skardu Valley", uniq(d.hotels.map((h) => h.place))), { name: "place" })}
          ${field("Travel by", select("mode", "road", [["road", "Road"], ["air", "Air"]]), { name: "mode" })}
          ${field("Start city", select("start", "Islamabad", ["Islamabad", "Lahore", "Karachi"]), { name: "start", help: "Karachi starts are by air only." })}
          ${field("Grade", select("grade", "Deluxe", ["Deluxe", "Executive", "Luxury", "Ultra Luxury"]), { name: "grade" })}
          ${field("Vehicle", select("vehicle", "Gli Car", vehicles), { name: "vehicle" })}
          ${countField("Days", "days", "5")}
          ${countField("Adults", "adults", "2")}
          ${countField("Children", "children", "0")}
          ${countField("Lap infants", "lapInfants", "0")}
          ${countField("Infants with a seat", "seatInfants", "0")}
          ${field("Season profit", select("season", String(d.season), [["20", "20 percent"], ["15", "15 percent"]]), { name: "season" })}
          <div class="field">${check("guide", false, "Guide")}${check("meals", false, "Meals")}</div>
        </div>`)}
        ${card("One night or one day", `<div class="form-grid">
          ${countField("Night number", "night", "")}
          ${field("Night rate", money("nightRate", ""), { name: "nightRate", opt: true })}
          ${field("Night hotel", input("nightHotel", ""), { name: "nightHotel", full: true, opt: true })}
          ${countField("Day", "day", "")}
          ${field("That day", select("dayChange", "", [["", "Leave the vehicle"], ["clear", "No vehicle"], ["jeep", "Jeep"], ["vehicle", "Higher vehicle"]]), { name: "dayChange" })}
          ${field("Higher vehicle", select("dayVehicle", "", [["", "Choose a vehicle"], ...vehicles]), { name: "dayVehicle" })}
          ${field("Jeep rent", money("dayRent", ""), { name: "dayRent", opt: true })}
          ${field("Jeep fuel", money("dayFuel", ""), { name: "dayFuel", opt: true })}
        </div>`, "Leave these blank to keep the saved hotel and the trip vehicle.")}
        ${card("Extras", `<div class="form-grid">
          ${field("Paid extra", input("extraName", ""), { name: "extraName", opt: true })}
          ${field("Extra amount", money("extraAmount", ""), { name: "extraAmount", opt: true })}
          ${field("Other mix", input("otherNote", "", { placeholder: "Use vehicle Other, then type the mix" }), { name: "otherNote", full: true, opt: true })}
          ${field("Other rent", money("otherRent", ""), { name: "otherRent", opt: true })}
          ${field("Other fuel", money("otherFuel", ""), { name: "otherFuel", opt: true })}
          ${field("Other toll", money("otherToll", ""), { name: "otherToll", opt: true })}
          ${field("Other seats", input("otherSeats", "", { inputmode: "numeric" }), { name: "otherSeats", opt: true })}
        </div>`)}
        <div class="row-actions">${btn("Save quote", { v: "primary", a: { type: "submit" } })}</div></form>
        <section class="card quote-result" aria-live="polite" id="quote-result">${empty("calc", "No quote yet", "Fill in the trip and press Save quote.")}</section></div>`;
    }
    return head + t + body;
  };

  /* Tours, places, blog */
  SCREENS.tours = (code) => {
    const T = D().tours;
    const spec = {
      key: (t) => t.code, href: (t) => `#/tours/${t.code}`, title: (t) => t.name, thumb: (t) => t.location,
      sub: (t) => `${esc(t.location)} · ${t.duration} ${t.duration === 1 ? "day" : "days"}`,
      meta: (t) => `${badge(t.transport === "By Air" ? "Air" : "Road", "outline")}${t.featured ? badge("Featured", "accent") : ""}`,
      tileBadge: (t) => (t.featured ? badge("★ Featured", "accent") : ""),
      search: (t) => `${t.name} ${t.code} ${t.location}`, filterAttrs: (t) => `data-f-transport="${esc(t.transport)}" data-f-featured="${t.featured ? "yes" : "no"}"`,
      sortAttrs: (t) => `data-s-name="${esc(t.name.toLowerCase())}" data-s-code="${t.code}" data-s-days="${t.duration}" data-s-updated="${t.updatedAt || ""}"`,
      cols: [["Tour", (t) => `<b>${esc(t.name)}</b>`], ["Code", (t) => t.code, "mono"], ["Days", (t) => t.duration, "r"], ["Travel", (t) => esc(t.transport)], ["Home page", (t) => (t.featured ? badge("Featured", "accent") : '<span class="muted">—</span>')]],
      current: code,
    };
    const listHead = pageHead("Tours", { desc: `${T.length} tours on the website. Prices come from Rates.` });
    const listHtml = toolbar("Search tours, codes, places", filterSelect("transport", "Travel", [["", "Road and air"], ["By Road", "By road"], ["By Air", "By air"]]) + filterSelect("featured", "Featured", [["", "All tours"], ["yes", "Featured only"]]), { noun: "tours", sorts: [["name:asc", "Name, A to Z"], ["code:asc", "Code"], ["days:asc", "Shortest first"], ["days:desc", "Longest first"], ["updated:desc", "Recently saved"]] }) + listView(T, spec);
    if (!code) return listHead + listHtml;
    const t = T.find((x) => x.code === code);
    if (!t) return listHead + empty("map", "Tour not found", "It may have been deleted.", btn("Back to tours", { href: "#/tours" }));
    const form = `<form data-form="tour" data-id="${t.code}" data-track novalidate>
      ${card("Basics", `<div class="form-grid">${field("Title", input("name", t.name, { required: true, "data-bind-src": "name", "data-count": 90 }), { name: "name", full: true })}
        ${field("Description", textarea("description", t.description, 5, { "data-bind-src": "description", "data-count": 400 }), { name: "description", full: true, help: "Shown under the title on the tour page." })}
        ${field("Location", input("location", t.location, { "data-bind-src": "location" }), { name: "location" })}${field("Region", input("region", t.region), { name: "region" })}
        ${field("Days", input("duration", t.duration, { inputmode: "numeric", "data-bind-src": "duration" }), { name: "duration" })}${field("Travel by", select("transport", t.transport, [["By Road", "Road"], ["By Air", "Air"]]), { name: "transport" })}</div>`, "Shown on the tour card and at the top of the tour page.")}
      ${card("Photos", `${field("Main photo", drop("photo", t.image), { name: "photo" })}${field("More photos, one path per line", textarea("gallery", lines(t.gallery), 3), { name: "gallery", opt: true })}`)}
      ${card("Day plan", repeat("days", t.days, (dd, i) => repItem("Day", i, `<div class="form-grid">${field("Title", input("day_title", dd.title || ""), { full: true })}${field("What happens", textarea("day_text", dd.text || "", 2), { full: true })}${field("Highlights, one per line", textarea("day_hl", lines(dd.highlights), 2), { full: true, opt: true })}</div>`), "Add day"), "One block per day, in order.")}
      ${card("What's included", `<div class="form-grid">${field("Included, one per line", textarea("included", lines(t.included), 4), { name: "included" })}${field("Not included, one per line", textarea("notIncluded", lines(t.notIncluded), 4), { name: "notIncluded" })}${field("Categories, one per line", textarea("categories", lines(t.categories), 3), { name: "categories", opt: true })}${field("Package types, one per line", textarea("packageTypes", lines(t.packageTypes), 3), { name: "packageTypes", opt: true })}</div>`)}
      ${card("Visibility", check("featured", t.featured, "Featured on the home page", "Shows in the home page tour row."))}
      ${savebar()}</form>`;
    const danger = can.deleteTour() ? dangerCard("Delete this tour", "Removes the tour page from the website. Saved bookings stay in Requests.", btn("Delete tour", { v: "danger-outline", ic: "trash", a: { "data-action": "delete-tour", "data-id": t.code } })) : "";
    const preview = `<div class="pv-card"><span class="pv-img" style="${art(t.location)}">${t.featured ? badge("★ Featured", "accent") : ""}</span><div class="pv-body"><b data-bind="name">${esc(t.name)}</b><small>${icon("pin")}<span data-bind="location">${esc(t.location)}</span> · <span data-bind="duration">${t.duration}</span> days</small><p data-bind="description">${esc(t.description)}</p><span class="pv-price">From the rate sheet</span></div></div>`;
    return editorFrame({ title: t.name, crumb: [["Tours", "#/tours"], [`Code ${t.code}`]], listHtml, listHead, form, preview, danger, back: "#/tours", badgeHtml: t.featured ? badge("Featured", "accent") : "", desc: `Code ${t.code} · ${t.duration} ${t.duration === 1 ? "day" : "days"} · ${esc(t.transport)}`,
      nav: neighbors(T, T.indexOf(t), spec.href), site: `https://travelwithmoeen.com/tours/${encodeURIComponent(t.id || t.code)}`, meta: savedMeta(t),
      sections: [["sec-basics", "Basics"], ["sec-photos", "Photos"], ["sec-day-plan", "Day plan"], ["sec-what-s-included", "Included"], ["sec-visibility", "Visibility"]] });
  };

  const sectionsEditor = (sections, withPlaceholders = true) => repeat("sections", sections, (s, i) => repItem("Section", i, `<div class="form-grid">${field("Heading", input("sec_heading", s.heading || ""), { full: true })}${field("Text", textarea("sec_body", s.body || "", 4), { full: true })}${field("Photo path", input("sec_image", s.image || ""), { opt: true })}${field("Highlights, one per line", textarea("sec_hl", lines(s.highlights), 2), { opt: true })}</div>`), "Add section");

  SCREENS.places = (slug) => {
    const P = D().places;
    const spec = { key: (p) => p.slug, current: slug, href: (p) => `#/places/${p.slug}`, title: (p) => p.title, thumb: (p) => p.title, sub: (p) => esc(p.location), meta: (p) => `<small>${p.sections.length} sections</small>`, search: (p) => `${p.title} ${p.location}`, sortAttrs: (p) => `data-s-name="${esc(p.title.toLowerCase())}" data-s-updated="${p.updatedAt || ""}"`, cols: [["Place", (p) => `<b>${esc(p.title)}</b>`], ["Location", (p) => esc(p.location)], ["Sections", (p) => p.sections.length, "r"]] };
    const listHead = pageHead("Places", { desc: "Destination pages on the website." });
    const listHtml = toolbar("Search places", "", { noun: "places", sorts: [["name:asc", "Name, A to Z"], ["updated:desc", "Recently saved"]] }) + listView(P, spec);
    if (!slug) return listHead + listHtml;
    const p = P.find((x) => x.slug === slug);
    if (!p) return listHead + empty("pin", "Place not found", "");
    const form = `<form data-form="place" data-id="${p.slug}" data-track novalidate>
      ${card("Basics", `<div class="form-grid">${field("Title", input("title", p.title, { required: true, "data-bind-src": "title" }), { name: "title", full: true })}${field("Short text", textarea("excerpt", p.excerpt, 5, { "data-bind-src": "excerpt", "data-count": 400 }), { name: "excerpt", full: true, help: "Shown on the place card." })}${field("Location", input("location", p.location, { "data-bind-src": "location" }), { name: "location" })}</div>`)}
      ${card("Banner photo", field("Banner", drop("photo", p.banner), { name: "photo" }))}
      ${card("Sections", sectionsEditor(p.sections), "The page body, top to bottom.")}${savebar()}</form>`;
    const preview = `<div class="pv-card"><span class="pv-img tall" style="${art(p.title)}"><b class="pv-over" data-bind="title">${esc(p.title)}</b></span><div class="pv-body"><small>${icon("pin")}<span data-bind="location">${esc(p.location)}</span></small><p data-bind="excerpt">${esc(p.excerpt)}</p></div></div>`;
    return editorFrame({ title: p.title, crumb: [["Places", "#/places"], [p.title]], listHtml, listHead, form, preview, back: "#/places", desc: esc(p.location),
      nav: neighbors(P, P.indexOf(p), spec.href), site: `https://travelwithmoeen.com/destinations/${encodeURIComponent(p.slug)}`, meta: savedMeta(p),
      sections: [["sec-basics", "Basics"], ["sec-banner-photo", "Banner"], ["sec-sections", "Sections"]] });
  };

  SCREENS.blog = (slug) => {
    const P = D().posts;
    const spec = { key: (p) => p.slug, current: slug, href: (p) => `#/blog/${p.slug}`, title: (p) => p.title, thumb: (p) => p.slug, sub: (p) => `${esc(p.author)} · ${dt(p.date + "T12:00:00+05:00", { dateStyle: "medium" })}`, meta: (p) => `<small>${p.sections.length} sections</small>`, search: (p) => `${p.title} ${p.author}`, sortAttrs: (p) => `data-s-name="${esc(p.title.toLowerCase())}" data-s-date="${p.date}" data-s-updated="${p.updatedAt || ""}"`, cols: [["Post", (p) => `<b>${esc(p.title)}</b>`], ["Author", (p) => esc(p.author)], ["Date", (p) => dt(p.date + "T12:00:00+05:00", { dateStyle: "medium" }), "nowrap"]] };
    const listHead = pageHead("Blog", { desc: "Travel guides and stories on the website." });
    const listHtml = toolbar("Search posts or authors", "", { noun: "posts", sorts: [["date:desc", "Newest first"], ["date:asc", "Oldest first"], ["name:asc", "Title, A to Z"], ["updated:desc", "Recently saved"]] }) + listView(P, spec);
    if (!slug) return listHead + listHtml;
    const p = P.find((x) => x.slug === slug);
    if (!p) return listHead + empty("file", "Post not found", "");
    const form = `<form data-form="post" data-id="${p.slug}" data-track novalidate>
      ${card("Basics", `<div class="form-grid">${field("Title", input("title", p.title, { required: true, "data-bind-src": "title" }), { name: "title", full: true })}${field("Short text", textarea("excerpt", p.excerpt, 4, { "data-bind-src": "excerpt", "data-count": 250 }), { name: "excerpt", full: true, help: "Shown on the blog card and in search results." })}${field("Author", input("author", p.author, { "data-bind-src": "author" }), { name: "author" })}${field("Date", input("date", p.date, { type: "date" }), { name: "date" })}</div>`)}
      ${card("Cover photo", field("Cover", drop("photo", p.cover), { name: "photo" }))}
      ${card("Sections", sectionsEditor(p.sections))}${savebar()}</form>`;
    const preview = `<div class="pv-card"><span class="pv-img" style="${art(p.slug)}"></span><div class="pv-body"><small>By <span data-bind="author">${esc(p.author)}</span></small><b data-bind="title">${esc(p.title)}</b><p data-bind="excerpt">${esc(p.excerpt)}</p><span class="pv-link">Read more ${icon("chevR")}</span></div></div>`;
    return editorFrame({ title: p.title, crumb: [["Blog", "#/blog"], [p.title.slice(0, 40) + (p.title.length > 40 ? "…" : "")]], listHtml, listHead, form, preview, back: "#/blog", desc: `${esc(p.author)} · ${dt(p.date + "T12:00:00+05:00", { dateStyle: "medium" })}`,
      nav: neighbors(P, P.indexOf(p), spec.href), site: `https://travelwithmoeen.com/blog/${encodeURIComponent(p.slug)}`, meta: savedMeta(p),
      sections: [["sec-basics", "Basics"], ["sec-cover-photo", "Cover"], ["sec-sections", "Sections"]] });
  };

  /* Gallery */
  SCREENS.gallery = (id) => {
    const G = D().photos;
    const listHead = pageHead("Gallery", { desc: "Photos on the gallery page and the home page.", actions: btn("Add photo", { v: "primary", ic: "plus", href: "#/gallery/new" }) });
    const listHtml = toolbar("Search descriptions", filterSelect("category", "Group", [["", "Private and group"], ["private", "Private"], ["group", "Group"]]), { noun: "photos" }) +
      `<ul class="photogrid" role="list">${G.map((p) => `<li data-search="${esc(p.alt.toLowerCase())}" data-f-category="${p.category}" class="${p.span ? "span-" + p.span : ""}"><a class="photo" href="#/gallery/${p.id}" ${String(p.id) === id ? 'aria-current="true"' : ""}><span class="photo-img" style="${art(p.src)}" aria-hidden="true"></span><span class="photo-cap"><b>${esc(p.alt)}</b><small>${p.category === "group" ? "Group" : "Private"}${p.homeOnly ? " · Home page only" : ""}</small></span></a></li>`).join("")}</ul>`;
    if (!id) return listHead + listHtml;
    const isNew = id === "new";
    const p = isNew ? { id: "new", src: "", alt: "", category: "private", span: "", homeOnly: false } : G.find((x) => String(x.id) === id);
    if (!p) return listHead + empty("image", "Photo not found", "");
    const form = `<form data-form="photo" data-id="${p.id}" data-track ${isNew ? "data-new" : ""} novalidate>
      ${card("Photo", `${field(isNew ? "Photo" : "Replace photo", drop("photo", p.src), { name: "photo" })}
        <div class="form-grid">${field("Description", input("alt", p.alt, { required: true, "data-bind-src": "alt" }), { name: "alt", full: true, help: "Describe what is in the photo for people who can't see it." })}
        ${field("Group", select("category", p.category, [["private", "Private"], ["group", "Group"]]), { name: "category" })}${field("Shape", select("span", p.span, [["", "Normal"], ["tall", "Tall"], ["wide", "Wide"], ["large", "Large"]]), { name: "span" })}</div>
        ${check("homeOnly", p.homeOnly, "Home page only", "Hide it from the gallery page.")}`)}
      ${savebar(isNew ? "Add photo" : "Save photo", isNew)}</form>`;
    const danger = isNew ? "" : dangerCard("Remove this photo", "It disappears from the website. You can undo for 10 seconds.", btn("Remove photo", { v: "danger-outline", ic: "trash", a: { "data-action": "delete-photo", "data-id": p.id } }));
    const preview = `<div class="pv-card"><span class="pv-img tall" style="${art(p.src || "new")}"></span><div class="pv-body"><p data-bind="alt">${esc(p.alt || "Description")}</p></div></div>`;
    return editorFrame({ title: isNew ? "Add a photo" : "Edit photo", crumb: [["Gallery", "#/gallery"], [isNew ? "New photo" : "Photo"]], listHtml, listHead, form, preview, danger, back: "#/gallery", nav: isNew ? null : neighbors(G, G.indexOf(p), (x) => `#/gallery/${x.id}`), desc: isNew ? "JPEG, PNG, or WebP up to 5 MB." : esc(p.alt), site: isNew ? "" : "https://travelwithmoeen.com/gallery" });
  };

  /* Reviews */
  const stars = (n) => `<span class="stars" aria-label="${n} out of 5">${"★".repeat(n)}<span class="stars-off">${"★".repeat(5 - n)}</span></span>`;
  SCREENS.reviews = (id) => {
    const R = D().reviews;
    const spec = { key: (r) => String(r.id), current: id, href: (r) => `#/reviews/${r.id}`, title: (r) => r.name, sub: (r) => esc(r.text.slice(0, 90)) + "…", meta: (r) => stars(r.rating), search: (r) => `${r.name} ${r.text}`, sortAttrs: (r) => `data-s-name="${esc(r.name.toLowerCase())}" data-s-rating="${r.rating}"`, cols: [["Guest", (r) => `<b>${esc(r.name)}</b>`], ["Rating", (r) => stars(r.rating)], ["Review", (r) => esc(r.text.slice(0, 80)) + "…", "clip"]] };
    if (V.list === "grid") spec.thumb = null;
    const listHead = pageHead("Reviews", { desc: "Guest reviews shown on the home page.", actions: btn("Add review", { v: "primary", ic: "plus", href: "#/reviews/new" }) });
    const listHtml = toolbar("Search reviews", "", { noun: "reviews", sorts: [["name:asc", "Name, A to Z"], ["rating:desc", "Highest rating"], ["rating:asc", "Lowest rating"]] }) + listView(R, spec);
    if (!id) return listHead + listHtml;
    const isNew = id === "new";
    const r = isNew ? { id: "new", name: "", location: "", avatar: "", text: "", rating: 5 } : R.find((x) => String(x.id) === id);
    if (!r) return listHead + empty("star", "Review not found", "");
    const form = `<form data-form="review" data-id="${r.id}" data-track ${isNew ? "data-new" : ""} novalidate>
      ${card("Review", `<div class="form-grid">${field("Guest name", input("name", r.name, { required: true, "data-bind-src": "name" }), { name: "name" })}${field("Place", input("location", r.location), { name: "location", opt: true })}
        ${field("Review", textarea("text", r.text, 6, { required: true, "data-bind-src": "text", "data-count": 500 }), { name: "text", full: true })}
        ${field("Rating", select("rating", r.rating, [[5, "5 stars"], [4, "4 stars"], [3, "3 stars"], [2, "2 stars"], [1, "1 star"]]), { name: "rating" })}${field("Photo path", input("avatar", r.avatar), { name: "avatar", opt: true })}</div>`)}
      ${savebar(isNew ? "Add review" : "Save review", isNew)}</form>`;
    const danger = isNew ? "" : dangerCard("Remove this review", "It disappears from the home page. You can undo for 10 seconds.", btn("Remove review", { v: "danger-outline", ic: "trash", a: { "data-action": "delete-review", "data-id": r.id } }));
    const preview = `<div class="pv-card pv-quote"><div class="pv-body">${stars(r.rating)}<p data-bind="text">${esc(r.text || "The guest's words appear here.")}</p><b data-bind="name">${esc(r.name || "Guest name")}</b></div></div>`;
    return editorFrame({ title: isNew ? "Add a review" : r.name, crumb: [["Reviews", "#/reviews"], [isNew ? "New review" : r.name]], listHtml, listHead, form, preview, danger, back: "#/reviews", nav: isNew ? null : neighbors(R, R.indexOf(r), spec.href), desc: isNew ? "Shown on the home page after you add it." : "Shown on the home page." });
  };

  /* Home slides */
  SCREENS.slides = (id) => {
    const L = [...D().slides].sort((a, b) => a.order - b.order);
    const listHead = pageHead("Home slides", { desc: "The tilted photo cards at the top of the home page, in order.", actions: btn("Add slide", { v: "primary", ic: "plus", href: "#/slides/new" }) });
    const listHtml = `<ol class="slide-list" role="list">${L.map((s, i) => `<li class="slide-row"><span class="slide-thumb" style="${art(s.image)};transform:rotate(${s.rotation / 2}deg)" aria-hidden="true"></span>
        <span class="row-main"><b>${esc(s.title)}</b><small>Position ${i + 1} · tilt ${s.rotation}°</small></span>
        <span class="slide-actions">${btn(`Move ${s.title} up`, { v: "ghost", size: "sm", iconOnly: true, ic: "arrowUp", a: { "data-action": "slide-up", "data-id": s.id, disabled: i === 0 } })}${btn(`Move ${s.title} down`, { v: "ghost", size: "sm", iconOnly: true, ic: "arrowDown", a: { "data-action": "slide-down", "data-id": s.id, disabled: i === L.length - 1 } })}${btn("Edit", { size: "sm", ic: "edit", href: `#/slides/${s.id}` })}</span></li>`).join("")}</ol>`;
    if (!id) return listHead + listHtml;
    const isNew = id === "new";
    const s = isNew ? { id: "new", title: "", image: "", rotation: 0, order: L.length + 1 } : L.find((x) => String(x.id) === id);
    if (!s) return listHead + empty("slides", "Slide not found", "");
    const form = `<form data-form="slide" data-id="${s.id}" data-track ${isNew ? "data-new" : ""} novalidate>
      ${card("Slide", `<div class="form-grid">${field("Title", input("title", s.title, { required: true, "data-bind-src": "title" }), { name: "title", full: true })}${field("Tilt in degrees", input("rotation", s.rotation, { inputmode: "numeric", "data-bind-rot": "1" }), { name: "rotation", help: "From -30 to 30. 0 is straight." })}</div>${field(isNew ? "Photo" : "Replace photo", drop("photo", s.image), { name: "photo" })}`)}
      ${savebar(isNew ? "Add slide" : "Save slide", isNew)}</form>`;
    const danger = isNew ? "" : dangerCard("Remove this slide", "It leaves the home page. You can undo for 10 seconds.", btn("Remove slide", { v: "danger-outline", ic: "trash", a: { "data-action": "delete-slide", "data-id": s.id } }));
    const preview = `<div class="pv-slide"><span class="pv-slide-card" data-rot style="${art(s.image || "new")};transform:rotate(${s.rotation}deg)"><b data-bind="title">${esc(s.title || "Title")}</b></span></div>`;
    return editorFrame({ title: isNew ? "Add a slide" : s.title, crumb: [["Home slides", "#/slides"], [isNew ? "New slide" : s.title]], listHtml, listHead, form, preview, danger, back: "#/slides", nav: isNew ? null : neighbors(L, L.indexOf(s), (x) => `#/slides/${x.id}`), desc: isNew ? "It joins the end of the row." : `Position ${L.indexOf(s) + 1} on the home page`, site: isNew ? "" : "https://travelwithmoeen.com/" });
  };

  /* Site details */
  SCREENS.site = () => {
    const s = D().site;
    return `${pageHead("Site details", { desc: "Contact details and social links in the website header and footer." })}
      <form data-form="site" data-track novalidate>
      ${card("Contact", `<div class="form-grid">${field("Phone", input("phoneDisplay", s.phoneDisplay, { type: "tel", autocomplete: "tel" }), { name: "phoneDisplay", help: "As guests should see it." })}${field("WhatsApp number", input("phoneE164", s.phoneE164, { inputmode: "numeric" }), { name: "phoneE164", help: "Digits only, with 92 first." })}
        ${field("Email", input("email", s.email, { type: "email", autocomplete: "email" }), { name: "email" })}${field("Map link", input("mapsUrl", s.mapsUrl, { type: "url" }), { name: "mapsUrl", opt: true })}
        ${field("Address", textarea("address", s.address, 2), { name: "address", full: true })}</div>`)}
      ${card("Social links", `<div class="form-grid">${["facebookUrl:Facebook", "instagramUrl:Instagram", "tiktokUrl:TikTok", "youtubeUrl:YouTube"].map((x) => { const [k, l] = x.split(":"); return field(l, input(k, s[k], { type: "url" }), { name: k, opt: true }); }).join("")}</div>`, "Leave a link empty to hide its icon.")}
      ${savebar()}</form>`;
  };

  /* Users */
  SCREENS.users = (id, q) => {
    const U = D().users;
    const rows = U.map((u) => { const self = u.email === ME.owner; return `<tr><td data-label="Login"><span class="user-cell"><span class="avatar sm" aria-hidden="true">${esc(u.email.slice(0, 2).toUpperCase())}</span><span><b>${esc(u.email)}</b>${self ? '<small class="cell-sub">You</small>' : ""}</span></span></td>
      <td data-label="Role">${self ? badge("Owner", "outline") : `<label class="sr-only" for="role_${u.id}">Role for ${esc(u.email)}</label><select class="select select-sm" id="role_${u.id}" data-action-change="change-role" data-id="${u.id}">${["owner", "manager", "editor"].map((r) => `<option value="${r}" ${u.role === r ? "selected" : ""}>${ROLE_NAME[r]}</option>`).join("")}</select>`}</td>
      <td data-label="Last sign in" class="nowrap">${u.lastSeen ? rel(u.lastSeen) : "Never"}</td>
      <td data-label="Actions" class="r">${self ? '<span class="muted">—</span>' : btn(`Remove ${u.email}`, { v: "ghost", size: "sm", ic: "trash", iconOnly: true, a: { "data-action": "remove-user", "data-id": u.id } })}</td></tr>`; }).join("");
    return `${pageHead("Users", { desc: "Office logins and their roles. Only the Owner sees this page.", actions: btn("Create login", { v: "primary", ic: "plus", a: { "data-action": "create-user" } }) })}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Login</th><th scope="col">Role</th><th scope="col">Last sign in</th><th scope="col" class="r"><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows}</tbody></table></div>
      <section class="card roles-card"><div class="card-head"><div><h3>What each role can do</h3></div></div><div class="card-body"><div class="tbl-wrap flat"><table class="tbl tbl-plain"><thead><tr><th scope="col">Area</th><th scope="col">Owner</th><th scope="col">Manager</th><th scope="col">Editor</th></tr></thead><tbody>
        ${[["Requests, read", 1, 1, 1], ["Request status", 1, 1, 0], ["Delete a request", 1, 0, 0], ["Rates and quotes", 1, 1, 0], ["Website content", 1, 0, 1], ["Delete a tour", 1, 0, 0], ["Users and backups", 1, 0, 0]].map(([a, ...r]) => `<tr><td data-label="Area">${a}</td>${r.map((x, i) => `<td data-label="${["Owner", "Manager", "Editor"][i]}">${x ? `${icon("check", "yes")}<span class="sr-only">Yes</span>` : `<span class="muted" aria-label="No">—</span>`}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div></div></section>`;
  };

  /* Backups */
  SCREENS.backups = () => {
    const B = D().backups;
    const size = (b) => (b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`);
    return `${pageHead("Backups", { desc: "A backup runs every night at 5:00 AM. The newest 30 are kept in private storage.", actions: btn("Back up now", { v: "primary", ic: "database", a: { "data-action": "backup-now" } }) })}
      ${alert("info", "Restoring a backup", "Download the file, then follow <b>docs/backup.md</b>. Restores run on a copy first.")}
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Made</th><th scope="col">File</th><th scope="col" class="r">Size</th><th scope="col" class="r"><span class="sr-only">Download</span></th></tr></thead><tbody>
      ${B.map((b) => `<tr><td data-label="Made" class="nowrap"><b>${dt(b.at)}</b><small class="cell-sub">${b.manual ? "Made by hand" : "Nightly"}</small></td><td data-label="File" class="mono clip">${esc(b.name)}</td><td data-label="Size" class="r">${size(b.size)}</td><td data-label="Download" class="r">${btn("Download", { size: "sm", ic: "download", a: { "data-action": "download-backup", "data-name": b.name } })}</td></tr>`).join("")}
      </tbody></table></div>`;
  };

  SCREENS.denied = (what) => `<div class="denied">${empty("lock", "You don't have access to this page", `You are signed in as ${S.role === "editor" ? "an Editor" : S.role === "manager" ? "a Manager" : "the Owner"}. ${what}`, btn("Go to dashboard", { href: "#/dashboard" }))}</div>`;

  SCREENS.login = () => `
    <a class="skip" href="#main">Skip to content</a>${demoBar()}
    <main id="main" class="login" tabindex="-1">
      <div class="login-box">
        <div class="login-brand"><span class="logo" aria-hidden="true">TM</span><b>Travel With Moeen Office</b></div>
        <form class="card login-card" data-form="login" novalidate><div class="card-body">
          <div><h1 tabindex="-1">Sign in</h1><p class="desc">Use the email and password for your office login.</p></div>
          <div data-login-error></div>
          ${field("Email", input("email", ME[S.role], { type: "email", autocomplete: "username", required: true }), { name: "email" })}
          ${field("Password", `<div class="pw"><input class="input" id="__ID__" name="password" type="password" autocomplete="current-password" required aria-describedby="__DESC__"><button type="button" class="btn btn-ghost btn-sm" data-action="toggle-pw" aria-pressed="false">${icon("eye")}<span>Show</span></button></div>`, { name: "password", help: "Try any password of 8 or more characters. Fewer shows the sign-in error." })}
          ${btn("Sign in", { v: "primary", size: "lg", a: { type: "submit" } }).replace('class="btn ', 'class="btn btn-block ')}
          <p class="help center">Forgot your password? Ask the Owner to set a new one.</p>
        </div></form>
      </div>
    </main>`;

  O.SCREENS = SCREENS; O.shell = shell; O.card = card; O.navItems = navItems; O.stars = stars; O.listView = listView; O.demoBar = demoBar;
})();

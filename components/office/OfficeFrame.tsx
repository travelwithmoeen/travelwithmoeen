"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { OfficeBusy } from "@/components/office/OfficeBusy";
import { OfficePlaceholder } from "@/components/office/OfficePlaceholder";
import { initialsOf, shownName as nameOf } from "@/components/office/people";
import { SignOutButton } from "@/components/office/SignOutButton";
import {
  SIDEBAR_COOKIE,
  isCurrentOfficeLink,
  type OfficeNavGroup,
  type OfficeNavLink,
} from "@/components/office/office-nav";
import { Button } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { usePendingPath } from "@/components/ui/NavigationProgress";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type OpenMenu = "new" | "account" | null;

type OfficeFrameProps = {
  email: string;
  // T-62 (BR-119): the person's own name, shown in place of the email. Null shows the email.
  name: string | null;
  // T-63: the name of the person's role, such as Manager or a custom role.
  roleName: string;
  nav: OfficeNavGroup[];
  newLinks: OfficeNavLink[];
  newRequestCount: number;
  startCollapsed: boolean;
  children: React.ReactNode;
};


function firstFocusable(root: HTMLElement | null) {
  return root?.querySelector<HTMLElement>("a, button") ?? null;
}

export function OfficeFrame({ email, name, roleName, nav, newLinks, newRequestCount, startCollapsed, children }: OfficeFrameProps) {
  const shownName = nameOf(email, name);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [navOpen, setNavOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [shownPath, setShownPath] = useState(pathname);

  const sideRef = useRef<HTMLElement>(null);
  const navButtonRef = useRef<HTMLButtonElement>(null);
  const newWrapRef = useRef<HTMLDivElement>(null);
  const accountWrapRef = useRef<HTMLDivElement>(null);

  // A new page closes the phone menu and any open menu.
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setNavOpen(false);
    setOpenMenu(null);
  }

  // T-50 (BR-96): while a move to another office page takes longer than 150 milliseconds, the
  // placeholder blocks stand in for the page. The page stays mounted, hidden, in case the move stops.
  // An editor link that only changes ?edit= keeps the page as it is.
  const pendingPath = usePendingPath();
  const loadingPage = Boolean(pendingPath && pendingPath.startsWith("/office") && pendingPath !== pathname);

  // Settings opens from the account menu, not the side menu, so its title is named here.
  const currentLabel =
    pathname === "/office/settings" ? "Settings" : nav.flatMap((group) => group.links).find((link) => isCurrentOfficeLink(link.href, pathname))?.label ?? "Office";

  useEffect(() => {
    if (navOpen) firstFocusable(sideRef.current?.querySelector("nav") ?? null)?.focus();
  }, [navOpen]);

  useEffect(() => {
    const wrap = openMenu === "new" ? newWrapRef.current : openMenu === "account" ? accountWrapRef.current : null;
    if (!wrap) return;
    firstFocusable(wrap.querySelector<HTMLElement>(".pop"))?.focus();

    const closeOutside = (event: PointerEvent) => {
      if (!wrap.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [openMenu]);

  useEffect(() => {
    if (!navOpen && !openMenu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenu) {
        const wrap = openMenu === "new" ? newWrapRef.current : accountWrapRef.current;
        setOpenMenu(null);
        wrap?.querySelector<HTMLElement>("[aria-haspopup]")?.focus();
        return;
      }
      setNavOpen(false);
      navButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [navOpen, openMenu]);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => setOpenMenu((current) => (current === menu ? null : menu));

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "open"}; path=/office; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  };

  const shellClass = ["shell-side", collapsed ? "is-collapsed" : "", navOpen ? "nav-open" : ""].filter(Boolean).join(" ");

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className={shellClass}>
        <aside className="side" id="office-side" aria-label="Office" ref={sideRef}>
          <div className="brand">
            <Image className="logo" src="/images/logo/logo.png" alt="" width={32} height={32} />
            <span className="brand-text">
              <b>Travel With Moeen</b>
              <small>Office</small>
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              className="side-toggle"
              icon="sidebar"
              aria-pressed={collapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleCollapsed}
            >
              <span className="sr-only">Collapse sidebar</span>
            </Button>
            <Button
              variant="ghost"
              iconOnly
              className="only-mobile side-close"
              icon="x"
              onClick={() => {
                setNavOpen(false);
                navButtonRef.current?.focus();
              }}
            >
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="nav" aria-label="Main">
            {nav.map((group) => (
              <Fragment key={group.title}>
                <div className="nav-sec">{group.title}</div>
                {group.links.map((link) => (
                  <Link
                    className="nav-item"
                    href={link.href}
                    key={link.href}
                    title={collapsed ? link.label : undefined}
                    aria-current={isCurrentOfficeLink(link.href, pathname) ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    <Icon name={link.icon} />
                    <span className="nav-label">{link.label}</span>
                    {link.href === "/office/requests" && newRequestCount > 0 ? (
                      <span className="count">
                        {newRequestCount}
                        <span className="sr-only"> new</span>
                      </span>
                    ) : null}
                  </Link>
                ))}
              </Fragment>
            ))}
          </nav>

          <div className="pop-wrap me-wrap" ref={accountWrapRef}>
            <button
              className="me"
              type="button"
              aria-expanded={openMenu === "account"}
              aria-haspopup="true"
              title={collapsed ? shownName : undefined}
              onClick={() => toggleMenu("account")}
            >
              <span className="avatar" aria-hidden="true">
                {initialsOf(email, name)}
              </span>
              <span className="me-text">
                <b>{shownName}</b>
                <small>{roleName}</small>
              </span>
              <Icon name="chevU" className="me-chev" />
            </button>
            <div className="pop pop-up" hidden={openMenu !== "account"}>
              <div className="pop-head">
                <b>{shownName}</b>
                {name ? <small>{email}</small> : null}
                <small>Signed in as {roleName}</small>
              </div>
              {/* T-62 (BR-117): the person's own Settings, between the header and Sign out. */}
              <Link className="pop-item" href="/office/settings" onClick={() => setOpenMenu(null)} aria-current={pathname === "/office/settings" ? "page" : undefined}>
                <Icon name="sliders" />
                Settings
              </Link>
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div
          className="side-scrim"
          aria-hidden="true"
          onClick={() => {
            setNavOpen(false);
            navButtonRef.current?.focus();
          }}
        />

        <div className="body">
          <header className="topbar">
            <Button
              variant="ghost"
              iconOnly
              className="only-mobile"
              icon="menu"
              ref={navButtonRef}
              aria-controls="office-side"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <span className="sr-only">Open menu</span>
            </Button>
            <span className="topbar-title">{currentLabel}</span>
            <span className="spacer" />
            <OfficeBusy />
            {newLinks.length > 0 ? (
              <div className="pop-wrap" ref={newWrapRef}>
                <Button
                  variant="primary"
                  size="sm"
                  icon="plus"
                  aria-expanded={openMenu === "new"}
                  aria-haspopup="true"
                  onClick={() => toggleMenu("new")}
                >
                  <span>New</span>
                </Button>
                <div className="pop pop-right" hidden={openMenu !== "new"}>
                  {newLinks.map((link) => (
                    <Link className="pop-item" href={link.href} key={link.label} onClick={() => setOpenMenu(null)}>
                      <Icon name={link.icon} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </header>
          <main id="main" className="main" tabIndex={-1} aria-busy={loadingPage || undefined}>
            {loadingPage ? <OfficePlaceholder /> : null}
            <div className="main-page" hidden={loadingPage}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

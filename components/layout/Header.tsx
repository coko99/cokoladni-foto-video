"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  navLinks,
  site,
  songCategories,
  songsCategoryHref,
  songsPageHref,
} from "@/lib/content";
import { NavLink } from "@/components/ui/NavLink";

const navLinkClass =
  "text-sm font-medium transition-colors duration-300 hover:text-accent";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const path = href.split("#")[0].split("?")[0] || "/";
  if (path !== "/" && path !== pathname) return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [songsOpen, setSongsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSongsOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const linkClass = (href: string) =>
    `${navLinkClass} ${
      isActive(pathname, href) ? "text-accent" : "text-white/95"
    }`;

  const mobileMenu = mounted
    ? createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] lg:hidden"
            >
        <button
          type="button"
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          aria-label="Zatvori meni"
          onClick={closeMenu}
        />

        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="absolute inset-y-0 right-0 flex w-[min(100vw,320px)] flex-col border-l border-accent/30 bg-[#070b14] shadow-[-8px_0_40px_rgba(0,0,0,0.6)]"
          style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.svg"
                alt={site.name}
                width={36}
                height={36}
                className="logo-neon h-9 w-9"
                unoptimized
              />
              <span className="font-display text-base text-white">{site.name}</span>
            </div>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white"
              onClick={closeMenu}
              aria-label="Zatvori meni"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onNavigate={closeMenu}
                className="rounded-xl px-4 py-3.5 text-[17px] font-medium text-white transition active:bg-accent/15 hover:bg-accent/10 hover:text-accent"
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setSongsOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[17px] font-medium text-white transition hover:bg-accent/10 hover:text-accent"
                aria-expanded={songsOpen}
              >
                Pesme za veselja
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-5 w-5 text-accent transition-transform ${songsOpen ? "rotate-180" : ""}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              <AnimatePresence>
                {songsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <NavLink
                      href={songsPageHref}
                      onNavigate={closeMenu}
                      className="block rounded-xl py-2.5 pl-6 pr-4 text-base text-white/90 hover:bg-accent/10 hover:text-accent"
                    >
                      Sve kategorije
                    </NavLink>
                    {songCategories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        href={songsCategoryHref(cat.id)}
                        onNavigate={closeMenu}
                        className="block rounded-xl py-2.5 pl-8 pr-4 text-base text-white/75 hover:bg-accent/10 hover:text-accent"
                      >
                        {cat.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              href="/kontakt"
              onNavigate={closeMenu}
              className="btn-premium mx-2 mt-6 block rounded-full py-3.5 text-center text-base font-semibold"
            >
              Rezerviši termin
            </NavLink>
          </nav>
            </motion.aside>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 header-nav ${
          scrolled || menuOpen ? "header-nav-scrolled" : ""
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:py-4">
          <NavLink href="/" onNavigate={closeMenu} className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt={site.name}
              width={44}
              height={44}
              className="logo-neon h-10 w-10 sm:h-11 sm:w-11"
              unoptimized
              priority
            />
            <span className="hidden font-display text-sm font-medium text-white sm:block">
              {site.name}
            </span>
          </NavLink>

          <nav className="hidden items-center gap-4 xl:gap-6 lg:flex">
            {navLinks.slice(0, 4).map((link) => (
              <NavLink key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </NavLink>
            ))}

            <SongsDropdown pathname={pathname} linkClass={linkClass} />

            {navLinks.slice(4).map((link) => (
              <NavLink key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </NavLink>
            ))}
            <NavLink
              href="/kontakt"
              className="btn-premium inline-flex h-10 items-center rounded-full px-6 text-xs font-semibold uppercase tracking-wider"
            >
              Rezerviši
            </NavLink>
          </nav>

          <button
            type="button"
            className={`relative z-[201] flex h-11 w-11 items-center justify-center rounded-xl border-2 text-white transition lg:hidden ${
              menuOpen
                ? "border-accent bg-accent/20 text-accent"
                : "border-accent/50 bg-[#0a0e18]/90 shadow-[0_0_20px_rgba(101,227,255,0.2)]"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {mobileMenu}
    </>
  );
}

function SongsDropdown({
  pathname,
  linkClass,
}: {
  pathname: string;
  linkClass: (href: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const songsActive = pathname === "/pesme" || pathname.startsWith("/pesme");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        href={songsPageHref}
        className={`flex items-center gap-1 ${
          songsActive ? "text-accent" : linkClass(songsPageHref)
        }`}
      >
        Pesme za veselja
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 pt-2"
          >
            <div className="min-w-[240px] rounded-xl border border-accent/30 bg-[#05070d]/98 py-2 shadow-xl shadow-black/40 backdrop-blur-xl">
              {songCategories.map((cat) => (
                <NavLink
                  key={cat.id}
                  href={songsCategoryHref(cat.id)}
                  className="block px-4 py-2.5 text-sm text-white/85 transition hover:bg-accent/10 hover:text-accent"
                >
                  {cat.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

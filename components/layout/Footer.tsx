import { footerNavLinks, site } from "@/lib/content";
import { NavLink } from "@/components/ui/NavLink";
import { Logo } from "@/components/ui/Logo";
import { SocialNeonLinks } from "@/components/ui/SocialNeonLinks";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-bg-charcoal/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Logo size="sm" className="h-10 w-10" />
              <span className="font-display text-lg font-medium">
                {site.name}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-muted">
              {site.footerDescription}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Navigacija
            </h3>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    className="text-sm text-text-muted transition hover:text-accent"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Kontakt
            </h3>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <a href={site.phoneHref} className="transition hover:text-accent">
                  {site.phone}
                </a>
              </li>
              <li>{site.location}</li>
              <li>
                <a href={`mailto:${site.email}`} className="transition hover:text-accent">
                  {site.email}
                </a>
              </li>
              <li className="pt-2">
                <SocialNeonLinks />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-text-dim">
          © {new Date().getFullYear()} {site.fullName}. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}

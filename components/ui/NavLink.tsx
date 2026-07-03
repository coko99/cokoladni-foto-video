"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { handleHashNavClick } from "@/lib/hash-nav";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export function NavLink({ href, children, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        const handled = handleHashNavClick(href, pathname, {
          onAfterNavigate: onNavigate,
          navigate: (url) => router.push(url),
        });
        if (handled) e.preventDefault();
        else onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}

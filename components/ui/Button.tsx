"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { handleHashNavClick } from "@/lib/hash-nav";

type ButtonVariant = "premium" | "ghost";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "premium",
  className = "",
  external,
}: ButtonProps) {
  const pathname = usePathname();
  const router = useRouter();

  const base =
    "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold tracking-wide";
  const styles =
    variant === "premium"
      ? "btn-premium"
      : "btn-ghost";

  const isExternal =
    external ?? (href.startsWith("http") || href.startsWith("tel") || href.startsWith("mailto"));

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`${base} ${styles} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} ${styles} ${className}`}
      onClick={(e) => {
        const handled = handleHashNavClick(href, pathname, {
          navigate: (url) => router.push(url),
        });
        if (handled) e.preventDefault();
      }}
    >
      {children}
    </Link>
  );
}

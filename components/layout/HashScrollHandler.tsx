"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollToSection } from "@/lib/hash-nav";

export function HashScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    const timer = window.setTimeout(() => scrollToSection(id), 200);
    return () => window.clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StorageUsageBadge } from "./StorageUsageBadge";

export function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-accent/20 bg-bg-deep/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4">
        <Link href="/admin" className="shrink-0 text-sm font-semibold text-accent">
          Čokoladni Admin
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <StorageUsageBadge />
          <Link
            href="/admin"
            className="hidden text-sm text-text-muted/70 transition-colors hover:text-accent sm:inline"
          >
            Galerije
          </Link>
          <Link
            href="/admin/galleries/new"
            className="rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:text-text-muted/70 sm:hover:text-accent"
          >
            <span className="sm:hidden">+ Nova</span>
            <span className="hidden sm:inline">Nova galerija</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-text-muted/50 transition-colors hover:text-red-400 sm:text-sm"
          >
            Odjava
          </button>
        </nav>
      </div>
    </header>
  );
}

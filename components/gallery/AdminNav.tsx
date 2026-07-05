"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/admin" className="text-sm font-semibold text-accent">
          Čokoladni Admin
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm text-text-muted/70 hover:text-accent transition-colors"
          >
            Galerije
          </Link>
          <Link
            href="/admin/galleries/new"
            className="text-sm text-text-muted/70 hover:text-accent transition-colors"
          >
            Nova galerija
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-text-muted/50 hover:text-red-400 transition-colors"
          >
            Odjava
          </button>
        </nav>
      </div>
    </header>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-medium"
    >
      {copied ? "Kopirano!" : "Kopiraj link"}
    </button>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Preloader } from "@/components/ui/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HashScrollHandler } from "@/components/layout/HashScrollHandler";
import { ChatBot } from "@/components/chat/ChatBot";

function isGalleryAppRoute(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/g/")
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGalleryApp = isGalleryAppRoute(pathname);

  if (isGalleryApp) {
    return (
      <div className="min-h-full flex flex-col">
        <AnimatedBackground />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <>
      <Preloader />
      <AnimatedBackground />
      <Suspense>
        <HashScrollHandler />
      </Suspense>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatBot />
    </>
  );
}

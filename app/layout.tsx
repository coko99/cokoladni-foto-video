import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Čokoladni Foto & Video | Fotograf Kruševac",
  description:
    "Premium fotografija i video produkcija za svadbe, krštenja, rođendane i posebne trenutke. Trenutke pretvaramo u uspomene koje traju.",
  icons: {
    icon: [{ url: "/images/logo-sm.png", type: "image/png" }],
    apple: "/images/logo-sm.png",
    shortcut: "/images/logo-sm.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${inter.variable} ${montserrat.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-bg-deep text-text-primary">
        <Suspense>
          <SiteChrome>{children}</SiteChrome>
        </Suspense>
      </body>
    </html>
  );
}

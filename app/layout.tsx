import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/chat/ChatBot";

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
    icon: [{ url: "/images/logo.svg", type: "image/svg+xml" }],
    apple: "/images/logo.svg",
    shortcut: "/images/logo.svg",
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
        <AnimatedBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}

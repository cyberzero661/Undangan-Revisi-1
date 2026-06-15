import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/lib/providers";
import { Cormorant_Garamond, Kalam } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Undangkuy - Platform Undangan Digital Interaktif",
  description: "Buat undangan digital gratis untuk pernikahan, ulang tahun, dan tasyakuran dengan animasi menarik dan sistem RSVP.",
  keywords: "undangan digital, undangan pernikahan, gratis, interaktif, RSVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${kalam.variable}`}>
      <body className="antialiased">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
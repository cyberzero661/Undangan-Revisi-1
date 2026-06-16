import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/lib/providers";
import { ToastProvider } from "@/lib/toast";

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
    <html lang="id">
      <body className="antialiased">
        <SupabaseProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

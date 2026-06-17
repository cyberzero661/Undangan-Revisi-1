"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";
import { BrandedLoading } from "@/components/shared/BrandedLoading";

interface MapEmbedProps {
  mapsUrl: string;
  locationName: string;
  primaryColor: string;
  mapsButtonText?: string;
}

function normalizeMapsUrl(input: string, fallback: string): { query: string; externalUrl: string; embedUrl: string } {
  const trim = input.trim();
  if (!trim) {
    const q = encodeURIComponent(fallback);
    return { query: fallback, externalUrl: `https://maps.google.com/?q=${q}`, embedUrl: `https://maps.google.com/maps?q=${q}&output=embed&z=16` };
  }

  const hasProtocol = /^https?:\/\//i.test(trim);

  if (hasProtocol) {
    try {
      const u = new URL(trim);
      const q = u.searchParams.get("q") || u.searchParams.get("place") || "";
      if (q) {
        const eq = encodeURIComponent(q);
        return { query: q, externalUrl: `https://maps.google.com/?q=${eq}`, embedUrl: `https://maps.google.com/maps?q=${eq}&output=embed&z=16` };
      }
    } catch {
      // ignore parse error
    }
  }

  const q = encodeURIComponent(trim);
  return { query: trim, externalUrl: `https://maps.google.com/?q=${q}`, embedUrl: `https://maps.google.com/maps?q=${q}&output=embed&z=16` };
}

export function MapEmbed({ mapsUrl, locationName, primaryColor, mapsButtonText = "Buka di Maps" }: MapEmbedProps) {
  const { embedUrl, externalUrl } = useMemo(
    () => normalizeMapsUrl(mapsUrl, locationName),
    [mapsUrl, locationName]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
          <BrandedLoading size="md" />
        </div>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full z-10"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Peta lokasi - ${locationName}`}
        />
      </div>

      <div className="flex items-center justify-between mt-4 px-2">
        <div className="flex items-center gap-2 text-gray-600 min-w-0">
          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
          <span className="text-sm font-medium truncate">{locationName}</span>
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 flex-shrink-0 ml-3"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          <ExternalLink className="w-4 h-4" />
          {mapsButtonText}
        </a>
      </div>
    </motion.div>
  );
}

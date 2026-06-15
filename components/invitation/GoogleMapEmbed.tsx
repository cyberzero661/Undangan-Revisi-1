"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

interface GoogleMapEmbedProps {
  mapsUrl: string;
  locationName: string;
}

export default function GoogleMapEmbed({ mapsUrl, locationName }: GoogleMapEmbedProps) {
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    const coordsMatch = url.match(/[?&]q=([^&]+)/);
    if (coordsMatch) {
      const coords = decodeURIComponent(coordsMatch[1]);
      return `https://www.google.com/maps?q=${encodeURIComponent(coords)}&output=embed`;
    }

    const placeMatch = url.match(/[?&]q=([^&]+)/);
    if (placeMatch) {
      return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1]))}&output=embed`;
    }

    if (url.includes("google.com/maps")) {
      return `${url}${url.includes("?") ? "&" : "?"}output=embed`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(locationName)}&output=embed`;
  };

  const embedUrl = getEmbedUrl(mapsUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      <div className="p-6 bg-white rounded-2xl border border-vintage-beige shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-vintage-gold/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-vintage-gold" />
          </div>
          <div>
            <h4 className="font-cormorant font-semibold text-vintage-darkBrown text-lg">
              {locationName}
            </h4>
          </div>
        </div>

        {embedUrl && (
          <div className="rounded-xl overflow-hidden border border-vintage-beige shadow-sm mb-4">
            <iframe
              src={embedUrl}
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Acara"
              className="w-full"
            />
          </div>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-vintage-gold/10 hover:bg-vintage-gold/20 text-vintage-darkBrown rounded-full font-kalam transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Buka di Google Maps
          </a>
        )}
      </div>
    </motion.div>
  );
}
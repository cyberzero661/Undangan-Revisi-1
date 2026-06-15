"use client";

import { motion } from "framer-motion";
import { Youtube } from "lucide-react";

interface YouTubeLiveProps {
  youtubeUrl: string | null | undefined;
  title?: string;
}

export default function YouTubeLive({ youtubeUrl, title }: YouTubeLiveProps) {
  if (!youtubeUrl) return null;

  const getEmbedUrl = (url: string): string | null => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&rel=0`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(youtubeUrl);

  if (!embedUrl) return null;

  return (
    <section id="livestream" className="py-20 px-4 bg-white relative">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-vintage-darkBrown mb-2">
            Live Streaming
          </h2>
          <p className="font-kalam text-vintage-brown">
            {title || "Saksikan momen bahagia kami secara langsung"}
          </p>
          <div className="ornamental-divider mt-4">
            <span className="text-vintage-gold text-xl">&#10047;</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl border-2 border-vintage-beige shadow-lg"
        >
          <iframe
            src={embedUrl}
            title="Live Streaming"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
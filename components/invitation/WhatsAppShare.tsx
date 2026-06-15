"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppShareProps {
  url: string;
  coupleNames?: string | null;
  guestName?: string;
}

export default function WhatsAppShare({ url, coupleNames, guestName }: WhatsAppShareProps) {
  const shareUrl = guestName ? `${url}?guest=${encodeURIComponent(guestName)}` : url;
  const defaultText = coupleNames
    ? `Assalamu'alaikum, saya ingin berbagi undangan pernikahan ${coupleNames}. Silakan buka link berikut:`
    : `Halo! Saya ingin berbagi undangan acara spesial. Silakan buka link berikut:`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${defaultText}\n\n${shareUrl}`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-kalam transition-colors shadow-lg shadow-green-500/20"
      >
        <MessageCircle className="w-5 h-5" />
        Bagikan via WhatsApp
      </a>
    </motion.div>
  );
}
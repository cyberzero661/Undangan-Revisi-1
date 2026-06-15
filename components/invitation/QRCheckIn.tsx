"use client";

import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

interface QRCheckInProps {
  url: string;
  eventName?: string;
}

export default function QRCheckIn({ url, eventName }: QRCheckInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center p-6"
    >
      <div className="w-12 h-12 rounded-full bg-vintage-gold/10 flex items-center justify-center mx-auto mb-3">
        <QrCode className="w-6 h-6 text-vintage-gold" />
      </div>
      <h4 className="font-cormorant font-semibold text-vintage-darkBrown text-lg mb-2">
        Check-in QR Code
      </h4>
      <p className="font-kalam text-sm text-vintage-brown mb-4">
        Scan QR code berikut untuk mengakses halaman undangan
      </p>
      <div className="inline-block bg-white p-4 rounded-2xl shadow-md border border-vintage-beige">
        <QRCodeSVG
          value={url}
          size={150}
          bgColor="#ffffff"
          fgColor="#5c4a32"
          level="M"
          includeMargin={false}
        />
      </div>
      {eventName && (
        <p className="font-kalam text-xs text-vintage-brown mt-3">{eventName}</p>
      )}
    </motion.div>
  );
}
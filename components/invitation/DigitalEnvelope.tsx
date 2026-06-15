"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Building2, Smartphone } from "lucide-react";
import { DigitalEnvelopeItem } from "@/types";

interface DigitalEnvelopeProps {
  items: DigitalEnvelopeItem[];
  coupleNames?: string | null;
}

export default function DigitalEnvelope({ items, coupleNames }: DigitalEnvelopeProps) {
  if (!items || items.length === 0) return null;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <section id="envelope" className="py-20 px-4 vintage-bg">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="envelope-icon mx-auto mb-4">
            <span className="text-3xl">💌</span>
          </div>
          <h2 className="font-cormorant text-3xl md:text-4xl font-bold text-vintage-darkBrown mb-3">
            Amplop Digital
          </h2>
          <p className="font-kalam text-vintage-brown">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami
          </p>
          {coupleNames && (
            <p className="font-cormorant text-vintage-gold text-lg mt-2">
              {coupleNames}
            </p>
          )}
          <div className="ornamental-divider mt-4">
            <span className="text-vintage-gold text-xl">&#10047;</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bank-card"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vintage-gold/20 to-vintage-gold/5 flex items-center justify-center flex-shrink-0">
                  {item.type === "bank" ? (
                    <Building2 className="w-5 h-5 text-vintage-gold" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-vintage-gold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-cormorant font-semibold text-vintage-darkBrown text-lg">
                      {item.name}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.type === "bank"
                        ? "bg-vintage-gold/10 text-vintage-gold"
                        : "bg-vintage-sage/20 text-vintage-sage"
                    }`}>
                      {item.type === "bank" ? "Bank" : "E-Wallet"}
                    </span>
                  </div>
                  {item.bank && item.type === "bank" && (
                    <p className="font-kalam text-sm text-vintage-brown mb-1">
                      {item.bank}
                    </p>
                  )}
                  <p className="font-mono text-vintage-darkBrown font-medium tracking-wide">
                    {item.account_number}
                  </p>
                  <p className="font-kalam text-xs text-vintage-brown mt-1">
                    a.n. {item.holder}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.account_number, index)}
                  className="w-10 h-10 rounded-lg border border-vintage-gold/30 flex items-center justify-center hover:bg-vintage-gold/10 transition-colors flex-shrink-0"
                  title="Salin nomor rekening"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-vintage-gold" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
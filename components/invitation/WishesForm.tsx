"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { wishesAPI } from "@/lib/api";

interface WishesFormProps {
  eventId: string;
  onWishSent: () => void;
}

export default function WishesForm({ eventId, onWishSent }: WishesFormProps) {
  const [form, setForm] = useState({ guest_name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guest_name.trim() || !form.message.trim()) return;

    try {
      setIsSubmitting(true);
      await wishesAPI.create({
        event_id: eventId,
        guest_name: form.guest_name,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ guest_name: "", message: "" });
      onWishSent();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert("Gagal mengirim ucapan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {submitted ? (
        <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl">&#10003;</span>
          </div>
          <h4 className="font-cormorant text-xl font-semibold text-green-800 mb-1">
            Terima Kasih!
          </h4>
          <p className="font-kalam text-sm text-green-600">
            Ucapan dan doa Anda telah kami terima
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-kalam text-sm text-vintage-brown mb-2">
              Nama Anda
            </label>
            <input
              type="text"
              value={form.guest_name}
              onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-3 bg-white border border-vintage-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown placeholder:text-vintage-brown/50"
              required
            />
          </div>
          <div>
            <label className="block font-kalam text-sm text-vintage-brown mb-2">
              Ucapan & Doa
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-vintage-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 font-kalam text-vintage-darkBrown placeholder:text-vintage-brown/50 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !form.guest_name.trim() || !form.message.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-vintage-gold to-vintage-darkGold text-white rounded-xl font-kalam font-semibold shadow-lg shadow-vintage-gold/20 hover:shadow-xl hover:shadow-vintage-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Kirim Ucapan
          </button>
        </form>
      )}
    </motion.div>
  );
}
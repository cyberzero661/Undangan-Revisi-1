"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 mx-auto mb-6 sm:mb-8" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-playfair px-4">
          Siap Membuat Undangan
          <br />
          Digital Impianmu?
        </h2>
        <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
          Mulai sekarang dan buat undangan digital yang indah dan berkesan.
          <br />
          <span className="font-semibold text-white">Gratis selamanya, tanpa batasan!</span>
        </p>
        <Link
          href="/editor/new"
          className="inline-flex items-center gap-2 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 bg-white text-primary-700 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
        >
          <span>Mulai Sekarang</span>
          <ArrowRight className="w-6 h-6" />
        </Link>
      </motion.div>
    </section>
  );
}

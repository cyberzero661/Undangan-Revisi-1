"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function HeroSection() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      scale: seededRandom(i * 3.3) * 0.5 + 0.5,
      duration: seededRandom(i * 4.4) * 5 + 5,
      delay: seededRandom(i * 5.5) * 5,
      size: seededRandom(i * 6.6) * 10 + 10,
      yOffset: seededRandom(i * 7.7) * 30,
    }));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-300 opacity-20"
            initial={{
              x: `${p.x}%`,
              y: `${p.y}%`,
              scale: p.scale,
            }}
            animate={{
              y: [`${p.y}%`, `${p.y - p.yOffset}%`],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          >
            <Sparkles size={p.size} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" />
            100% Gratis Untuk Selamanya
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 font-playfair"
        >
          <span className="gold-text">Buat Undangan</span>
          <br />
          <span className="text-gray-800">Digital Impianmu</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 px-4"
        >
          Platform undangan digital interaktif dengan animasi menarik,
          musik latar, galeri foto, peta lokasi, dan sistem RSVP.
          <span className="font-semibold text-primary-600"> Semuanya Gratis!</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/editor/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 shadow-lg shadow-primary-500/30 text-sm sm:text-base"
          >
            Buat Undangan Gratis
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <Link
            href="#templates"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-all text-sm sm:text-base"
          >
            Lihat Template
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-500"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm">10,000+ Pengguna</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-gray-300" />
          <span className="text-sm">Tanpa Batasan Fitur</span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ opacity: [1, 0, 1], y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

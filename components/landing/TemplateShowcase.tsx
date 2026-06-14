"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { templates } from "@/lib/data";
import { Template } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Eye, Check } from "lucide-react";

const categories = [
  { id: "all", name: "Semua" },
  { id: "modern", name: "Modern" },
  { id: "rustik", name: "Rustik" },
  { id: "tradisional", name: "Tradisional" },
  { id: "minimalis", name: "Minimalis" },
];

export default function TemplateShowcase() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTemplates = activeCategory === "all"
    ? templates
    : templates.filter((t) => t.category === activeCategory);

  return (
    <section id="templates" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Template <span className="gold-text">Menarik</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih dari berbagai template yang indah dan sesuai dengan tema acara spesialmu
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/editor/new?template=${template.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Gunakan
                    </Link>
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors">
                      <Eye className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/editor/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105"
          >
            Buat Undangan Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}

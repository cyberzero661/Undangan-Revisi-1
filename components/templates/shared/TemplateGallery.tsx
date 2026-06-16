"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Event } from "@/types/database";
import { TemplateContent } from "@/types/template";
import { HeaderReveal, CardReveal, SectionReveal } from "./ScrollEffects";

interface TemplateGalleryProps {
  event: Event;
  content: TemplateContent["gallery"];
  primaryColor: string;
}

export function TemplateGallery({ event, content, primaryColor }: TemplateGalleryProps) {
  const images = event.gallery_images?.length ? event.gallery_images : [
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop",
  ];

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <HeaderReveal className="text-center mb-12">
        <h2 className="text-2xl font-playfair text-gray-800 mb-2">{content.title}</h2>
        <div className="w-8 h-px mx-auto mt-4" style={{ backgroundColor: primaryColor }} />
      </HeaderReveal>
      <SectionReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.slice(0, 6).map((img, i) => (
            <CardReveal key={i} index={i}
              className={`overflow-hidden relative shadow-md ${i === 0 || i === 3 ? "col-span-2 row-span-2 aspect-square rounded-2xl" : "aspect-square rounded-xl"}`}>
              <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 33vw" />
            </CardReveal>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}

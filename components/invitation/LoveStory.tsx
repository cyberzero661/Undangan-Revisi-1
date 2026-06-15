"use client";

import { motion } from "framer-motion";
import type { LoveStory } from "@/types";

interface LoveStoryProps {
  stories: LoveStory[];
}

export default function LoveStoryTimeline({ stories }: LoveStoryProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section id="lovestory" className="py-20 px-4 bg-white relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-cormorant text-3xl md:text-5xl font-bold text-vintage-darkBrown mb-3">
            Our Love Story
          </h2>
          <p className="font-kalam text-vintage-brown text-lg">
            Perjalanan cinta kami yang dimulai dari sebuah pertemuan
          </p>
          <div className="ornamental-divider mt-4">
            <span className="text-vintage-gold text-2xl">&#10047;</span>
          </div>
        </motion.div>

        <div className="relative">
          <div className="timeline-line hidden md:block" />

          {stories.map((story, index) => {
            const isLeft = index % 2 === 0;
            const tiltClass = `scrapbook-tilt-${(index % 4) + 1}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative mb-12 md:mb-16 ${
                  isLeft ? "md:pr-[55%]" : "md:pl-[55%]"
                }`}
              >
                <div className="hidden md:block absolute top-8" style={{ left: isLeft ? "calc(50% - 8px)" : "calc(50% - 8px)" }}>
                  <div className="w-4 h-4 rounded-full bg-vintage-gold border-4 border-white shadow-md" />
                </div>

                <div className={`polaroid-frame washi-tape ${tiltClass}`}>
                  {story.photo_url && (
                    <div className="mb-3 overflow-hidden">
                      <img
                        src={story.photo_url}
                        alt={story.title}
                        className="w-full h-40 md:h-52 object-cover"
                      />
                    </div>
                  )}
                  <div className="px-1">
                    <span className="font-kalam text-xs text-vintage-gold">
                      {story.date ? new Date(story.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : ""}
                    </span>
                    <h4 className="font-cormorant text-xl md:text-2xl font-bold text-vintage-darkBrown mt-1">
                      {story.title}
                    </h4>
                    <p className="font-kalam text-sm text-vintage-brown mt-2 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
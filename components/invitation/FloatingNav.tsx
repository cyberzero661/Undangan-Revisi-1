"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";

interface FloatingNavProps {
  isMuted: boolean;
  onToggleMute: () => void;
  sections: { id: string; label: string; icon: React.ReactNode }[];
}

export default function FloatingNav({ isMuted, onToggleMute, sections }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("cover");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="floating-nav-item shadow-lg"
          title={isOpen ? "Tutup menu" : "Buka menu"}
        >
          {isOpen ? <X className="w-5 h-5 text-vintage-darkBrown" /> : <Menu className="w-5 h-5 text-vintage-darkBrown" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-vintage-beige/50"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`floating-nav-item ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  title={section.label}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {section.icon}
                  </span>
                </button>
              ))}
              <div className="w-full h-px bg-vintage-beige/50 my-1" />
              <button
                onClick={onToggleMute}
                className="floating-nav-item"
                title={isMuted ? "Nyalakan musik" : "Matikan musik"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-vintage-gold" />
                )}
              </button>
              <button
                onClick={scrollToTop}
                className="floating-nav-item"
                title="Kembali ke atas"
              >
                <ChevronUp className="w-5 h-5 text-vintage-brown" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isOpen && (
        <div className="fixed right-3 md:right-4 top-4 z-40 flex flex-col gap-2">
          <button
            onClick={onToggleMute}
            className="floating-nav-item shadow-lg"
            title={isMuted ? "Nyalakan musik" : "Matikan musik"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-vintage-gold" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
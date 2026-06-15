"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface CoupleSectionProps {
  brideName?: string | null;
  groomName?: string | null;
  bridePhoto?: string | null;
  groomPhoto?: string | null;
  brideParentName?: string | null;
  groomParentName?: string | null;
  coupleNames?: string | null;
  title?: string;
}

export default function CoupleSection({
  brideName,
  groomName,
  bridePhoto,
  groomPhoto,
  brideParentName,
  groomParentName,
  coupleNames,
  title,
}: CoupleSectionProps) {
  const displayBride = brideName || (coupleNames ? coupleNames.split("&")[0]?.trim() : "");
  const displayGroom = groomName || (coupleNames ? coupleNames.split("&")[1]?.trim() : "");
  const displayTitle = title || "The Wedding of";

  return (
    <section id="couple" className="min-h-screen py-20 px-4 vintage-bg relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-kalam text-vintage-gold text-lg mb-2">بسم الله الرحمن الرحيم</p>
          <p className="font-kalam text-vintage-brown text-base mb-6">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <div className="ornamental-divider mb-6">
            <Heart className="w-5 h-5 text-vintage-gold fill-vintage-gold" />
          </div>
          <h3 className="font-cormorant text-xl md:text-2xl text-vintage-brown mb-2 tracking-wide">
            {displayTitle}
          </h3>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 my-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-vintage-gold/30 shadow-lg">
              {bridePhoto ? (
                <img src={bridePhoto} alt={displayBride} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-vintage-rose to-vintage-parchment flex items-center justify-center">
                  <span className="font-cormorant text-4xl text-vintage-darkBrown font-bold">
                    {displayBride?.charAt(0) || "D"}
                  </span>
                </div>
              )}
            </div>
            <h4 className="font-cormorant text-2xl md:text-3xl font-bold text-vintage-darkBrown">
              {displayBride || "Mempelai Wanita"}
            </h4>
            {brideParentName && (
              <p className="font-kalam text-sm text-vintage-brown mt-1">
                Putri dari {brideParentName}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vintage-gold to-vintage-darkGold flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-vintage-gold/30 shadow-lg">
              {groomPhoto ? (
                <img src={groomPhoto} alt={displayGroom} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-vintage-sage to-vintage-parchment flex items-center justify-center">
                  <span className="font-cormorant text-4xl text-vintage-darkBrown font-bold">
                    {displayGroom?.charAt(0) || "A"}
                  </span>
                </div>
              )}
            </div>
            <h4 className="font-cormorant text-2xl md:text-3xl font-bold text-vintage-darkBrown">
              {displayGroom || "Mempelai Pria"}
            </h4>
            {groomParentName && (
              <p className="font-kalam text-sm text-vintage-brown mt-1">
                Putra dari {groomParentName}
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <div className="ornamental-divider">
            <span className="font-kalam text-vintage-brown text-sm md:text-base px-4 text-center max-w-md">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya&rdquo;
            </span>
          </div>
          <p className="font-kalam text-sm text-vintage-gold mt-2">(QS. Ar-Rum: 21)</p>
        </motion.div>
      </div>
    </section>
  );
}
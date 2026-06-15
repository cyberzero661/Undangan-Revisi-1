"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Users } from "lucide-react";

interface WishesStatsProps {
  totalWishes: number;
  totalAttending: number;
  totalDeclined: number;
}

export default function WishesStats({ totalWishes, totalAttending, totalDeclined }: WishesStatsProps) {
  const stats = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      value: totalWishes,
      label: "Ucapan Masuk",
      color: "from-vintage-gold to-vintage-darkGold",
      bgColor: "bg-vintage-gold/10",
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: totalAttending,
      label: "Akan Hadir",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      value: totalAttending + totalDeclined,
      label: "Total Konfirmasi",
      color: "from-vintage-rose to-vintage-burgundy",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-3 gap-3 mb-8"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`${stat.bgColor} rounded-2xl p-3 text-center border border-vintage-beige/50`}
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2 text-white`}>
            {stat.icon}
          </div>
          <p className="font-cormorant text-2xl font-bold text-vintage-darkBrown">
            {stat.value}
          </p>
          <p className="font-kalam text-xs text-vintage-brown">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
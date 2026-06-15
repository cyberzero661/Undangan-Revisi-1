"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  targetTime?: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate, targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetStr = targetTime ? `${targetDate}T${targetTime}` : `${targetDate}T00:00:00`;
      const target = new Date(targetStr).getTime();
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const units = [
    { value: timeLeft.days, label: "Hari" },
    { value: timeLeft.hours, label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ];

  return (
    <div className="text-center">
      {isExpired ? (
        <div className="vintage-card p-6">
          <p className="font-kalam text-vintage-gold text-xl">Acara Sudah Dimulai!</p>
        </div>
      ) : (
        <div className="flex justify-center gap-3 md:gap-4">
          {units.map((unit) => (
            <div key={unit.label} className="countdown-box">
              <div className="font-cormorant text-3xl md:text-5xl font-bold text-vintage-darkBrown animate-countdown-pulse">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="font-kalam text-xs md:text-sm text-vintage-brown mt-1">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
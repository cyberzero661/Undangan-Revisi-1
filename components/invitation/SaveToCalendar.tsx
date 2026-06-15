"use client";

import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";

interface SaveToCalendarProps {
  title: string;
  date: string;
  time?: string | null;
  location: string;
  description?: string;
}

export default function SaveToCalendar({ title, date, time, location, description }: SaveToCalendarProps) {
  const generateGoogleCalendarUrl = () => {
    const startDate = time
      ? new Date(`${date}T${time}:00`)
      : new Date(`${date}T10:00:00`);

    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    const pad2 = (n: number) => String(n).padStart(2, "0");
    const formatDateTime = (d: Date) => {
      const utc = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return `${utc.getFullYear()}${pad2(utc.getMonth() + 1)}${pad2(utc.getDate())}T${pad2(utc.getHours())}${pad2(utc.getMinutes())}${pad2(utc.getSeconds())}Z`;
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatDateTime(startDate)}/${formatDateTime(endDate)}`,
      location: location,
      details: description || `Undangan: ${title}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateICSFile = () => {
    const startDate = time
      ? new Date(`${date}T${time}:00`)
      : new Date(`${date}T10:00:00`);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Undangkuy//ID",
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${description || `Undangan: ${title}`}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3"
    >
      <a
        href={generateGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 bg-vintage-gold/10 hover:bg-vintage-gold/20 text-vintage-darkBrown rounded-full font-kalam transition-colors border border-vintage-gold/30"
      >
        <CalendarPlus className="w-4 h-4" />
        Google Calendar
      </a>
      <button
        onClick={generateICSFile}
        className="inline-flex items-center gap-2 px-5 py-3 bg-vintage-darkBrown text-white rounded-full font-kalam transition-colors hover:bg-vintage-brown"
      >
        <CalendarPlus className="w-4 h-4" />
        Simpan ke Kalender
      </button>
    </motion.div>
  );
}
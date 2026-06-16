"use client";

import { Stamp, Heart, Crown, Flower2 } from "lucide-react";
import { TemplateContent } from "@/types/template";

interface CoverEditorProps {
  content: TemplateContent["cover"];
  onChange: (c: TemplateContent["cover"]) => void;
}

const sealIcons = [
  { value: "stamp", label: "Stamp", Icon: Stamp },
  { value: "heart", label: "Heart", Icon: Heart },
  { value: "crown", label: "Crown", Icon: Crown },
  { value: "flower", label: "Flower", Icon: Flower2 },
] as const;

export function CoverEditor({ content, onChange }: CoverEditorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
        <input
          type="text"
          value={content.tagline}
          onChange={(e) => onChange({ ...content, tagline: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="The Wedding of"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teks Utama</label>
        <input
          type="text"
          value={content.mainText}
          onChange={(e) => onChange({ ...content, mainText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Nama Mempelai"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teks Kedua</label>
        <input
          type="text"
          value={content.secondaryText}
          onChange={(e) => onChange({ ...content, secondaryText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Secondary text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Style Amplop</label>
        <div className="grid grid-cols-3 gap-2">
          {["classic", "modern", "minimal"].map((s) => (
            <button key={s} onClick={() => onChange({ ...content, envelopeStyle: s as "classic" | "modern" | "minimal" })}
              className={`px-3 py-2 rounded-lg border text-xs capitalize transition-all ${
                content.envelopeStyle === s ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 hover:border-gray-300"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-semibold text-gray-800 mb-3">Cover Opening</label>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teks Pembuka (Seal)</label>
            <input
              type="text"
              value={content.openingLabel}
              onChange={(e) => onChange({ ...content, openingLabel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              placeholder="Ketuk untuk Membuka"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Icon Seal</label>
            <div className="grid grid-cols-4 gap-2">
              {sealIcons.map(({ value, label, Icon }) => (
                <button key={value} onClick={() => onChange({ ...content, sealIcon: value })}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-all ${
                    content.sealIcon === value ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 hover:border-gray-300 text-gray-500"
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showParticles"
              checked={content.showParticles}
              onChange={(e) => onChange({ ...content, showParticles: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="showParticles" className="text-sm text-gray-700">Tampilkan Partikel Ambient</label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
        <input
          type="checkbox"
          id="showGuestName"
          checked={content.showGuestName}
          onChange={(e) => onChange({ ...content, showGuestName: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="showGuestName" className="text-sm text-gray-700">Tampilkan Nama Tamu</label>
      </div>
    </div>
  );
}
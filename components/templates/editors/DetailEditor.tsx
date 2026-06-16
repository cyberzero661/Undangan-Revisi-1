"use client";

import { TemplateContent } from "@/types/template";

interface DetailEditorProps {
  content: TemplateContent["detail"];
  onChange: (c: TemplateContent["detail"]) => void;
}

export function DetailEditor({ content, onChange }: DetailEditorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pembuka</label>
        <input
          type="text"
          value={content.introTitle}
          onChange={(e) => onChange({ ...content, introTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Kami Mengundang Anda"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teks Pembuka</label>
        <textarea
          value={content.introText}
          onChange={(e) => onChange({ ...content, introText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
          rows={3}
          placeholder="Teks pembuka untuk undangan..."
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label Tanggal</label>
          <input
            type="text"
            value={content.dateLabel}
            onChange={(e) => onChange({ ...content, dateLabel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Tanggal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label Waktu</label>
          <input
            type="text"
            value={content.timeLabel}
            onChange={(e) => onChange({ ...content, timeLabel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Waktu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label Lokasi</label>
          <input
            type="text"
            value={content.locationLabel}
            onChange={(e) => onChange({ ...content, locationLabel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Lokasi"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Maps</label>
        <input
          type="text"
          value={content.mapsButtonText}
          onChange={(e) => onChange({ ...content, mapsButtonText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Buka di Maps"
        />
      </div>
    </div>
  );
}

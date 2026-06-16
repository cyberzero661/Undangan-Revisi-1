"use client";

import { TemplateContent } from "@/types/template";

interface RSVPEditorProps {
  content: TemplateContent["rsvp"];
  onChange: (c: TemplateContent["rsvp"]) => void;
}

export function RSVPEditor({ content, onChange }: RSVPEditorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul RSVP</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Konfirmasi Kehadiran"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={content.subtitle}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Silakan isi form..."
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Hadir</label>
          <input
            type="text"
            value={content.hadirText}
            onChange={(e) => onChange({ ...content, hadirText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Hadir"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Tidak Hadir</label>
          <input
            type="text"
            value={content.tidakHadirText}
            onChange={(e) => onChange({ ...content, tidakHadirText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="Tidak Hadir"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Kirim</label>
        <input
          type="text"
          value={content.submitButtonText}
          onChange={(e) => onChange({ ...content, submitButtonText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Kirim Konfirmasi"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Sukses</label>
        <input
          type="text"
          value={content.successTitle}
          onChange={(e) => onChange({ ...content, successTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Terima Kasih!"
        />
      </div>
    </div>
  );
}

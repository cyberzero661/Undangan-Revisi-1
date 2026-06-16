"use client";

import { TemplateContent } from "@/types/template";

interface WishesEditorProps {
  content: TemplateContent["wishes"];
  onChange: (c: TemplateContent["wishes"]) => void;
}

export function WishesEditor({ content, onChange }: WishesEditorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Ucapan</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Ucapan & Doa"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teks Kosong</label>
        <input
          type="text"
          value={content.emptyText}
          onChange={(e) => onChange({ ...content, emptyText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Belum ada ucapan..."
        />
      </div>
    </div>
  );
}

"use client";

import { TemplateContent } from "@/types/template";

interface GalleryEditorProps {
  content: TemplateContent["gallery"];
  onChange: (c: TemplateContent["gallery"]) => void;
}

export function GalleryEditor({ content, onChange }: GalleryEditorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Galeri</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          placeholder="Galeri Momen"
        />
      </div>
    </div>
  );
}

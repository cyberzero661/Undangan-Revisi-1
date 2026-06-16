"use client";

import { TemplateContent } from "@/types/template";

interface CountdownEditorProps {
  content: TemplateContent["countdown"];
  onChange: (c: TemplateContent["countdown"]) => void;
}

export function CountdownEditor({ content, onChange }: CountdownEditorProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" id="showCountdown" checked={content.show} onChange={(e) => onChange({ ...content, show: e.target.checked })} className="w-4 h-4" />
        <label htmlFor="showCountdown" className="text-sm font-medium text-gray-700">Tampilkan Countdown Timer</label>
      </div>
      {content.show && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Countdown</label>
          <input type="text" value={content.title} onChange={(e) => onChange({ ...content, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Menuju Hari Bahagia" />
        </div>
      )}
    </div>
  );
}

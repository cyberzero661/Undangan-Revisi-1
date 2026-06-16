"use client";

import { TemplateContent } from "@/types/template";

interface CoupleEditorProps {
  content: TemplateContent["couple"];
  onChange: (c: TemplateContent["couple"]) => void;
  onFileUpload?: (file: File) => Promise<string>;
}

export function CoupleEditor({ content, onChange }: CoupleEditorProps) {
  const updateBride = (field: string, value: string) => onChange({ ...content, bride: { ...content.bride, [field]: value } });
  const updateGroom = (field: string, value: string) => onChange({ ...content, groom: { ...content.groom, [field]: value } });

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" id="showCouple" checked={content.show} onChange={(e) => onChange({ ...content, show: e.target.checked })} className="w-4 h-4" />
        <label htmlFor="showCouple" className="text-sm font-medium text-gray-700">Tampilkan Profil Mempelai</label>
      </div>
      {content.show && (
        <>
          <div className="border-t pt-4">
            <h4 className="text-xs font-semibold text-pink-600 uppercase mb-2">Mempelai Wanita</h4>
            <div className="space-y-2">
              <input type="text" value={content.bride.name} onChange={(e) => updateBride("name", e.target.value)} placeholder="Nama" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={content.bride.role} onChange={(e) => updateBride("role", e.target.value)} placeholder="Role" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={content.bride.photo} onChange={(e) => updateBride("photo", e.target.value)} placeholder="URL Foto" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <p className="text-[11px] text-gray-400">Upload foto melalui tab Media</p>
              <textarea value={content.bride.bio} onChange={(e) => updateBride("bio", e.target.value)} placeholder="Bio singkat" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
              <input type="text" value={content.bride.parents} onChange={(e) => updateBride("parents", e.target.value)} placeholder="Nama Orang Tua" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={content.bride.instagram} onChange={(e) => updateBride("instagram", e.target.value)} placeholder="Instagram (@username)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="text-xs font-semibold text-blue-600 uppercase mb-2">Mempelai Pria</h4>
            <div className="space-y-2">
              <input type="text" value={content.groom.name} onChange={(e) => updateGroom("name", e.target.value)} placeholder="Nama" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={content.groom.role} onChange={(e) => updateGroom("role", e.target.value)} placeholder="Role" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={content.groom.photo} onChange={(e) => updateGroom("photo", e.target.value)} placeholder="URL Foto" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <p className="text-[11px] text-gray-400">Upload foto melalui tab Media</p>
              <textarea value={content.groom.bio} onChange={(e) => updateGroom("bio", e.target.value)} placeholder="Bio singkat" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
              <input type="text" value={content.groom.parents} onChange={(e) => updateGroom("parents", e.target.value)} placeholder="Nama Orang Tua" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="text" value={content.groom.instagram} onChange={(e) => updateGroom("instagram", e.target.value)} placeholder="Instagram (@username)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
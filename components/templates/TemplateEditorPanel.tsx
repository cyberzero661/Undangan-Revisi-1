"use client";

import { useState } from "react";
import {
  Type,
  Palette,
  ChevronDown,
  ChevronRight,
  Mail,
  Users,
  Timer,
  Calendar,
  Image as ImageIcon,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { TemplateContent, TemplateSection } from "@/types/template";
import { CoverEditor } from "./editors/CoverEditor";
import { DetailEditor } from "./editors/DetailEditor";
import { GalleryEditor } from "./editors/GalleryEditor";
import { RSVPEditor } from "./editors/RSVPEditor";
import { WishesEditor } from "./editors/WishesEditor";
import { CoupleEditor } from "./editors/CoupleEditor";
import { CountdownEditor } from "./editors/CountdownEditor";

interface TemplateEditorPanelProps {
  content: TemplateContent;
  sections: TemplateSection[];
  primaryColor: string;
  secondaryColor: string;
  onContentChange: (content: TemplateContent) => void;
  onSectionsChange: (sections: TemplateSection[]) => void;
  onStylesChange: (styles: { primaryColor: string; secondaryColor: string }) => void;
  onFileUpload?: (file: File) => Promise<string>;
}

interface SectionEditorProps {
  section: TemplateSection;
  content: TemplateContent;
  onContentChange: (content: TemplateContent) => void;
  onToggle: () => void;
  onFileUpload?: (file: File) => Promise<string>;
}

function SectionItem({
  section,
  content,
  onContentChange,
  onToggle,
  onFileUpload,
}: SectionEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const sectionLabels: Record<string, string> = {
    cover: "Sampul & Amplop",
    couple: "Profil Mempelai",
    countdown: "Countdown",
    detail: "Detail Acara",
    gallery: "Galeri Foto",
    rsvp: "RSVP",
    wishes: "Ucapan & Doa",
  };

  const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    cover: Mail,
    couple: Users,
    countdown: Timer,
    detail: Calendar,
    gallery: ImageIcon,
    rsvp: ClipboardList,
    wishes: MessageSquare,
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        {(() => {
          const IconComponent = sectionIcons[section.type];
          return <IconComponent className="w-5 h-5 text-gray-400" />;
        })()}
        <div className="flex-1">
          <div className="font-medium text-gray-800">{sectionLabels[section.type]}</div>
          <div className="text-xs text-gray-500">
            {section.visible ? "Visible" : "Hidden"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label
            onClick={(e) => e.stopPropagation()}
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={section.visible}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100">
          {section.type === "cover" && (
            <CoverEditor
              content={content.cover}
              onChange={(c) => onContentChange({ ...content, cover: c })}
            />
          )}
          {section.type === "couple" && (
            <CoupleEditor
              content={content.couple}
              onChange={(c) => onContentChange({ ...content, couple: c })}
              onFileUpload={onFileUpload}
            />
          )}
          {section.type === "countdown" && (
            <CountdownEditor
              content={content.countdown}
              onChange={(c) => onContentChange({ ...content, countdown: c })}
            />
          )}
          {section.type === "detail" && (
            <DetailEditor
              content={content.detail}
              onChange={(c) => onContentChange({ ...content, detail: c })}
            />
          )}
          {section.type === "gallery" && (
            <GalleryEditor
              content={content.gallery}
              onChange={(c) => onContentChange({ ...content, gallery: c })}
            />
          )}
          {section.type === "rsvp" && (
            <RSVPEditor
              content={content.rsvp}
              onChange={(c) => onContentChange({ ...content, rsvp: c })}
            />
          )}
          {section.type === "wishes" && (
            <WishesEditor
              content={content.wishes}
              onChange={(c) => onContentChange({ ...content, wishes: c })}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function TemplateEditorPanel({
  content,
  sections,
  primaryColor,
  secondaryColor,
  onContentChange,
  onSectionsChange,
  onStylesChange,
  onFileUpload,
}: TemplateEditorPanelProps) {
  const [activeTab, setActiveTab] = useState<"content" | "styles">("content");

  const toggleSection = (id: string) => {
    onSectionsChange(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const colors = [
    "#D4AF37", "#8B7355", "#B8860B", "#000000",
    "#1a1a2e", "#6366f1", "#ec4899", "#14b8a6",
    "#f97316", "#22c55e", "#3b82f6", "#a855f7",
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "content"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Type className="w-4 h-4 inline mr-2" />
            Konten
          </button>
          <button
            onClick={() => setActiveTab("styles")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "styles"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Style
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "content" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-4">
              Edit konten setiap section. Toggle visibility untuk menampilkan/menyembunyikan section.
            </p>
            {sections.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                content={content}
                onContentChange={onContentChange}
                onToggle={() => toggleSection(section.id)}
                onFileUpload={onFileUpload}
              />
            ))}
          </div>
        )}

        {activeTab === "styles" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Warna Utama</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onStylesChange({ ...{ primaryColor, secondaryColor }, primaryColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      primaryColor === color ? "border-gray-800 scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onStylesChange({ ...{ primaryColor, secondaryColor }, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => onStylesChange({ ...{ primaryColor, secondaryColor }, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Warna Sekunder</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onStylesChange({ ...{ primaryColor, secondaryColor }, secondaryColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      secondaryColor === color ? "border-gray-800 scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => onStylesChange({ ...{ primaryColor, secondaryColor }, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => onStylesChange({ ...{ primaryColor, secondaryColor }, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Preview Warna</label>
              <div
                className="p-4 rounded-lg text-white text-center"
                style={{ backgroundColor: primaryColor }}
              >
                <p className="font-medium">Warna Utama</p>
              </div>
              <div
                className="p-4 rounded-lg text-gray-800 text-center mt-2"
                style={{ backgroundColor: secondaryColor }}
              >
                <p className="font-medium">Warna Sekunder</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

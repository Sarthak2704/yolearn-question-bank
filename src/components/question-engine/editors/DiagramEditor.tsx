'use client';

import React from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

export interface HotspotLabel {
  key: string; // e.g. "A"
  label: string; // e.g. "Cornea"
  xPercent?: number; // relative coordinate on diagram
  yPercent?: number;
}

interface DiagramEditorProps {
  imageUrl: string;
  caption: string;
  hotspots: HotspotLabel[];
  onChange: (imageUrl: string, caption: string, hotspots: HotspotLabel[]) => void;
}

export default function DiagramEditor({
  imageUrl,
  caption,
  hotspots,
  onChange,
}: DiagramEditorProps) {
  const addHotspot = () => {
    const nextKey = String.fromCharCode(65 + hotspots.length);
    onChange(imageUrl, caption, [...hotspots, { key: nextKey, label: '' }]);
  };

  const removeHotspot = (idx: number) => {
    onChange(
      imageUrl,
      caption,
      hotspots.filter((_, i) => i !== idx)
    );
  };

  const updateHotspot = (idx: number, label: string) => {
    const updated = hotspots.map((h, i) => (i === idx ? { ...h, label } : h));
    onChange(imageUrl, caption, updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-bold text-slate-900 block">
          Diagram & Visual Labelling Configuration
        </span>
        <span className="text-[11px] text-slate-500">
          Upload schematic image and configure labelled parts or hotspot regions (A, B, C, D).
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Diagram Image URL / Attachment
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onChange(e.target.value, caption, hotspots)}
            placeholder="https://... or /media/diagrams/circuit_1.png"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Diagram Caption / Title
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => onChange(imageUrl, e.target.value, hotspots)}
            placeholder="e.g. Figure 1: Ray diagram of compound microscope"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>
      </div>

      {/* Image Preview Box */}
      {imageUrl ? (
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={caption || 'Diagram'}
            className="max-h-56 mx-auto rounded-lg object-contain border border-slate-200"
          />
          {caption && <div className="text-[11px] font-medium text-slate-500">{caption}</div>}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
          <span>Provide an image URL to preview diagram schematic</span>
        </div>
      )}

      {/* Hotspots / Label definitions */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Labelled Hotspot Targets
          </span>
          <button
            type="button"
            onClick={addHotspot}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Label Target</span>
          </button>
        </div>

        <div className="space-y-2">
          {hotspots.map((h, idx) => (
            <div key={h.key || idx} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-100 font-bold text-xs flex items-center justify-center text-indigo-700 shrink-0">
                {h.key}
              </span>
              <input
                type="text"
                value={h.label}
                onChange={(e) => updateHotspot(idx, e.target.value)}
                placeholder={`Name of part ${h.key} (e.g. Eyepiece lens / Anode)...`}
                className="flex-1 text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded text-slate-800"
              />
              <button
                type="button"
                onClick={() => removeHotspot(idx)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface BlankItem {
  id: string; // e.g. "blank1"
  acceptedAnswers: string[];
  caseSensitive?: boolean;
}

interface FillBlankEditorProps {
  blanks: BlankItem[];
  onChange: (blanks: BlankItem[]) => void;
}

export default function FillBlankEditor({ blanks, onChange }: FillBlankEditorProps) {
  const addBlank = () => {
    const nextId = `blank${blanks.length + 1}`;
    onChange([...blanks, { id: nextId, acceptedAnswers: [''], caseSensitive: false }]);
  };

  const removeBlank = (index: number) => {
    onChange(blanks.filter((_, i) => i !== index));
  };

  const updateAnswers = (index: number, val: string) => {
    const answers = val.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = blanks.map((b, i) => (i === index ? { ...b, acceptedAnswers: answers } : b));
    onChange(updated);
  };

  const toggleCase = (index: number) => {
    const updated = blanks.map((b, i) =>
      i === index ? { ...b, caseSensitive: !b.caseSensitive } : b
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Fill in the Blanks Configuration
          </span>
          <span className="text-[11px] text-slate-500">
            Use <code className="text-indigo-600 font-mono">[blank1]</code>, <code className="text-indigo-600 font-mono">[blank2]</code> in your statement text to insert blanks.
          </span>
        </div>
        <button
          type="button"
          onClick={addBlank}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Blank Target</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {blanks.map((blank, idx) => (
          <div
            key={blank.id || idx}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-indigo-700">[{blank.id}]</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={blank.caseSensitive || false}
                    onChange={() => toggleCase(idx)}
                  />
                  <span>Case Sensitive</span>
                </label>
                {blanks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBlank(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Accepted Answers (Comma separated synonyms/variants)
              </label>
              <input
                type="text"
                value={blank.acceptedAnswers.join(', ')}
                onChange={(e) => updateAnswers(idx, e.target.value)}
                placeholder="e.g. mitochondria, mitochondrion, chondriosome"
                className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

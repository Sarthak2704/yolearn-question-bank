'use client';

import React from 'react';
import { Plus, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export interface OptionItem {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  mediaUrl?: string;
}

interface MCQEditorProps {
  options: OptionItem[];
  onChange: (options: OptionItem[]) => void;
  isMultipleCorrect?: boolean;
}

export default function MCQEditor({
  options,
  onChange,
  isMultipleCorrect = false,
}: MCQEditorProps) {
  const handleToggleCorrect = (idx: number) => {
    if (isMultipleCorrect) {
      const updated = options.map((opt, i) =>
        i === idx ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
      onChange(updated);
    } else {
      const updated = options.map((opt, i) => ({
        ...opt,
        isCorrect: i === idx,
      }));
      onChange(updated);
    }
  };

  const handleUpdateText = (idx: number, text: string) => {
    const updated = [...options];
    updated[idx].text = text;
    onChange(updated);
  };

  const handleUpdateExplanation = (idx: number, explanation: string) => {
    const updated = [...options];
    updated[idx].explanation = explanation;
    onChange(updated);
  };

  const handleAddOption = () => {
    const nextChar = String.fromCharCode(65 + options.length);
    onChange([
      ...options,
      {
        id: `opt_${nextChar}`,
        text: '',
        isCorrect: false,
        explanation: '',
      },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            {isMultipleCorrect ? 'Multiple Select Options (MSQ)' : 'Answer Options Configuration'}
          </span>
          <span className="text-[11px] text-slate-500">
            {isMultipleCorrect
              ? 'Select all options that are scientifically or mathematically correct.'
              : 'Select the single radio button for the correct option.'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddOption}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Option</span>
        </button>
      </div>

      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div
            key={opt.id || idx}
            className={`p-3.5 rounded-xl border transition-all space-y-2 ${
              opt.isCorrect
                ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggleCorrect(idx)}
                className="shrink-0"
                title={opt.isCorrect ? 'Marked Correct' : 'Click to mark correct'}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                    opt.isCorrect
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
              </button>

              <div className="flex-1">
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleUpdateText(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)} text (Supports LaTeX e.g. $\\frac{1}{2}mv^2$)`}
                  className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {opt.isCorrect && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  CORRECT
                </span>
              )}

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                  title="Remove option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Explanation / Distractor note */}
            <div className="pl-9">
              <input
                type="text"
                value={opt.explanation || ''}
                onChange={(e) => handleUpdateExplanation(idx, e.target.value)}
                placeholder="Optional distractor rationale or why this option is correct/incorrect..."
                className="w-full text-[11px] py-1 px-2.5 bg-white/80 border border-slate-200/80 rounded text-slate-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

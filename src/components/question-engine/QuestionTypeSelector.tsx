'use client';

import React, { useState } from 'react';
import {
  QUESTION_CATEGORIES,
  QUESTION_TYPE_REGISTRY,
  QuestionCategory,
  QuestionTypeCode,
  getTypesByCategory,
} from '@/lib/question-registry';
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  ListFilter,
} from 'lucide-react';

interface QuestionTypeSelectorProps {
  selectedType: QuestionTypeCode;
  selectedSubtype?: string;
  onSelect: (type: QuestionTypeCode, subtype?: string) => void;
}

export default function QuestionTypeSelector({
  selectedType,
  selectedSubtype,
  onSelect,
}: QuestionTypeSelectorProps) {
  const currentDef = QUESTION_TYPE_REGISTRY[selectedType] || QUESTION_TYPE_REGISTRY['MCQ_SINGLE'];
  const [selectedCat, setSelectedCat] = useState<QuestionCategory>(currentDef.category);

  const availableTypes = getTypesByCategory(selectedCat);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Category Pills Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-indigo-600" />
            <span>Select Question Category (12 Educational Formats)</span>
          </span>
          <span className="text-xs text-indigo-600 font-semibold">
            Active: {currentDef.name}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUESTION_CATEGORIES.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedCat(cat.category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedCat === cat.category
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCat === cat.category ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Available Question Types in Selected Category */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableTypes.map((t) => {
            const isSelected = selectedType === t.code;
            return (
              <div
                key={t.code}
                onClick={() => onSelect(t.code, t.subtypes?.[0])}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{t.name}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                    {t.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">{t.code}</span>
                  <span className="font-semibold text-slate-600">
                    +{t.defaultPositiveMarks} / {t.defaultNegativeMarks} marks
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtype Selector if type has subtypes */}
        {currentDef.subtypes && currentDef.subtypes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-600 shrink-0">Examination Subtype:</span>
            <div className="flex flex-wrap gap-2">
              {currentDef.subtypes.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSelect(currentDef.code, sub)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    selectedSubtype === sub
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

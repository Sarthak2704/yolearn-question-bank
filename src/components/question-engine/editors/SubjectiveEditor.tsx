'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface RubricItem {
  criteria: string;
  marks: number;
}

interface SubjectiveEditorProps {
  modelAnswer: string;
  expectedKeywords: string[];
  rubric: RubricItem[];
  onChange: (modelAnswer: string, expectedKeywords: string[], rubric: RubricItem[]) => void;
}

export default function SubjectiveEditor({
  modelAnswer,
  expectedKeywords,
  rubric,
  onChange,
}: SubjectiveEditorProps) {
  const addRubricStep = () => {
    onChange(modelAnswer, expectedKeywords, [
      ...rubric,
      { criteria: 'Step explanation or formula', marks: 1 },
    ]);
  };

  const removeRubricStep = (index: number) => {
    onChange(
      modelAnswer,
      expectedKeywords,
      rubric.filter((_, i) => i !== index)
    );
  };

  const updateRubricStep = (index: number, criteria: string, marks: number) => {
    const updated = rubric.map((r, i) => (i === index ? { criteria, marks } : r));
    onChange(modelAnswer, expectedKeywords, updated);
  };

  const handleKeywordsChange = (val: string) => {
    const arr = val
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    onChange(modelAnswer, arr, rubric);
  };

  const totalRubricMarks = rubric.reduce((sum, r) => sum + (r.marks || 0), 0);

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-bold text-slate-900 block">
          Subjective Response & Evaluator Rubric
        </span>
        <span className="text-[11px] text-slate-500">
          Provide ideal model answer, core scientific keywords, and a step-by-step marking rubric.
        </span>
      </div>

      {/* Model Answer */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Ideal Model Answer
        </label>
        <textarea
          rows={4}
          value={modelAnswer}
          onChange={(e) => onChange(e.target.value, expectedKeywords, rubric)}
          placeholder="Detailed model answer for evaluator and student reference (supports LaTeX equations)..."
          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
        />
      </div>

      {/* Expected Keywords */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Essential Academic Keywords (Comma separated)
        </label>
        <input
          type="text"
          value={expectedKeywords.join(', ')}
          onChange={(e) => handleKeywordsChange(e.target.value)}
          placeholder="e.g. limiting molar conductivity, Kohlrausch law, weak electrolyte, degree of dissociation"
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
        />
        <span className="text-[10px] text-slate-400 mt-0.5 block">
          Used by automated evaluators to check presence of essential scientific terminology.
        </span>
      </div>

      {/* Marking Rubric Breakdown */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step-by-Step Marking Rubric (Total: {totalRubricMarks} marks)
            </span>
            <span className="text-[11px] text-slate-500">
              Clear criteria for manual and AI-assisted marking.
            </span>
          </div>
          <button
            type="button"
            onClick={addRubricStep}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Criteria</span>
          </button>
        </div>

        <div className="space-y-2">
          {rubric.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
              <input
                type="text"
                value={item.criteria}
                onChange={(e) => updateRubricStep(idx, e.target.value, item.marks)}
                placeholder="Marking criterion description..."
                className="flex-1 text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded text-slate-800"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  value={item.marks}
                  onChange={(e) => updateRubricStep(idx, item.criteria, parseFloat(e.target.value) || 0)}
                  className="w-16 text-xs py-1.5 px-2 bg-white border border-slate-200 rounded text-center font-bold"
                />
                <span className="text-xs text-slate-500 font-medium">pts</span>
              </div>
              {rubric.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRubricStep(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

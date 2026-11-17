'use client';

import React from 'react';
import MathRenderer from '@/components/math/MathRenderer';

interface AssertionReasonEditorProps {
  assertion: string;
  reason: string;
  selectedOption: string; // 'opt_A' | 'opt_B' | 'opt_C' | 'opt_D'
  onChange: (assertion: string, reason: string, selectedOption: string) => void;
}

export default function AssertionReasonEditor({
  assertion,
  reason,
  selectedOption,
  onChange,
}: AssertionReasonEditorProps) {
  const options = [
    {
      id: 'opt_A',
      label: 'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
    },
    {
      id: 'opt_B',
      label: 'Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.',
    },
    {
      id: 'opt_C',
      label: 'Assertion is true but Reason is false.',
    },
    {
      id: 'opt_D',
      label: 'Assertion is false but Reason is true.',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-bold text-slate-900 block">
          Assertion & Reason Configuration
        </span>
        <span className="text-[11px] text-slate-500">
          Enter dedicated Assertion (A) and Reason (R) statements and select the correct logical relationship.
        </span>
      </div>

      <div className="space-y-3">
        {/* Assertion Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assertion Statement (A)
          </label>
          <textarea
            rows={2}
            value={assertion}
            onChange={(e) => onChange(e.target.value, reason, selectedOption)}
            placeholder="e.g. The center of mass of a body may lie at a point where there is no actual matter present..."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
          />
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reason Statement (R)
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => onChange(assertion, e.target.value, selectedOption)}
            placeholder="e.g. The center of mass depends on the spatial distribution of mass rather than physical presence..."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
          />
        </div>
      </div>

      {/* Logical Combinations Selector */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-semibold text-slate-800">
          Correct Logical Relationship:
        </label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div
              key={opt.id}
              onClick={() => onChange(assertion, reason, opt.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-3 transition-colors ${
                selectedOption === opt.id
                  ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  selectedOption === opt.id
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1">{opt.label}</div>
              {selectedOption === opt.id && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  CORRECT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

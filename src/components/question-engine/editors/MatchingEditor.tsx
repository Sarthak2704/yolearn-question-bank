'use client';

import React from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export interface MatchingListItem {
  key: string;
  text: string;
}

export interface MatchingPair {
  from: string;
  to: string;
}

interface MatchingEditorProps {
  listI: MatchingListItem[];
  listII: MatchingListItem[];
  pairs: MatchingPair[];
  onChange: (listI: MatchingListItem[], listII: MatchingListItem[], pairs: MatchingPair[]) => void;
}

export default function MatchingEditor({
  listI,
  listII,
  pairs,
  onChange,
}: MatchingEditorProps) {
  const updateListI = (index: number, text: string) => {
    const updated = [...listI];
    updated[index].text = text;
    onChange(updated, listII, pairs);
  };

  const updateListII = (index: number, text: string) => {
    const updated = [...listII];
    updated[index].text = text;
    onChange(listI, updated, pairs);
  };

  const addRow = () => {
    const nextKeyI = String.fromCharCode(65 + listI.length);
    const nextKeyII = String(listII.length + 1);

    const newListI = [...listI, { key: nextKeyI, text: '' }];
    const newListII = [...listII, { key: nextKeyII, text: '' }];
    const newPairs = [...pairs, { from: nextKeyI, to: nextKeyII }];

    onChange(newListI, newListII, newPairs);
  };

  const removeRow = (index: number) => {
    if (listI.length <= 2) return;
    const removedKey = listI[index].key;
    const newListI = listI.filter((_, i) => i !== index);
    const newListII = listII.filter((_, i) => i !== index);
    const newPairs = pairs.filter((p) => p.from !== removedKey);
    onChange(newListI, newListII, newPairs);
  };

  const updatePairTarget = (fromKey: string, toKey: string) => {
    const existing = pairs.find((p) => p.from === fromKey);
    let updatedPairs: MatchingPair[];
    if (existing) {
      updatedPairs = pairs.map((p) => (p.from === fromKey ? { ...p, to: toKey } : p));
    } else {
      updatedPairs = [...pairs, { from: fromKey, to: toKey }];
    }
    onChange(listI, listII, updatedPairs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Column Matching Configuration
          </span>
          <span className="text-[11px] text-slate-500">
            Define items in List I and List II, and specify the correct matching pair relationships.
          </span>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Row Pair</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* List I */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            List I (Entities / Concepts)
          </span>
          <div className="space-y-2">
            {listI.map((item, idx) => (
              <div key={item.key || idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {item.key}
                </span>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateListI(idx, e.target.value)}
                  placeholder={`List I item ${item.key}...`}
                  className="flex-1 text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded text-slate-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* List II */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            List II (Properties / Values)
          </span>
          <div className="space-y-2">
            {listII.map((item, idx) => (
              <div key={item.key || idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {item.key}
                </span>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateListII(idx, e.target.value)}
                  placeholder={`List II item ${item.key}...`}
                  className="flex-1 text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded text-slate-800"
                />
                {listI.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    title="Remove row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Correct Pair Matcher Matrix */}
      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2.5">
        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
          Correct Answer Mapping (List I → List II)
        </span>
        <div className="flex flex-wrap gap-4">
          {listI.map((itemI) => {
            const currentPair = pairs.find((p) => p.from === itemI.key);
            return (
              <div
                key={itemI.key}
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-xs shadow-xs"
              >
                <span className="font-bold text-indigo-700">{itemI.key}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={currentPair?.to || listII[0]?.key}
                  onChange={(e) => updatePairTarget(itemI.key, e.target.value)}
                  className="font-bold text-purple-700 bg-transparent border-none focus:outline-none"
                >
                  {listII.map((itemII) => (
                    <option key={itemII.key} value={itemII.key}>
                      {itemII.key}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

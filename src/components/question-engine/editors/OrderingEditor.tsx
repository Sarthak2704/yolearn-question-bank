'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export interface OrderItem {
  id: string;
  text: string;
}

interface OrderingEditorProps {
  items: OrderItem[];
  correctSequence: string[]; // array of item IDs in correct sequence
  onChange: (items: OrderItem[], correctSequence: string[]) => void;
}

export default function OrderingEditor({
  items,
  correctSequence,
  onChange,
}: OrderingEditorProps) {
  const addItem = () => {
    const nextId = `step_${items.length + 1}`;
    const newItems = [...items, { id: nextId, text: '' }];
    const newSeq = [...correctSequence, nextId];
    onChange(newItems, newSeq);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 2) return;
    const removedId = items[idx].id;
    const newItems = items.filter((_, i) => i !== idx);
    const newSeq = correctSequence.filter((id) => id !== removedId);
    onChange(newItems, newSeq);
  };

  const updateText = (idx: number, text: string) => {
    const updated = items.map((item, i) => (i === idx ? { ...item, text } : item));
    onChange(updated, correctSequence);
  };

  const moveSeq = (seqIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? seqIndex - 1 : seqIndex + 1;
    if (targetIdx < 0 || targetIdx >= correctSequence.length) return;

    const newSeq = [...correctSequence];
    const temp = newSeq[seqIndex];
    newSeq[seqIndex] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;

    onChange(items, newSeq);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Sequencing & Chronological Arrangement
          </span>
          <span className="text-[11px] text-slate-500">
            Define steps/events and arrange them in the accurate chronological or procedural sequence.
          </span>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stage / Step</span>
        </button>
      </div>

      {/* Step items definition */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700 shrink-0">
              #{idx + 1}
            </span>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateText(idx, e.target.value)}
              placeholder={`Step/Event description (e.g. Prophase I condensation)...`}
              className="flex-1 text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            {items.length > 2 && (
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Correct Target Order arrangement */}
      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
          Correct Target Sequence Order (Use arrows to order)
        </span>
        <div className="space-y-1.5">
          {correctSequence.map((seqId, i) => {
            const item = items.find((it) => it.id === seqId);
            return (
              <div
                key={seqId}
                className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-800 truncate font-medium">
                    {item?.text || seqId}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveSeq(i, 'UP')}
                    disabled={i === 0}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSeq(i, 'DOWN')}
                    disabled={i === correctSequence.length - 1}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

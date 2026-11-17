'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TableEditorProps {
  headers: string[];
  rows: string[][];
  onChange: (headers: string[], rows: string[][]) => void;
}

export default function TableEditor({ headers, rows, onChange }: TableEditorProps) {
  const addRow = () => {
    const emptyRow = headers.map(() => '');
    onChange(headers, [...rows, emptyRow]);
  };

  const removeRow = (rowIdx: number) => {
    if (rows.length <= 1) return;
    onChange(
      headers,
      rows.filter((_, i) => i !== rowIdx)
    );
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map((r) => [...r, '']);
    onChange(newHeaders, newRows);
  };

  const updateHeader = (colIdx: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[colIdx] = val;
    onChange(newHeaders, rows);
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const newRows = rows.map((r, rI) =>
      rI === rowIdx ? r.map((c, cI) => (cI === colIdx ? val : c)) : r
    );
    onChange(headers, newRows);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Tabular Experimental Dataset Configuration
          </span>
          <span className="text-[11px] text-slate-500">
            Define table columns and empirical data rows (e.g. experimental readings, chemical kinetics data).
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addColumn}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
          <button
            type="button"
            onClick={addRow}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-2 w-10 text-center text-slate-400 font-normal">#</th>
              {headers.map((h, colIdx) => (
                <th key={colIdx} className="p-2 border-r border-slate-200 last:border-r-0">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => updateHeader(colIdx, e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-800 text-xs focus:outline-none"
                    placeholder={`Header ${colIdx + 1}`}
                  />
                </th>
              ))}
              <th className="p-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/50">
                <td className="p-2 text-center text-slate-400 font-mono text-[11px]">{rowIdx + 1}</td>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="p-2 border-r border-slate-100 last:border-r-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                      placeholder="Reading..."
                      className="w-full bg-transparent text-xs text-slate-800 focus:outline-none font-mono"
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(rowIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export interface MatrixRowItem {
  rowKey: string;
  label: string;
}

export interface MatrixColItem {
  colKey: string;
  label: string;
}

interface MatrixMatchEditorProps {
  rows: MatrixRowItem[];
  cols: MatrixColItem[];
  matrixMap: Record<string, string[]>;
  onChange: (rows: MatrixRowItem[], cols: MatrixColItem[], matrixMap: Record<string, string[]>) => void;
}

export default function MatrixMatchEditor({
  rows,
  cols,
  matrixMap,
  onChange,
}: MatrixMatchEditorProps) {
  const toggleCell = (rowKey: string, colKey: string) => {
    const currentRowCols = matrixMap[rowKey] || [];
    let updatedRowCols: string[];
    if (currentRowCols.includes(colKey)) {
      updatedRowCols = currentRowCols.filter((k) => k !== colKey);
    } else {
      updatedRowCols = [...currentRowCols, colKey];
    }

    const updatedMap = {
      ...matrixMap,
      [rowKey]: updatedRowCols,
    };
    onChange(rows, cols, updatedMap);
  };

  const updateRowLabel = (index: number, label: string) => {
    const updatedRows = [...rows];
    updatedRows[index].label = label;
    onChange(updatedRows, cols, matrixMap);
  };

  const updateColLabel = (index: number, label: string) => {
    const updatedCols = [...cols];
    updatedCols[index].label = label;
    onChange(rows, updatedCols, matrixMap);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-bold text-slate-900 block">
          Matrix Match Grid Configuration (JEE Advanced Style)
        </span>
        <span className="text-[11px] text-slate-500">
          Check each valid column mapping for every row. Multiple column associations per row are supported.
        </span>
      </div>

      {/* Row and Column Labels Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rows Definitions */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Rows (A, B, C, D)</span>
          {rows.map((r, i) => (
            <div key={r.rowKey} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                {r.rowKey}
              </span>
              <input
                type="text"
                value={r.label}
                onChange={(e) => updateRowLabel(i, e.target.value)}
                placeholder={`Row ${r.rowKey} description...`}
                className="flex-1 text-xs py-1 px-2.5 bg-white border border-slate-200 rounded"
              />
            </div>
          ))}
        </div>

        {/* Columns Definitions */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Columns (p, q, r, s, t)</span>
          {cols.map((c, i) => (
            <div key={c.colKey} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                {c.colKey}
              </span>
              <input
                type="text"
                value={c.label}
                onChange={(e) => updateColLabel(i, e.target.value)}
                placeholder={`Column ${c.colKey} description...`}
                className="flex-1 text-xs py-1 px-2.5 bg-white border border-slate-200 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Matrix Checkbox Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto shadow-xs">
        <span className="text-xs font-bold text-slate-800 block mb-3">
          Correct Answer Matrix Grid Selection:
        </span>
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 border border-slate-200 bg-slate-50 text-slate-500 font-semibold w-24">
                Row \ Col
              </th>
              {cols.map((c) => (
                <th key={c.colKey} className="p-2 border border-slate-200 bg-slate-50 font-bold text-purple-700">
                  {c.colKey}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rowKey}>
                <td className="p-2.5 border border-slate-200 bg-slate-50 font-bold text-indigo-700">
                  {r.rowKey}
                </td>
                {cols.map((c) => {
                  const isChecked = (matrixMap[r.rowKey] || []).includes(c.colKey);
                  return (
                    <td
                      key={c.colKey}
                      onClick={() => toggleCell(r.rowKey, c.colKey)}
                      className={`p-2.5 border border-slate-200 cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-100/60 font-bold text-emerald-800' : 'hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by td onClick
                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

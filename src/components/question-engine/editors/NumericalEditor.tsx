'use client';

import React from 'react';

export interface NumericalConfig {
  numericValue: string;
  tolerance: string;
  decimalPrecision?: string;
  acceptedMin?: string;
  acceptedMax?: string;
  unit?: string;
  answerType: 'INTEGER' | 'DECIMAL' | 'RANGE' | 'WITH_UNIT';
}

interface NumericalEditorProps {
  config: NumericalConfig;
  onChange: (config: NumericalConfig) => void;
}

export default function NumericalEditor({ config, onChange }: NumericalEditorProps) {
  const updateField = (field: keyof NumericalConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-bold text-slate-900 block">
          Numerical Response Configuration
        </span>
        <span className="text-[11px] text-slate-500">
          Configure precise target magnitude, precision, tolerance interval, and physical units.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Answer Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Format Subtype
          </label>
          <select
            value={config.answerType || 'DECIMAL'}
            onChange={(e) => updateField('answerType', e.target.value as any)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="INTEGER">Integer (Single/Double Digit)</option>
            <option value="DECIMAL">Decimal (Floating Point)</option>
            <option value="RANGE">Interval Range [Min, Max]</option>
            <option value="WITH_UNIT">Physical Value with Unit</option>
          </select>
        </div>

        {/* Primary Target Value (if not purely range) */}
        {config.answerType !== 'RANGE' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correct Numerical Value
            </label>
            <input
              type="number"
              step="any"
              value={config.numericValue || ''}
              onChange={(e) => updateField('numericValue', e.target.value)}
              placeholder="e.g. 4 or 42.5"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Value (Min)
              </label>
              <input
                type="number"
                step="any"
                value={config.acceptedMin || ''}
                onChange={(e) => updateField('acceptedMin', e.target.value)}
                placeholder="e.g. 10.2"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Value (Max)
              </label>
              <input
                type="number"
                step="any"
                value={config.acceptedMax || ''}
                onChange={(e) => updateField('acceptedMax', e.target.value)}
                placeholder="e.g. 10.8"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </>
        )}

        {/* Tolerance */}
        {config.answerType !== 'RANGE' && config.answerType !== 'INTEGER' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Acceptable Tolerance (±)
            </label>
            <input
              type="number"
              step="any"
              value={config.tolerance || '0.0'}
              onChange={(e) => updateField('tolerance', e.target.value)}
              placeholder="e.g. 0.05"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
            />
          </div>
        )}

        {/* Physical Unit */}
        {(config.answerType === 'WITH_UNIT' || config.answerType === 'DECIMAL') && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Unit (Optional)
            </label>
            <input
              type="text"
              value={config.unit || ''}
              onChange={(e) => updateField('unit', e.target.value)}
              placeholder="e.g. J, m/s, kg, V"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
            />
          </div>
        )}
      </div>

      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
        <span className="font-bold">Evaluation Rule: </span>
        {config.answerType === 'RANGE' ? (
          <span>Student answer is accepted if $min \le x \le max$.</span>
        ) : config.answerType === 'INTEGER' ? (
          <span>Exact integer match required with 0 tolerance.</span>
        ) : (
          <span>
            Student answer accepted if $|x - {config.numericValue || 'val'}| \le {config.tolerance || '0.0'}$.
          </span>
        )}
      </div>
    </div>
  );
}

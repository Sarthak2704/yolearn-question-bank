'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CopyCheck,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Archive,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export default function DuplicateManagementPage() {
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchDuplicates = () => {
    fetch('/api/duplicates')
      .then((res) => res.json())
      .then((d) => {
        setDuplicates(d.duplicates || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleResolve = async (id: string, action: 'KEEP_BOTH' | 'MARK_DUPLICATE' | 'MERGE_SOURCES') => {
    setResolvingId(id);
    try {
      const res = await fetch(`/api/duplicates/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDuplicates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CopyCheck className="w-6 h-6 text-indigo-600" />
            <span>Duplicate Question Detection & Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Identify exact matches, normalized token overlaps, and semantic paraphrases across PYQ and manual entries.
          </p>
        </div>

        <button
          onClick={fetchDuplicates}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
          title="Refresh duplicate pairs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading duplicate queue...</div>
      ) : duplicates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Unresolved Duplicates</h3>
          <p className="text-xs text-slate-400">All questions in the repository are verified unique.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((dup) => (
            <div
              key={dup.id}
              className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
            >
              {/* Duplicate Card Header */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      dup.similarityScore >= 0.95
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {Math.round(dup.similarityScore * 100)}% Similarity ({dup.matchType})
                  </span>
                  <span className="text-xs text-slate-500">Status: {dup.status}</span>
                </div>

                {/* Resolution Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolve(dup.id, 'KEEP_BOTH')}
                    disabled={resolvingId === dup.id}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Keep Both
                  </button>
                  <button
                    onClick={() => handleResolve(dup.id, 'MARK_DUPLICATE')}
                    disabled={resolvingId === dup.id}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    Archive Duplicate
                  </button>
                  <button
                    onClick={() => handleResolve(dup.id, 'MERGE_SOURCES')}
                    disabled={resolvingId === dup.id}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>Merge Sources</span>
                  </button>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 gap-6 text-xs">
                {/* Original Question */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Original Question
                    </span>
                    <Link
                      href={`/questions/${dup.originalQuestionId}`}
                      className="font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>{dup.originalQuestion?.code || dup.originalQuestionId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="text-slate-900 leading-relaxed font-normal bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <MathRenderer content={dup.originalQuestion?.statementText || '—'} />
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Source: {dup.originalQuestion?.source?.sourceName || 'Manual Entry'}
                  </div>
                </div>

                {/* Detected Duplicate */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Potential Duplicate
                    </span>
                    <Link
                      href={`/questions/${dup.duplicateQuestionId}`}
                      className="font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>{dup.duplicateQuestion?.code || dup.duplicateQuestionId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="text-slate-900 leading-relaxed font-normal bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <MathRenderer content={dup.duplicateQuestion?.statementText || '—'} />
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Source: {dup.duplicateQuestion?.source?.sourceName || 'Manual Entry'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

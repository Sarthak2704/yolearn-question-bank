'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export default function ReviewApprovalPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('PENDING_REVIEW');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchReviewQueue = () => {
    setLoading(true);
    fetch(`/api/reviews?status=${activeFilter}`)
      .then((res) => res.json())
      .then((d) => {
        setQuestions(d.questions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviewQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleQuickDecision = async (questionId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch(`/api/reviews/${questionId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          comment: `Quick ${action.toLowerCase()} by reviewer in Review Queue`,
          reviewerName: 'Dr. Rajesh Verma (Physics SME)',
          reviewerRole: 'SME',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Question successfully ${action.toLowerCase()}d.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchReviewQueue();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>Content Review & Verification Workflow</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Subject Matter Experts and Reviewers verify answers, LaTeX equations, and academic mapping.
          </p>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {[
          { id: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-amber-50 text-amber-700' },
          { id: 'CHANGES_REQUESTED', label: 'Changes Requested', color: 'bg-rose-50 text-rose-700' },
          { id: 'APPROVED', label: 'Approved Questions', color: 'bg-emerald-50 text-emerald-700' },
          { id: 'DRAFT', label: 'Ingestion Drafts', color: 'bg-slate-100 text-slate-700' },
          { id: 'ALL', label: 'All Items', color: 'bg-indigo-50 text-indigo-700' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-lg border transition-all ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Queue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading review queue...</div>
        ) : questions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Queue is Clean!</h3>
            <p className="text-xs text-slate-400">
              No questions waiting in status: {activeFilter.replace(/_/g, ' ')}.
            </p>
          </div>
        ) : (
          questions.map((q) => {
            const primaryTax = q.taxonomyMappings?.[0];
            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{q.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {primaryTax?.subject?.name || 'General'} / {primaryTax?.chapter?.name || '—'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickDecision(q.id, 'APPROVE')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleQuickDecision(q.id, 'REJECT')}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <Link
                      href={`/questions/${q.id}`}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Inspect Full Question Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Statement Preview with KaTeX */}
                <div className="text-xs text-slate-800 leading-relaxed font-normal bg-slate-50/60 p-3.5 rounded-lg border border-slate-100">
                  <MathRenderer content={q.statementText} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Source: {q.source?.sourceName || 'Manual Entry'}</span>
                  <span>Submitted on {new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

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
  BookOpen,
  Database,
  Video,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface QueueItem {
  id: string;
  contentType: 'BOOK' | 'QUESTION' | 'YOSHORT';
  title: string;
  subtitle: string;
  status: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedReviewer: string;
  submittedAt: string;
  actionUrl: string;
  pendingAction: string;
  metadata?: any;
}

export default function ReviewApprovalPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [counts, setCounts] = useState({ total: 0, books: 0, questions: 0, shorts: 0 });
  const [loading, setLoading] = useState(true);
  const [contentTypeFilter, setContentTypeFilter] = useState<'ALL' | 'BOOK' | 'QUESTION' | 'YOSHORT'>('ALL');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/review/unified?contentType=${contentTypeFilter}&status=PENDING`);
      const data = await res.json();
      if (data.success) {
        setQueue(data.queue || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [contentTypeFilter]);

  const handleQuickApprove = async (item: QueueItem) => {
    try {
      if (item.contentType === 'QUESTION') {
        await fetch(`/api/reviews/${item.id}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'APPROVE',
            comment: 'Quick approved in Unified Review Queue',
            reviewerName: 'Dr. Priya Sharma (SME)',
            reviewerRole: 'SME',
          }),
        });
      } else if (item.contentType === 'BOOK') {
        await fetch(`/api/books/${item.id}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: 'BOOK', status: 'VERIFIED' }),
        });
      } else if (item.contentType === 'YOSHORT') {
        await fetch(`/api/shorts/${item.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'APPROVE' }),
        });
      }

      setActionSuccess(`${item.contentType} successfully approved.`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchQueue();
    } catch (e) {
      console.error('Approve failed:', e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Unified Review Queue (Section 8)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Content Review & Verification Queue
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              One centralized review dashboard across physical books, question bank items, and educational short videos.
            </p>
          </div>

          <button
            onClick={fetchQueue}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Content Vertical Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setContentTypeFilter('ALL')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              contentTypeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Verticals</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-indigo-300 font-mono">
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => setContentTypeFilter('BOOK')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              contentTypeFilter === 'BOOK'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>Books</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              {counts.books}
            </span>
          </button>

          <button
            onClick={() => setContentTypeFilter('QUESTION')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              contentTypeFilter === 'QUESTION'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span>Questions</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-mono">
              {counts.questions}
            </span>
          </button>

          <button
            onClick={() => setContentTypeFilter('YOSHORT')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              contentTypeFilter === 'YOSHORT'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-500" />
            <span>YoShorts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-mono">
              {counts.shorts}
            </span>
          </button>
        </div>

        {/* Unified Queue Items */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading unified review items...</div>
        ) : queue.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">All caught up!</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No pending content awaiting review in this vertical.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item) => {
              const typeColor =
                item.contentType === 'BOOK'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : item.contentType === 'QUESTION'
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  : 'bg-purple-50 text-purple-800 border-purple-200';

              const Icon =
                item.contentType === 'BOOK'
                  ? BookOpen
                  : item.contentType === 'QUESTION'
                  ? Database
                  : Video;

              return (
                <div
                  key={`${item.contentType}-${item.id}`}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-lg border shrink-0 ${typeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeColor}`}>
                          {item.contentType}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{item.subtitle}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.priority === 'HIGH'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.priority} PRIORITY
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="text-slate-400">Required Action:</span>
                        <strong className="text-slate-800 font-medium">{item.pendingAction}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleQuickApprove(item)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Quick Approve
                    </button>
                    <Link
                      href={item.actionUrl}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      <span>Open Reviewer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}

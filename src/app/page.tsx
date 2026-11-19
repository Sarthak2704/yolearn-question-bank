'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  BookOpen,
  Database,
  Video,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Network,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/unified');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load unified overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading Unified CMS metrics...</span>
        </div>
      </AppLayout>
    );
  }

  const { books = {}, questions = {}, shorts = {}, taxonomyHealth = {} } = data || {};

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Unified Content Operations System</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              YoLearn.ai Central Content CMS
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Single pane of glass managing Books, Question Bank, and YoShorts with shared academic taxonomy.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchOverview}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/books/upload"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ingest Book</span>
            </Link>
            <Link
              href="/questions/create"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Create Question</span>
            </Link>
            <Link
              href="/shorts/create"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Create YoShort</span>
            </Link>
          </div>
        </div>

        {/* 3 CONTENT VERTICALS KPI PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VERTICAL 1: BOOKS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Physical Books (PDF)</h3>
                  <span className="text-[11px] text-slate-400">OCR & Document Ingestion</span>
                </div>
              </div>
              <Link href="/books" className="text-xs text-emerald-600 hover:underline font-semibold">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Total Ingested</span>
                <span className="text-2xl font-bold text-slate-900 font-mono">{books.total || 0}</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                <span className="text-xs text-amber-700 font-medium block">Pending Review</span>
                <span className="text-2xl font-bold text-amber-800 font-mono">{books.pendingReview || 0}</span>
              </div>
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <span className="text-xs text-emerald-700 font-medium block">Verified & Live</span>
                <span className="text-2xl font-bold text-emerald-800 font-mono">{books.verified || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Extracted Chapters</span>
                <span className="text-2xl font-bold text-slate-900 font-mono">{books.chaptersCount || 0}</span>
              </div>
            </div>

            <Link
              href="/books/upload"
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg transition-colors border border-emerald-200"
            >
              <span>Upload Book PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* VERTICAL 2: QUESTION BANK */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Question Bank (QB)</h3>
                  <span className="text-[11px] text-slate-400">36 Formats & Math Engine</span>
                </div>
              </div>
              <Link href="/questions" className="text-xs text-indigo-600 hover:underline font-semibold">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Total Questions</span>
                <span className="text-2xl font-bold text-slate-900 font-mono">{questions.total || 0}</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                <span className="text-xs text-amber-700 font-medium block">Awaiting Review</span>
                <span className="text-2xl font-bold text-amber-800 font-mono">{questions.pending || 0}</span>
              </div>
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <span className="text-xs text-indigo-700 font-medium block">Approved & Tested</span>
                <span className="text-2xl font-bold text-indigo-800 font-mono">{questions.approved || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Duplicate Flags</span>
                <span className="text-2xl font-bold text-amber-600 font-mono">{questions.duplicates || 0}</span>
              </div>
            </div>

            <Link
              href="/questions"
              className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold text-xs rounded-lg transition-colors border border-indigo-200"
            >
              <span>Explore Central Repository</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* VERTICAL 3: YOSHORTS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">YoShorts Videos</h3>
                  <span className="text-[11px] text-slate-400">Micro-Learning Videos</span>
                </div>
              </div>
              <Link href="/shorts" className="text-xs text-purple-600 hover:underline font-semibold">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Total Videos</span>
                <span className="text-2xl font-bold text-slate-900 font-mono">{shorts.total || 0}</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                <span className="text-xs text-amber-700 font-medium block">Pending Review</span>
                <span className="text-2xl font-bold text-amber-800 font-mono">{shorts.pendingReview || 0}</span>
              </div>
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl">
                <span className="text-xs text-purple-700 font-medium block">Approved & Synced</span>
                <span className="text-2xl font-bold text-purple-800 font-mono">{shorts.approved || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Live in Mobile App</span>
                <span className="text-2xl font-bold text-slate-900 font-mono">{shorts.published || 0}</span>
              </div>
            </div>

            <Link
              href="/shorts/create"
              className="w-full flex items-center justify-center gap-2 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-xs rounded-lg transition-colors border border-purple-200"
            >
              <span>Generate YoShort from Script</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* UNIFIED ACADEMIC HEALTH & SUBJECT COMPLETENESS MATRIX */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Shared Academic Taxonomy & Content Completeness
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                "Create once, map once, reuse everywhere." Tracking coverage across Books, Questions, and Videos.
              </p>
            </div>

            <Link
              href="/taxonomy"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Hierarchy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subject-by-Subject Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Ingested Books</th>
                  <th className="py-3 px-4">Extracted Chapters</th>
                  <th className="py-3 px-4">YoShorts</th>
                  <th className="py-3 px-4">Completeness Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {taxonomyHealth.subjectCompleteness?.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                        {sub.code}
                      </span>
                      <span>{sub.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {sub.booksCount} Books
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {sub.chaptersCount} Chapters
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {sub.shortsCount} Videos
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-800">{sub.score}%</span>
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              sub.score >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${sub.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/taxonomy`}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Inspect Topics →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Centralized Review Queue Shortcut Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
              Central Review Queue
            </span>
            <h3 className="text-lg font-bold">
              {taxonomyHealth.pendingReviewsTotal || 5} Items Awaiting Verification Across Verticals
            </h3>
            <p className="text-xs text-indigo-200">
              Review physical book OCR chapters, question math proofs, and short video transcripts in one place.
            </p>
          </div>

          <Link
            href="/review"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow transition-all shrink-0 self-start md:self-auto"
          >
            <span>Open Unified Review Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  BarChart3,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BookOpen,
  Database,
  Video,
  Network,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/unified');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Compiling cross-vertical CMS analytics...</span>
        </div>
      </AppLayout>
    );
  }

  const { books = {}, questions = {}, shorts = {}, taxonomyHealth = {} } = data || {};

  return (
    <AppLayout>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Unified Analytics & Content Health (Section 9)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Content Health & Operational Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Cross-vertical inventory tracking, throughput velocity, unmapped item alerts, and syllabus completeness.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 self-start sm:self-auto"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 4 SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Books Throughput</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {books.verified || 0} / {books.total || 0}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {books.total > 0 ? Math.round(((books.verified || 0) / books.total) * 100) : 100}% Verified
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>QB Ready for Prod</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {questions.approved || 0} / {questions.total || 0}
            </div>
            <span className="text-[11px] text-indigo-600 font-medium">
              {questions.total > 0 ? Math.round(((questions.approved || 0) / questions.total) * 100) : 100}% Approved
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>YoShorts Coverage</span>
              <Video className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {shorts.published || 0} / {shorts.total || 0}
            </div>
            <span className="text-[11px] text-purple-600 font-medium">
              {shorts.total > 0 ? Math.round(((shorts.published || 0) / shorts.total) * 100) : 100}% Published
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Pending Reviews Total</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-800 font-mono">
              {taxonomyHealth.pendingReviewsTotal || 0}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              Across all 3 verticals
            </span>
          </div>
        </div>

        {/* 3 VERTICALS IN-DEPTH BREAKDOWN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Books In-depth */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Book Ingestion Health</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Books Uploaded:</span>
                <span className="font-bold text-slate-800">{books.total}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">OCR Processing:</span>
                <span className="font-bold text-slate-800">{books.processing || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Pending Verification:</span>
                <span className="font-bold text-amber-700">{books.pendingReview || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Verified & Published:</span>
                <span className="font-bold text-emerald-700">{books.verified || 0}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Structured Chapters:</span>
                <span className="font-bold text-slate-800">{books.chaptersCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Question Bank In-depth */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Question Bank Health</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold text-slate-800">{questions.total}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Pending SME Verification:</span>
                <span className="font-bold text-amber-700">{questions.pending || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Verified Questions:</span>
                <span className="font-bold text-emerald-700">{questions.approved || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Duplicate Alerts:</span>
                <span className="font-bold text-amber-600">{questions.duplicates || 0}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Ready for Production:</span>
                <span className="font-bold text-indigo-700">{questions.readyForProduction || 0}</span>
              </div>
            </div>
          </div>

          {/* YoShorts In-depth */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              <Video className="w-4 h-4 text-purple-600" />
              <span>YoShorts Health</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Videos:</span>
                <span className="font-bold text-slate-800">{shorts.total}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Videos Generated:</span>
                <span className="font-bold text-slate-800">{shorts.total}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Pending Review:</span>
                <span className="font-bold text-amber-700">{shorts.pendingReview || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Approved Videos:</span>
                <span className="font-bold text-emerald-700">{shorts.approved || 0}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Published in Mobile App:</span>
                <span className="font-bold text-purple-700">{shorts.published || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Completeness Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Subject Completeness & Cross-Vertical Mapping Matrix
              </h2>
              <span className="text-xs text-slate-400">
                Evaluates whether each subject has verified books, questions, and video shorts.
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4">Books Ingested</th>
                  <th className="py-2.5 px-4">Chapters</th>
                  <th className="py-2.5 px-4">YoShorts</th>
                  <th className="py-2.5 px-4">Completeness Score</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {taxonomyHealth.subjectCompleteness?.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {sub.name} ({sub.code})
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{sub.booksCount}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{sub.chaptersCount}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{sub.shortsCount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{sub.score}%</span>
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
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.score >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.score >= 80 ? 'WELL COVERED' : 'NEEDS CONTENT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

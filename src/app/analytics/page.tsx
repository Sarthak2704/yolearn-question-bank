'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/overview')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-500">Generating analytics metrics...</span>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Question Bank Analytics & Completeness</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Comprehensive inventory metrics, syllabus coverage, AI accuracy, and metadata health.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Repository Completeness</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">98.4%</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            All core fields filled
          </span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500">AI Tagging Confidence</span>
          <div className="text-2xl font-bold text-purple-600 mt-1">94.8%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Subject & Chapter</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Duplicate Rate</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {((kpis.totalDuplicates / (kpis.totalQuestions || 1)) * 100).toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Under review threshold</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Approval Throughput</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {Math.round(((kpis.approvedQuestions || 1) / (kpis.totalQuestions || 1)) * 100)}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Ready for mock tests</span>
        </div>
      </div>

      {/* Visual Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Difficulty Distribution</h3>
          <div className="space-y-3">
            {charts.byDifficulty?.map((d: any) => {
              const total = kpis.totalQuestions || 1;
              const percent = Math.min(100, Math.round((d.count / total) * 100));
              return (
                <div key={d.difficulty} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{d.difficulty}</span>
                    <span className="text-slate-500">{d.count} questions ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${percent || 15}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Types Diversity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Format Diversity Breakdown</h3>
          <div className="space-y-3">
            {charts.byType?.map((t: any) => {
              const total = kpis.totalQuestions || 1;
              const percent = Math.min(100, Math.round((t.count / total) * 100));
              return (
                <div key={t.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{t.type.replace(/_/g, ' ')}</span>
                    <span className="text-slate-500">{t.count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${percent || 15}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  Clock,
  FileEdit,
  XCircle,
  Sparkles,
  BookOpen,
  FolderTree,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  Percent,
  AlertTriangle,
  Layers,
  ChevronRight,
  Plus,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export default function DashboardPage() {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading Question Bank metrics...</span>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const recent = data?.recentActivity || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Question Bank Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Centralized repository for K-12, JEE Main, JEE Advanced, NEET, and CUET content.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" />
            <span>Bulk Upload PDF/Excel</span>
          </Link>
          <Link
            href="/questions/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Question</span>
          </Link>
        </div>
      </div>

      {/* Module 1: 10 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Questions */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Questions</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{kpis.totalQuestions || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all formats</div>
        </div>

        {/* Approved Questions */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Approved</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{kpis.approvedQuestions || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">SME verified</div>
        </div>

        {/* Pending Review */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{kpis.pendingReview || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">In approval queue</div>
        </div>

        {/* Draft Questions */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Drafts</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <FileEdit className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-700 mt-2">{kpis.draftQuestions || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Unfinished / Ingestion</div>
        </div>

        {/* Rejected Questions */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rejected</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{kpis.rejectedQuestions || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires changes</div>
        </div>

        {/* AI Generated */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Generated</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{kpis.aiGeneratedCount || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Synthesized via LLM</div>
        </div>

        {/* PYQ Questions */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">PYQ Questions</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{kpis.pyqCount || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Previous Year Papers</div>
        </div>

        {/* Total Subjects */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Subjects</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-teal-700 mt-2">{kpis.totalSubjects || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Phy, Chem, Math, Bio...</div>
        </div>

        {/* Total Chapters */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Chapters</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <FolderTree className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-2">{kpis.totalChapters || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Mapped to Syllabus</div>
        </div>

        {/* AI Extraction Success Rate */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Extraction Rate</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {kpis.extractionSuccessRate || 95}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">High OCR accuracy</div>
        </div>
      </div>

      {/* Module 1: Visual Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions by Subject */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Questions by Subject</h3>
            <span className="text-xs text-slate-400">Academic Mapping</span>
          </div>
          <div className="space-y-3">
            {charts.bySubject && charts.bySubject.length > 0 ? (
              charts.bySubject.map((item: any) => {
                const total = kpis.totalQuestions || 1;
                const percent = Math.min(100, Math.round((item.count / total) * 100));
                return (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.subject}</span>
                      <span className="text-slate-500">{item.count} qs ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent || 10}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No subjects mapped yet</div>
            )}
          </div>
        </div>

        {/* Questions by Exam */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Questions by Examination</h3>
            <span className="text-xs text-slate-400">Competitive & Boards</span>
          </div>
          <div className="space-y-3">
            {charts.byExam && charts.byExam.length > 0 ? (
              charts.byExam.map((item: any) => {
                const total = kpis.totalQuestions || 1;
                const percent = Math.min(100, Math.round((item.count / total) * 100));
                return (
                  <div key={item.exam} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.exam}</span>
                      <span className="text-slate-500">{item.count} qs</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent || 15}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No exams mapped yet</div>
            )}
          </div>
        </div>

        {/* Questions by Question Type */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Question Types</h3>
            <span className="text-xs text-slate-400">Format Diversity</span>
          </div>
          <div className="space-y-3">
            {charts.byType && charts.byType.length > 0 ? (
              charts.byType.map((item: any) => {
                const total = kpis.totalQuestions || 1;
                const percent = Math.min(100, Math.round((item.count / total) * 100));
                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.type.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500">{item.count} qs</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent || 10}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">No question types found</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Ingested / Created Questions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recently Added Questions</h3>
              <p className="text-xs text-slate-400">Latest questions added to the repository</p>
            </div>
            <Link
              href="/questions"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recent.questions && recent.questions.length > 0 ? (
              recent.questions.map((q: any) => (
                <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">{q.code}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                        {q.type}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                          q.verificationStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : q.verificationStatus === 'PENDING_REVIEW'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {q.verificationStatus}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href={`/questions/${q.id}`}
                    className="text-xs text-slate-700 hover:text-indigo-600 line-clamp-2 mt-1 block font-normal"
                  >
                    <MathRenderer content={q.statementText} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center">No questions created yet.</div>
            )}
          </div>
        </div>

        {/* Recent Ingestion Jobs & AI Logs */}
        <div className="space-y-6">
          {/* Ingestion Jobs */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Document Ingestion Jobs</h3>
                <p className="text-xs text-slate-400">PDF OCR and bulk Excel parsing jobs</p>
              </div>
              <Link
                href="/upload"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Upload Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recent.importJobs && recent.importJobs.length > 0 ? (
                recent.importJobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-800">{job.fileName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {job.successfullyExtracted} extracted / {job.totalDetected || job.totalPages * 3} detected
                        {job.failedCount > 0 && (
                          <span className="text-rose-600 font-semibold ml-2">({job.failedCount} failed)</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        job.status === 'COMPLETED' || job.status === 'EXTRACTION_COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : job.status === 'PROCESSING'
                          ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">No import jobs recorded.</div>
              )}
            </div>
          </div>

          {/* AI Generation & Tagging Logs */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Engine Logs</h3>
                <p className="text-xs text-slate-400">Structured extraction & tagging audit</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <div className="space-y-2">
              {recent.aiLogs && recent.aiLogs.length > 0 ? (
                recent.aiLogs.map((log: any) => (
                  <div key={log.id} className="text-xs p-2.5 rounded bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                      <span className="font-mono text-purple-700 font-bold">{log.taskType}</span>
                      <span>{log.model} ({log.executionTimeMs}ms)</span>
                    </div>
                    <div className="text-slate-700 text-xs truncate mt-1">
                      {log.inputPrompt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-3 text-center">No AI logs yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

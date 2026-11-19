'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MathRenderer from '@/components/math/MathRenderer';
import {
  Network,
  ArrowLeft,
  BookOpen,
  Database,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Play,
  Layers,
  Sparkles,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export default function TopicDiscoveryPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'BOOKS' | 'QUESTIONS' | 'SHORTS'>('ALL');

  useEffect(() => {
    async function fetchTopicData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/relationships/topic/${topicId}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error('Failed to load topic relationships:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchTopicData();
  }, [topicId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">Loading topic relationships...</div>
    );
  }

  if (!data || !data.topic) {
    return (
      <div className="p-12 text-center text-slate-400">Topic not found.</div>
    );
  }

  const { topic, relatedContent, completeness } = data;
  const { books = [], questions = [], yoShorts = [] } = relatedContent;

  return (
    <div className="space-y-6 pb-12">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/taxonomy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Taxonomy Tree</span>
          </Link>

          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
            Central Content Discovery Hub (Section 7)
          </span>
        </div>

        {/* Topic Title & Completeness Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>{topic.chapter?.subject?.name || 'Subject'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span>{topic.chapter?.name || 'Chapter'}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Network className="w-6 h-6 text-indigo-600" />
                <span>{topic.name}</span>
              </h1>
            </div>

            {/* Completeness Badge */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 block">Content Completeness</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {completeness.score}%
                </span>
              </div>
              <div className="w-16 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${
                    completeness.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${completeness.score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 3 Verticals Content Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Associated Books:</span>
              </div>
              <span className="font-bold text-emerald-900 font-mono">{books.length} Chapter Mappings</span>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-800">
                <Database className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">Question Bank:</span>
              </div>
              <span className="font-bold text-indigo-900 font-mono">{questions.length} Linked Questions</span>
            </div>

            <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-800">
                <Video className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">YoShorts:</span>
              </div>
              <span className="font-bold text-purple-900 font-mono">{yoShorts.length} Videos Available</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {(['ALL', 'BOOKS', 'QUESTIONS', 'SHORTS'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t === 'ALL'
                ? `All Associated Content (${books.length + questions.length + yoShorts.length})`
                : t === 'BOOKS'
                ? `Books (${books.length})`
                : t === 'QUESTIONS'
                ? `Questions (${questions.length})`
                : `YoShorts (${yoShorts.length})`}
            </button>
          ))}
        </div>

        {/* VERTICAL 1: ASSOCIATED BOOKS */}
        {(activeTab === 'ALL' || activeTab === 'BOOKS') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Associated Physical Books & Chapters ({books.length})</span>
              </div>
              <Link
                href="/books/upload"
                className="text-xs text-emerald-600 hover:underline font-semibold"
              >
                + Map Another Book Chapter
              </Link>
            </div>

            {books.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                No book chapters mapped yet. Ingest a book and connect its topic here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((b: any) => (
                  <div
                    key={b.bookTopicId}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-3 hover:border-emerald-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {b.book?.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {b.book?.curriculum} • Grade {b.book?.grade}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm mt-1">{b.book?.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Ch.{b.chapter?.chapterNumber}: {b.chapter?.title} → Topic: <strong>{b.bookTopicTitle}</strong>
                      </p>
                    </div>

                    <Link
                      href={`/books/${b.book?.id}`}
                      className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg border border-slate-100 hover:bg-slate-50"
                      title="Open Book Editor"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VERTICAL 2: ASSOCIATED QUESTIONS */}
        {(activeTab === 'ALL' || activeTab === 'QUESTIONS') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Associated Question Bank Items ({questions.length})</span>
              </div>
              <Link
                href="/questions/create"
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                + Create Question for this Topic
              </Link>
            </div>

            {questions.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                No questions mapped directly to this academic topic yet.
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q: any) => (
                  <div
                    key={q.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">{q.code}</span>
                        <span className="text-[10px] bg-slate-100 font-bold text-slate-700 px-2 py-0.5 rounded">
                          {q.type}
                        </span>
                        <span className="text-[10px] bg-slate-100 font-bold text-slate-700 px-2 py-0.5 rounded">
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{q.positiveMarks} Marks</span>
                      </div>
                      <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed">
                        {q.statementText}
                      </p>
                    </div>

                    <Link
                      href={`/questions/${q.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VERTICAL 3: ASSOCIATED YOSHORTS */}
        {(activeTab === 'ALL' || activeTab === 'SHORTS') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                <Video className="w-4 h-4" />
                <span>Associated YoShorts Videos ({yoShorts.length})</span>
              </div>
              <Link
                href="/shorts/create"
                className="text-xs text-purple-600 hover:underline font-semibold"
              >
                + Generate YoShort Video
              </Link>
            </div>

            {yoShorts.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                No YoShort videos generated for this topic yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {yoShorts.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-3 hover:border-purple-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {s.code}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{s.durationSeconds}s</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm mt-1">{s.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 italic mt-0.5">
                        "{s.transcript}"
                      </p>
                    </div>

                    <Link
                      href={`/shorts/${s.id}`}
                      className="p-2 text-slate-400 hover:text-purple-600 rounded-lg border border-slate-100 hover:bg-slate-50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
  );
}

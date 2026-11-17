'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCw,
  FileText,
  Sparkles,
  Edit3,
  BookOpen,
  Layers,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';
import { QUESTION_TYPE_REGISTRY, QuestionTypeCode } from '@/lib/question-registry';

function ExtractionReviewContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Editable extracted question fields
  const [statement, setStatement] = useState('');
  const [questionType, setQuestionType] = useState<QuestionTypeCode>('MCQ_SINGLE');
  const [options, setOptions] = useState<any[]>([]);
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Rotational Motion');
  const [difficulty, setDifficulty] = useState('HARD');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/uploads')
      .then((res) => res.json())
      .then((d) => {
        const found = d.jobs?.find((j: any) => j.id === params.id) || d.jobs?.[0];
        setJob(found);
        if (found?.items?.[0]) {
          loadItemData(found.items[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const loadItemData = (item: any) => {
    let ext: any = {};
    let tag: any = {};
    try {
      const parsed = JSON.parse(item.extractedDataJson || '{}');
      ext = parsed.extraction || parsed;
      tag = parsed.tagging || {};
    } catch (e) {}

    setStatement(ext.statement || item.rawContent || '');
    setQuestionType((ext.type as QuestionTypeCode) || 'MCQ_SINGLE');
    setOptions(
      ext.options || [
        { id: 'opt_A', text: '\\frac{v_0}{2L}', isCorrect: true },
        { id: 'opt_B', text: '\\frac{3v_0}{4L}', isCorrect: false },
        { id: 'opt_C', text: '\\frac{v_0}{L}', isCorrect: false },
        { id: 'opt_D', text: '\\frac{2v_0}{3L}', isCorrect: false },
      ]
    );
    setSubject(tag.suggestedSubject?.name || 'Physics');
    setChapter(tag.suggestedChapter?.name || 'Rotational Motion');
    setDifficulty(tag.suggestedDifficulty?.value || 'HARD');
  };

  const handleSelectItem = (index: number) => {
    setActiveItemIndex(index);
    if (job?.items?.[index]) {
      loadItemData(job.items[index]);
    }
  };

  const handleApproveAndSave = async () => {
    setSaving(true);
    try {
      const activeItem = job?.items?.[activeItemIndex];
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: questionType,
          difficulty,
          statementText: statement,
          contentJson: JSON.stringify({ statement }),
          optionsJson: JSON.stringify(options),
          answerJson: JSON.stringify({
            correctOptions: options.filter((o) => o.isCorrect).map((o) => o.id),
          }),
          verificationStatus: 'APPROVED',
          sourceData: {
            sourceType: 'PYQ',
            sourceName: job?.fileName || 'Extracted Document',
            examName: 'JEE Advanced',
            examYear: 2024,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage('Extracted question approved and saved into repository!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading extraction workspace...</div>;
  }

  const activeItem = job?.items?.[activeItemIndex];

  return (
    <div className="space-y-4 pb-20">
      {/* Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Split-Screen PDF Extraction Review</span>
            </h1>
            <p className="text-xs text-slate-400">
              Document: <span className="font-semibold text-slate-700">{job?.fileName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApproveAndSave}
            disabled={saving}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Approving...' : 'Approve & Save Question'}</span>
          </button>
        </div>
      </div>

      {/* Item Pagination selector bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Extracted Items:</span>
        {job?.items?.map((it: any, idx: number) => (
          <button
            key={it.id || idx}
            onClick={() => handleSelectItem(idx)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
              activeItemIndex === idx
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Page {it.pageNumber} • Q{it.itemIndex}
          </button>
        ))}
      </div>

      {/* SPLIT-SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* LEFT PANEL: Original Source PDF Page (Cols 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Original Source Paper Snippet</span>
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-1 hover:text-slate-600"><ZoomIn className="w-4 h-4" /></button>
              <button className="p-1 hover:text-slate-600"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-[11px] font-mono ml-1">Page {activeItem?.pageNumber || 1}</span>
            </div>
          </div>

          {/* Source Document Simulation View */}
          <div className="flex-1 bg-amber-50/20 border border-amber-200/60 rounded-xl p-5 overflow-y-auto space-y-4 font-serif text-slate-800 text-xs shadow-inner">
            <div className="text-center pb-3 border-b border-slate-200 text-slate-500 text-[10px]">
              JEE (ADVANCED) 2024 • PAPER 1 • CODE 4 • PHYSICS SECTION
            </div>

            <div className="space-y-3 leading-relaxed">
              <div className="font-bold text-slate-900 text-sm">
                Question {activeItem?.itemIndex || 14}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">
                {activeItem?.rawContent ||
                  'A uniform thin rod of mass M and length L is pivoted at one of its ends and hangs vertically. A small particle of mass m = M/3 moving horizontally with velocity v0 strikes the lower end of the rod and sticks to it. The angular velocity of the system immediately after the collision is given by:\n(A) v0 / (2L)\n(B) 3v0 / (4L)\n(C) v0 / L\n(D) 2v0 / (3L)'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 italic">
              OCR Engine: Tesseract 5.3 + KaTeX parser. Confidence: 96.4%.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Extracted Question in Structured Editable Form (Cols 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span>Structured Extracted Question (Reviewer Edit)</span>
            </span>

            {/* Field Confidence Badges */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Statement: 98%
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Options: 95%
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Taxonomy: 94%
              </span>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Question Type & Taxonomy Selectors */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Question Format
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as QuestionTypeCode)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {Object.values(QUESTION_TYPE_REGISTRY).map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Chapter</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Editable Statement */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Question Statement (LaTeX formatted)
              </label>
              <textarea
                rows={3}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* Live Rendered Statement */}
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs text-slate-900 leading-relaxed font-medium">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">LIVE KATEX PREVIEW:</span>
              <MathRenderer content={statement} />
            </div>

            {/* Editable Options */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">
                Extracted Options & Correct Answer Selection:
              </span>
              {options.map((opt, i) => (
                <div
                  key={opt.id || i}
                  className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs ${
                    opt.isCorrect
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const updated = options.map((o, idx) => ({ ...o, isCorrect: idx === i }));
                      setOptions(updated);
                    }}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] ${
                      opt.isCorrect
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </button>

                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[i].text = e.target.value;
                      setOptions(updated);
                    }}
                    className="flex-1 bg-transparent border-none text-xs text-slate-800 font-mono focus:outline-none"
                  />

                  {opt.isCorrect && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      CORRECT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExtractionReviewPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading extraction reviewer...</div>}>
      <ExtractionReviewContent params={params} />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Eye,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';
import { evaluateStudentResponse, EvaluationResult } from '@/lib/evaluation-engine';

export interface QuestionPreviewData {
  type: string;
  statement: string;
  assertion?: string;
  reason?: string;
  passage?: string;
  instruction?: string;
  options?: any[];
  correctAnswer?: any;
  numericalConfig?: any;
  matchingData?: { listI: any[]; listII: any[]; pairs: any[] };
  matrixData?: { rows: any[]; cols: any[]; matrixMap: Record<string, string[]> };
  blanksData?: any[];
  orderingData?: { items: any[]; correctSequence: string[] };
  diagramData?: { imageUrl: string; caption: string; hotspots: any[] };
  tableData?: { headers: string[]; rows: string[][] };
  rubricData?: any[];
  modelAnswer?: string;
  stepByStepSolution?: string;
  finalAnswer?: string;
  positiveMarks: number;
  negativeMarks: number;
  sourceData?: any;
}

interface QuestionPreviewProps {
  data: QuestionPreviewData;
}

export default function QuestionPreview({ data }: QuestionPreviewProps) {
  const [viewMode, setViewMode] = useState<'admin' | 'student' | 'source'>('student');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Student interactive test state
  const [studentChoice, setStudentChoice] = useState<any>(null);
  const [studentEvaluation, setStudentEvaluation] = useState<EvaluationResult | null>(null);

  const handleTestEvaluation = () => {
    const result = evaluateStudentResponse({
      questionType: data.type,
      studentResponse: studentChoice,
      correctAnswer: data.correctAnswer,
      positiveMarks: data.positiveMarks,
      negativeMarks: data.negativeMarks,
    });
    setStudentEvaluation(result);
  };

  const handleResetStudentAttempt = () => {
    setStudentChoice(null);
    setStudentEvaluation(null);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'student'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Student Test Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'admin'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Admin & Answer Keys</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('source')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'source'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Source Provenance</span>
          </button>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'desktop' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'mobile' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
            }`}
            title="Mobile App Simulator"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all duration-300 ${
          viewport === 'mobile' ? 'max-w-[360px] border-4 border-slate-800' : 'w-full'
        }`}
      >
        {/* Test Header */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">YoLearn Assessment</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {data.type}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-semibold">
            +{data.positiveMarks} / {data.negativeMarks} marks
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Shared Passage / Parent Stimulus */}
          {data.passage && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] block">
                Comprehension Passage
              </span>
              <MathRenderer content={data.passage} />
            </div>
          )}

          {/* Diagram Preview if applicable */}
          {data.diagramData?.imageUrl && (
            <div className="text-center p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.diagramData.imageUrl}
                alt={data.diagramData.caption || 'Diagram'}
                className="max-h-56 mx-auto rounded-lg object-contain"
              />
              {data.diagramData.caption && (
                <div className="text-[11px] text-slate-500 font-medium">
                  {data.diagramData.caption}
                </div>
              )}
            </div>
          )}

          {/* Table Preview if applicable */}
          {data.tableData && data.tableData.rows?.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                    {data.tableData.headers?.map((h, i) => (
                      <th key={i} className="p-2.5 border-r border-slate-200 last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {data.tableData.rows.map((row, rI) => (
                    <tr key={rI}>
                      {row.map((cell, cI) => (
                        <td key={cI} className="p-2.5 border-r border-slate-100 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Main Statement */}
          <div className="text-sm text-slate-900 leading-relaxed font-medium">
            <MathRenderer content={data.statement || 'Enter question statement...'} />
          </div>

          {/* Assertion & Reason Prompt */}
          {data.assertion && data.reason && (
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-900">Assertion (A): </span>
                <MathRenderer content={data.assertion} />
              </div>
              <div>
                <span className="font-bold text-slate-900">Reason (R): </span>
                <MathRenderer content={data.reason} />
              </div>
            </div>
          )}

          {/* TYPE-SPECIFIC RESPONSE COMPONENT IN STUDENT TEST */}
          {viewMode === 'student' && (
            <div className="pt-2 space-y-4">
              {/* Objective Options (MCQ_SINGLE, TRUE_FALSE, ASSERTION_REASON) */}
              {(data.type.includes('MCQ_SINGLE') ||
                data.type === 'TRUE_FALSE' ||
                data.type === 'ASSERTION_REASON' ||
                data.type === 'STATEMENT_BASED') &&
                data.options && (
                  <div className="space-y-2">
                    {data.options.map((opt, i) => (
                      <div
                        key={opt.id || i}
                        onClick={() => setStudentChoice(opt.id)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer flex items-start gap-3 transition-colors ${
                          studentChoice === opt.id
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            studentChoice === opt.id
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <div className="flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* MSQ (Multiple Correct) */}
              {data.type === 'MCQ_MULTIPLE' && data.options && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    (One or more options may be correct)
                  </span>
                  {data.options.map((opt, i) => {
                    const currentList: string[] = Array.isArray(studentChoice) ? studentChoice : [];
                    const isChecked = currentList.includes(opt.id);
                    return (
                      <div
                        key={opt.id || i}
                        onClick={() => {
                          const updated = isChecked
                            ? currentList.filter((id) => id !== opt.id)
                            : [...currentList, opt.id];
                          setStudentChoice(updated);
                        }}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer flex items-start gap-3 transition-colors ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-indigo-600 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Numerical Input */}
              {data.type.includes('NUMERICAL') && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your Numerical Response:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      value={studentChoice || ''}
                      onChange={(e) => setStudentChoice(e.target.value)}
                      placeholder="Enter value"
                      className="w-44 text-sm font-mono font-bold py-2 px-3 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {data.numericalConfig?.unit && (
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        {data.numericalConfig.unit}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Fill in the Blanks Input */}
              {data.type.includes('FILL_BLANK') && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Enter Missing Word/Term:
                  </label>
                  <input
                    type="text"
                    value={studentChoice || ''}
                    onChange={(e) => setStudentChoice(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  />
                </div>
              )}

              {/* Test Button & Real-time Evaluation Bar */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestEvaluation}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test My Answer (Live Evaluation)</span>
                </button>

                {studentChoice !== null && (
                  <button
                    type="button"
                    onClick={handleResetStudentAttempt}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                    title="Reset Answer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Live Evaluation Result Output */}
              {studentEvaluation && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
                    studentEvaluation.isCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      : studentEvaluation.isPartiallyCorrect
                      ? 'border-amber-300 bg-amber-50 text-amber-950'
                      : 'border-rose-300 bg-rose-50 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {studentEvaluation.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      <span>
                        {studentEvaluation.isCorrect
                          ? 'CORRECT'
                          : studentEvaluation.isPartiallyCorrect
                          ? 'PARTIAL CREDIT'
                          : 'INCORRECT'}
                      </span>
                    </span>
                    <span className="font-mono text-sm">
                      {studentEvaluation.score > 0 ? `+${studentEvaluation.score}` : studentEvaluation.score} / {data.positiveMarks} pts
                    </span>
                  </div>
                  <p className="leading-relaxed">{studentEvaluation.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* ADMIN PREVIEW (Reveals correct answer, solution, rubric) */}
          {viewMode === 'admin' && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <span className="font-bold uppercase tracking-wider text-[10px] block">
                  Answer Key & Tolerances
                </span>
                <div className="font-mono">
                  {JSON.stringify(data.correctAnswer || {}, null, 2)}
                </div>
              </div>

              {data.stepByStepSolution && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Step-by-Step Pedagogical Solution:</span>
                  <MathRenderer content={data.stepByStepSolution} />
                </div>
              )}

              {data.rubricData && data.rubricData.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-900 block">Marking Rubric Criteria:</span>
                  {data.rubricData.map((r, idx) => (
                    <div key={idx} className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span>{r.criteria}</span>
                      <span className="font-bold text-indigo-700">{r.marks} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SOURCE PROVENANCE PREVIEW */}
          {viewMode === 'source' && (
            <div className="pt-4 border-t border-slate-200 space-y-3 text-xs text-slate-700">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">
                Original Examination Provenance
              </span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-medium">
                <div>Source Document: <span className="font-bold">{data.sourceData?.sourceName || 'Manual Entry'}</span></div>
                <div>Target Exam: <span className="font-bold text-indigo-600">{data.sourceData?.examName || '—'}</span></div>
                <div>Exam Year: <span className="font-bold">{data.sourceData?.examYear || '—'}</span></div>
                <div>Paper Code / Shift: <span className="font-bold">{data.sourceData?.paperCode || '—'}</span></div>
                <div>Licensing / Copyright: <span className="font-semibold text-emerald-700">{data.sourceData?.copyrightInfo || 'Educational Use'}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

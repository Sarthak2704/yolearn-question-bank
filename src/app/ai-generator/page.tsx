'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  Save,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export default function AiGeneratorPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Rotational Motion');
  const [topic, setTopic] = useState('Moment of Inertia');
  const [type, setType] = useState('MCQ');
  const [difficulty, setDifficulty] = useState('HARD');
  const [exam, setExam] = useState('JEE Advanced');

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<any | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, chapter, topic, type, difficulty, exam }),
      });
      const data = await res.json();
      setGeneratedQuestion(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToBank = async () => {
    if (!generatedQuestion) return;
    setSaving(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: generatedQuestion.type,
          difficulty: generatedQuestion.difficulty,
          cognitiveLevel: generatedQuestion.cognitiveLevel,
          questionNature: generatedQuestion.questionNature,
          questionStyle: generatedQuestion.questionStyle,
          positiveMarks: 4.0,
          negativeMarks: -1.0,
          statementText: generatedQuestion.statement,
          contentJson: JSON.stringify({ statement: generatedQuestion.statement }),
          optionsJson: JSON.stringify(generatedQuestion.options),
          answerJson: JSON.stringify(generatedQuestion.answer),
          solutionJson: JSON.stringify(generatedQuestion.solution),
          verificationStatus: 'PENDING_REVIEW',
          sourceData: {
            sourceType: 'AI_GENERATED',
            sourceName: `AI Synthesized (${exam})`,
            examName: exam,
            examYear: 2025,
          },
        }),
      });

      const d = await res.json();
      if (d.success) {
        router.push(`/questions/${d.question.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>AI Question Generator</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Synthesize examination-grade questions with KaTeX LaTeX formulas, distractor options, and confidence scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Configuration */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
        >
          <h2 className="text-sm font-bold text-slate-900">Syllabus & Generation Parameters</h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chapter</label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Rotational Motion"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Topic / Concept</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Conservation of Angular Momentum"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Exam</label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="NEET">NEET-UG</option>
                  <option value="CBSE Class 12">CBSE Board</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="VERY_HARD">Very Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Format</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="MCQ">MCQ (Single Correct)</option>
                <option value="MSQ">MSQ (Multiple Correct)</option>
                <option value="NUMERICAL">Numerical Answer</option>
                <option value="ASSERTION_REASON">Assertion & Reason</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{generating ? 'Synthesizing with AI...' : 'Generate Educational Question'}</span>
          </button>
        </form>

        {/* Right Area: Generated Question Preview */}
        <div className="lg:col-span-7 space-y-4">
          {generatedQuestion ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600">
                    {generatedQuestion.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                    AI SYNTHESIZED
                  </span>
                </div>

                {/* Confidence Scores Card */}
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Confidence:{' '}
                    {Math.round(
                      (generatedQuestion.confidenceScores?.academicRelevance || 0.95) * 100
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* Statement */}
              <div className="text-sm text-slate-900 leading-relaxed font-medium">
                <MathRenderer content={generatedQuestion.statement} />
              </div>

              {/* Options */}
              {generatedQuestion.options && (
                <div className="space-y-2 pt-2">
                  {generatedQuestion.options.map((opt: any, idx: number) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                        opt.isCorrect
                          ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-medium'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-slate-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <div className="flex-1">
                        <MathRenderer content={opt.text} />
                        {opt.explanation && (
                          <div className="text-[10px] text-emerald-700 mt-1 italic">
                            {opt.explanation}
                          </div>
                        )}
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Solution */}
              {generatedQuestion.solution && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">AI Generated Solution:</span>
                  <MathRenderer content={generatedQuestion.solution.stepByStep} />
                </div>
              )}

              {/* Save to Question Bank */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSaveToBank}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Adding to Bank...' : 'Approve & Save to Repository'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-semibold text-slate-700">No question generated yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select your syllabus parameters on the left and click &quot;Generate Educational Question&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

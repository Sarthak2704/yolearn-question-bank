'use client';

import React from 'react';
import Link from 'next/link';
import {
  ListFilter,
  CheckCircle2,
  FileText,
  Calculator,
  GitCompare,
  HelpCircle,
  BarChart,
  Eye,
  Plus,
} from 'lucide-react';

export default function QuestionTypesPage() {
  const categories = [
    {
      category: 'OBJECTIVE',
      description: 'Discrete choice options with unambiguous keys',
      types: [
        { name: 'MCQ (Single Correct)', code: 'MCQ', desc: 'Standard single-choice question with 4 options and 1 correct answer', defaultMarks: '+4 / -1' },
        { name: 'MSQ (Multiple Correct)', code: 'MSQ', desc: 'Multiple options may be correct (JEE Advanced format with partial marking)', defaultMarks: '+4 / -2' },
        { name: 'True / False', code: 'TRUE_FALSE', desc: 'Binary verification statement', defaultMarks: '+2 / -0.5' },
      ],
    },
    {
      category: 'NUMERICAL & QUANTITATIVE',
      description: 'Direct numerical responses without multiple-choice options',
      types: [
        { name: 'Numerical Answer Type', code: 'NUMERICAL', desc: 'Floating point value with configurable decimal tolerance', defaultMarks: '+4 / 0' },
        { name: 'Integer Type', code: 'INTEGER', desc: 'Non-negative single or double digit integer value [0-9 or 00-99]', defaultMarks: '+3 / 0' },
        { name: 'Range Based Answer', code: 'RANGE', desc: 'Acceptable interval [min, max] for experimental and physical measurements', defaultMarks: '+4 / 0' },
      ],
    },
    {
      category: 'MATCHING & CORRELATION',
      description: 'Relational column correlations',
      types: [
        { name: 'Match the Following', code: 'MATCH_THE_FOLLOWING', desc: 'List I paired with List II elements with composite code options', defaultMarks: '+4 / -1' },
        { name: 'Matrix Match', code: 'MATRIX_MATCH', desc: 'Rows [A, B, C, D] mapped to multiple column keys (p, q, r, s, t)', defaultMarks: '+8 / -2' },
      ],
    },
    {
      category: 'REASONING & LOGICAL',
      description: 'Cognitive inference, assertion-reasoning, and statement evaluation',
      types: [
        { name: 'Assertion and Reason', code: 'ASSERTION_REASON', desc: 'Evaluation of statement truth and causal relationship', defaultMarks: '+4 / -1' },
        { name: 'Statement Based', code: 'STATEMENT_BASED', desc: 'Statement I and Statement II evaluation', defaultMarks: '+4 / -1' },
      ],
    },
    {
      category: 'COMPREHENSION & CASE-BASED',
      description: 'Contextual parent stimulus with linked multi-question assessments',
      types: [
        { name: 'Passage Based', code: 'PASSAGE_BASED', desc: 'Scientific or educational reading passage with 2-4 child questions', defaultMarks: '+3 / -1' },
        { name: 'Case Based Study', code: 'CASE_BASED', desc: 'Real-world scenario with data analysis questions (CBSE Board format)', defaultMarks: '+4 / 0' },
      ],
    },
    {
      category: 'SUBJECTIVE & DESCRIPTIVE',
      description: 'Free-form answers evaluated against structured rubrics',
      types: [
        { name: 'Short Answer (SA)', code: 'SHORT', desc: '30-50 words conceptual answer', defaultMarks: '+3 / 0' },
        { name: 'Long Answer (LA)', code: 'LONG', desc: 'Derivation, proof, or multi-step problem with 4-part marking rubric', defaultMarks: '+5 / 0' },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-indigo-600" />
            <span>Question Type Specification & Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Supported examination question formats across K-12, CBSE, JEE Main, JEE Advanced, NEET, and CUET.
          </p>
        </div>

        <Link
          href="/questions/create"
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Question</span>
        </Link>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900">{cat.category}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.types.map((t) => (
                <div
                  key={t.code}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2 text-xs hover:border-indigo-200 hover:bg-indigo-50/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{t.name}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {t.defaultMarks}
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{t.desc}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400">{t.code}</span>
                    <Link
                      href={`/questions?type=${t.code}`}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Filter Repository →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

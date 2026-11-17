'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  AlertTriangle,
  BookOpen,
  Share2,
  Copy,
  Layers,
  Sparkles,
  ShieldCheck,
  Tag,
  Monitor,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'versions' | 'reviews' | 'duplicates'>('details');

  // Review action modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | 'REQUEST_CHANGES'>('APPROVE');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewChecklist, setReviewChecklist] = useState({
    statementVerified: true,
    answerVerified: true,
    solutionVerified: true,
    latexVerified: true,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchQuestion = () => {
    fetch(`/api/questions/${params.id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleReviewSubmit = async () => {
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/reviews/${params.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: reviewAction,
          comment: reviewComment,
          checklist: reviewChecklist,
          reviewerName: 'Dr. Rajesh Verma (SME)',
          reviewerRole: 'SME',
        }),
      });
      const d = await res.json();
      if (d.success) {
        setShowReviewModal(false);
        fetchQuestion();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading question specifications...</span>
      </div>
    );
  }

  const q = data?.question;
  if (!q) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Question not found</h2>
        <Link href="/questions" className="text-sm text-indigo-600 hover:underline">
          Return to repository
        </Link>
      </div>
    );
  }

  const primaryTax = q.taxonomyMappings?.[0];
  let content: any = {};
  let options: any[] = [];
  let answer: any = {};
  let solution: any = {};

  try {
    content = JSON.parse(q.contentJson || '{}');
  } catch (e) {}

  try {
    options = JSON.parse(q.optionsJson || '[]');
  } catch (e) {}

  try {
    answer = JSON.parse(q.answerJson || '{}');
  } catch (e) {}

  try {
    solution = JSON.parse(q.solutionJson || '{}');
  } catch (e) {}

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/questions"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-indigo-600">{q.code}</h1>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  q.verificationStatus === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : q.verificationStatus === 'PENDING_REVIEW'
                    ? 'bg-amber-100 text-amber-800'
                    : q.verificationStatus === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {q.verificationStatus}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                {q.type}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Created on {new Date(q.createdAt).toLocaleDateString()} • UUID: {q.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setReviewAction('APPROVE');
              setShowReviewModal(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SME Review</span>
          </button>
          <Link
            href={`/questions/create?editId=${q.id}`}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Question</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'details'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Question & Solution
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'versions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Version History ({q.versions?.length || 1})</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SME Verification ({q.reviews?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'duplicates'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Duplicates ({data?.duplicates?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Question Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Display (Cols 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Parent Group / Shared Passage if applicable */}
            {q.parentGroup && (
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Shared Comprehension Passage
                </span>
                <h3 className="text-sm font-bold text-slate-900">{q.parentGroup.title}</h3>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <MathRenderer content={q.parentGroup.sharedPassage} />
                </div>
              </div>
            )}

            {/* Question Statement Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Statement</span>
                <span>+{q.positiveMarks} / {q.negativeMarks} marks</span>
              </div>

              <div className="text-sm font-medium text-slate-900 leading-relaxed">
                <MathRenderer content={q.statementText} />
              </div>

              {/* Assertion & Reason rendering */}
              {q.type === 'ASSERTION_REASON' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Assertion (A): </span>
                    <MathRenderer content={content.assertion || '—'} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Reason (R): </span>
                    <MathRenderer content={content.reason || '—'} />
                  </div>
                </div>
              )}

              {/* Options Rendering */}
              {options.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  {options.map((opt, i) => (
                    <div
                      key={opt.id || i}
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                        opt.isCorrect
                          ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950 font-medium'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="flex-1">
                        <MathRenderer content={opt.text} />
                        {opt.explanation && (
                          <div className="text-[11px] text-emerald-700 mt-1 italic">
                            {opt.explanation}
                          </div>
                        )}
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Correct Option
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Match the following rendering */}
              {q.type === 'MATCH_THE_FOLLOWING' && content.listI && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">List I</h4>
                    <div className="space-y-2">
                      {content.listI.map((item: any) => (
                        <div key={item.key} className="flex gap-2">
                          <span className="font-bold">{item.key}.</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">List II</h4>
                    <div className="space-y-2">
                      {content.listII.map((item: any) => (
                        <div key={item.key} className="flex gap-2">
                          <span className="font-bold">{item.key}.</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solution & Pedagogical Explanation */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Complete Solution & Explanation</span>
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                <MathRenderer content={solution.stepByStep || 'No step-by-step solution provided.'} />
              </div>

              {solution.finalAnswer && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                  {solution.finalAnswer}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Taxonomy, Metadata, Source (Cols 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Academic Taxonomy Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic Mapping
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Segment:</span>
                  <span className="font-semibold text-slate-800">
                    {primaryTax?.educationSegment?.name || 'Competitive Exams'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Target Exam:</span>
                  <span className="font-semibold text-indigo-600">
                    {primaryTax?.exam?.name || primaryTax?.board?.name || 'JEE Advanced'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-semibold text-slate-800">
                    {primaryTax?.subject?.name || 'Physics'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Chapter:</span>
                  <span className="font-semibold text-slate-800">
                    {primaryTax?.chapter?.name || 'Rotational Motion'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Topic:</span>
                  <span className="font-medium text-slate-700">
                    {primaryTax?.topic?.name || 'Moment of Inertia'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Subtopic:</span>
                  <span className="font-medium text-slate-700">
                    {primaryTax?.subtopic?.name || 'Parallel Axis Theorem'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Class:</span>
                  <span className="font-semibold text-slate-800">
                    {primaryTax?.class?.name || 'Class 11'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cognitive & Question Metadata */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question Metadata
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">DIFFICULTY</span>
                  <span className="font-bold text-slate-800">{q.difficulty}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">BLOOM LEVEL</span>
                  <span className="font-bold text-slate-800">{q.cognitiveLevel}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">NATURE</span>
                  <span className="font-bold text-slate-800">{q.questionNature}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">STYLE</span>
                  <span className="font-bold text-slate-800">{q.questionStyle}</span>
                </div>
              </div>
            </div>

            {/* Source Provenance Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Source & Provenance
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400">Source: </span>
                  <span className="font-semibold">{q.source?.sourceName || 'Manual Entry'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Exam: </span>
                  <span>{q.source?.examName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Year: </span>
                  <span>{q.source?.examYear || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Shift / Paper: </span>
                  <span>{q.source?.shift || q.source?.paperCode || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Copyright Status: </span>
                  <span className="text-emerald-700 font-medium">
                    {q.source?.copyrightInfo || 'Educational Use'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Version History */}
      {activeTab === 'versions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Question Version History</h3>
          <div className="divide-y divide-slate-100">
            {q.versions?.map((v: any) => (
              <div key={v.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                      Version {v.versionNumber}
                    </span>
                    <span className="font-semibold text-slate-700">{v.changedBy}</span>
                  </div>
                  <span className="text-slate-400">{new Date(v.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-800 mb-1">Reason for revision:</div>
                  <div>{v.changeReason || 'No reason provided'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: SME Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Subject Matter Expert (SME) Reviews</h3>
            <button
              onClick={() => {
                setReviewAction('APPROVE');
                setShowReviewModal(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              + Submit Review Decision
            </button>
          </div>

          <div className="space-y-3">
            {q.reviews?.map((r: any) => (
              <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        r.action === 'APPROVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.action === 'REJECT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.action}
                    </span>
                    <span className="font-bold text-slate-800">{r.reviewerName}</span>
                    <span className="text-slate-400">({r.reviewerRole})</span>
                  </div>
                  <span className="text-slate-400">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-slate-700 leading-relaxed">{r.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Duplicates */}
      {activeTab === 'duplicates' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Duplicate Question Matches</h3>
          {data?.duplicates?.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">
              No duplicate questions detected for this entry.
            </div>
          ) : (
            data.duplicates.map((dup: any) => (
              <div key={dup.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800">
                    Similarity Score: {Math.round(dup.similarityScore * 100)}% ({dup.matchType})
                  </span>
                  <span className="text-slate-500">Status: {dup.status}</span>
                </div>
                <div className="text-slate-700">{dup.resolutionNotes}</div>
                <Link
                  href="/duplicates"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline pt-1"
                >
                  <span>Resolve in Duplicate Management</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* SME Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Submit SME Verification Decision</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewAction('APPROVE')}
                    className={`py-2 px-3 rounded-lg font-semibold border ${
                      reviewAction === 'APPROVE'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('REQUEST_CHANGES')}
                    className={`py-2 px-3 rounded-lg font-semibold border ${
                      reviewAction === 'REQUEST_CHANGES'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Request Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('REJECT')}
                    className={`py-2 px-3 rounded-lg font-semibold border ${
                      reviewAction === 'REJECT'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* SME Verification Checklist */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="font-semibold text-slate-800 block">SME Checklist</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewChecklist.statementVerified}
                    onChange={(e) =>
                      setReviewChecklist({ ...reviewChecklist, statementVerified: e.target.checked })
                    }
                  />
                  <span>Question statement is accurate and unambiguous</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewChecklist.answerVerified}
                    onChange={(e) =>
                      setReviewChecklist({ ...reviewChecklist, answerVerified: e.target.checked })
                    }
                  />
                  <span>Correct option and numerical answer verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewChecklist.latexVerified}
                    onChange={(e) =>
                      setReviewChecklist({ ...reviewChecklist, latexVerified: e.target.checked })
                    }
                  />
                  <span>LaTeX mathematical equations render cleanly</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feedback / Comments</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Enter detailed pedagogical review notes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={submittingReview}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                {submittingReview ? 'Submitting...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

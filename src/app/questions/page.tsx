'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  MoreVertical,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Archive,
  Eye,
  Edit3,
  RefreshCw,
  Plus,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

function QuestionsRepositoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  // Taxonomy options
  const [taxonomies, setTaxonomies] = useState<any>({ subjects: [], exams: [] });

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedType) params.set('type', selectedType);
      if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
      if (selectedStatus) params.set('verificationStatus', selectedStatus);
      if (selectedSubject) params.set('subjectId', selectedSubject);
      if (selectedExam) params.set('examId', selectedExam);
      params.set('page', String(pagination.page));

      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();
      setQuestions(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load taxonomy options
    fetch('/api/taxonomy')
      .then((res) => res.json())
      .then((d) => setTaxonomies(d))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, selectedType, selectedDifficulty, selectedStatus, selectedSubject, selectedExam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchQuestions();
  };

  const handleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: string, payload?: any) => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await fetch('/api/questions/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, questionIds: selectedIds, payload }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully performed ${action} on ${selectedIds.length} question(s).`);
        setSelectedIds([]);
        fetchQuestions();
      }
    } catch (err) {
      console.error(err);
      showToast('Error performing bulk action.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const exportSelected = () => {
    const selectedQuestions = questions.filter((q) => selectedIds.includes(q.id));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedQuestions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `YoLearn_Questions_Export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${selectedQuestions.length} questions as JSON.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Central Question Repository
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search, filter, edit, and organize all academic items in the YoLearn repository.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500 rotate-180" />
            <span>Bulk Ingestion</span>
          </Link>
          <Link
            href="/questions/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Question</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by statement, question code (QB-PHY-000001), chapter, source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 border-t border-slate-100">
          {/* Question Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Question Types</option>
            <option value="MCQ">MCQ (Single Correct)</option>
            <option value="MSQ">MSQ (Multiple Correct)</option>
            <option value="NUMERICAL">Numerical</option>
            <option value="MATCH_THE_FOLLOWING">Match the Following</option>
            <option value="ASSERTION_REASON">Assertion & Reason</option>
            <option value="SUBJECTIVE">Subjective</option>
            <option value="PASSAGE_BASED">Passage Based</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Difficulties</option>
            <option value="VERY_EASY">Very Easy</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
            <option value="VERY_HARD">Very Hard</option>
          </select>

          {/* Verification Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="DRAFT">Draft</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {taxonomies.subjects?.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Exam Filter */}
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Exams / Boards</option>
            {taxonomies.exams?.map((ex: any) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch('');
              setSelectedType('');
              setSelectedDifficulty('');
              setSelectedStatus('');
              setSelectedSubject('');
              setSelectedExam('');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-full text-xs py-2 px-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-900 text-white rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-5 h-5 rounded-full bg-indigo-700 flex items-center justify-center text-[11px]">
              {selectedIds.length}
            </span>
            <span>questions selected for bulk processing</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkAction('APPROVE')}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => handleBulkAction('REJECT')}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => handleBulkAction('ARCHIVE')}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>
            <button
              onClick={exportSelected}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-700 hover:bg-indigo-600 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Repository Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.length === questions.length && questions.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Question ID & Code</th>
                <th className="py-3 px-3 min-w-[280px]">Question Preview</th>
                <th className="py-3 px-3">Subject / Chapter</th>
                <th className="py-3 px-3">Exam / Board</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                    Loading questions from database...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">No questions match your criteria</p>
                      <p className="text-xs text-slate-400">Try clearing filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                questions.map((q) => {
                  const isSelected = selectedIds.includes(q.id);
                  const primaryTax = q.taxonomyMappings?.[0];

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => handleToggleSelect(q.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                        <Link href={`/questions/${q.id}`} className="hover:underline">
                          {q.code}
                        </Link>
                      </td>

                      <td className="py-3 px-3 font-normal text-slate-800 max-w-md">
                        <Link
                          href={`/questions/${q.id}`}
                          className="hover:text-indigo-600 line-clamp-2 leading-relaxed"
                        >
                          <MathRenderer content={q.statementText} />
                        </Link>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-700">
                          {primaryTax?.subject?.name || 'General'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {primaryTax?.chapter?.name || '—'}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-700">
                          {primaryTax?.exam?.name || primaryTax?.board?.name || '—'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {primaryTax?.class?.name || 'Class 12'}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {q.type}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.difficulty === 'HARD' || q.difficulty === 'VERY_HARD'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : q.difficulty === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        <div className="text-xs truncate max-w-[120px] font-medium">
                          {q.source?.sourceName || 'Manual Entry'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {q.source?.examYear ? `Year ${q.source.examYear}` : q.source?.sourceType || 'MANUAL'}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
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
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/questions/${q.id}`}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            title="View Question Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/questions/create?editId=${q.id}`}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            title="Edit Question"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold">{questions.length}</span> of{' '}
            <span className="font-semibold">{pagination.total}</span> questions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 font-medium"
            >
              Previous
            </button>
            <span className="font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionsRepositoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading repository...</div>}>
      <QuestionsRepositoryContent />
    </Suspense>
  );
}

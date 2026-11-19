'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ArrowRight,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
} from 'lucide-react';

interface BookItem {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  curriculum: string;
  grade: number;
  publisher?: string;
  academicYear?: string;
  edition?: string;
  status: string;
  verificationLevel: string;
  processingProgress: number;
  currentStage?: string;
  totalPages: number;
  totalChapters: number;
  totalTopics: number;
  coverUrl?: string;
  subject?: { id: string; name: string; code: string };
  chapters?: Array<{ id: string; chapterNumber: number; title: string; status: string }>;
  _count?: { chapters: number; questionMappings: number; shortsMappings: number };
}

export default function BooksPage() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCurriculum !== 'ALL') params.set('curriculum', selectedCurriculum);
      if (selectedGrade !== 'ALL') params.set('grade', selectedGrade);
      if (selectedStatus !== 'ALL') params.set('status', selectedStatus);

      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBooks(data.books);
      }
    } catch (e) {
      console.error('Failed to load books:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedCurriculum, selectedGrade, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  // Metrics
  const totalBooks = books.length;
  const processingBooks = books.filter((b) => b.status === 'PROCESSING').length;
  const pendingReview = books.filter((b) =>
    ['EXTRACTION_COMPLETED', 'PENDING_REVIEW', 'UNDER_REVIEW'].includes(b.status)
  ).length;
  const verifiedBooks = books.filter((b) => ['VERIFIED', 'APPROVED', 'PUBLISHED'].includes(b.status)).length;

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Unified CMS • Vertical 1</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Physical Book Ingestion & Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Ingest curriculum textbooks, extract structured chapters & formulas via OCR, and verify academic mapping.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBooks}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh Books"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/books/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest New Book (PDF)</span>
            </Link>
          </div>
        </div>

        {/* Operational KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalBooks}</div>
              <div className="text-xs text-slate-500">Total Books Ingested</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{pendingReview}</div>
              <div className="text-xs text-slate-500">Pending Human Review</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{verifiedBooks}</div>
              <div className="text-xs text-slate-500">Verified & Published</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {books.reduce((acc, b) => acc + (b.totalChapters || 0), 0)}
              </div>
              <div className="text-xs text-slate-500">Structured Chapters</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by book title, code (e.g. jesc1, keph1), publisher, chapter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
            </form>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Curricula</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="NCERT">NCERT</option>
                <option value="STATE_BOARD">State Boards</option>
              </select>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="EXTRACTION_COMPLETED">Extraction Completed</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Book Catalog List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading ingested books...</div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No books found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Start by uploading your first curriculum textbook PDF and configure chapter splits.
            </p>
            <Link
              href="/books/upload"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Book</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => {
              const isVerified = ['VERIFIED', 'APPROVED', 'PUBLISHED'].includes(book.status);
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header Banner */}
                    <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-md bg-emerald-100/80 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-inner">
                          {book.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                              {book.curriculum} • Grade {book.grade}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {book.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm mt-1 leading-snug line-clamp-1">
                            {book.title}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {book.subject?.name || 'General Subject'} • {book.publisher || 'NCERT'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Book Metadata Details */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="block text-slate-400 text-[10px] font-semibold uppercase">Pages</span>
                          <span className="font-bold text-slate-800">{book.totalPages || 45}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] font-semibold uppercase">Chapters</span>
                          <span className="font-bold text-slate-800">{book._count?.chapters || book.totalChapters || 1}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] font-semibold uppercase">QB Links</span>
                          <span className="font-bold text-indigo-600">{book._count?.questionMappings || 0}</span>
                        </div>
                      </div>

                      {/* Chapter Preview List */}
                      {book.chapters && book.chapters.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Extracted Chapters
                          </span>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {book.chapters.slice(0, 3).map((ch) => (
                              <div
                                key={ch.id}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 text-slate-700"
                              >
                                <span className="truncate">
                                  Ch.{ch.chapterNumber}: {ch.title}
                                </span>
                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {ch.status}
                                </span>
                              </div>
                            ))}
                            {book.chapters.length > 3 && (
                              <span className="text-[10px] text-slate-400 block px-1">
                                +{book.chapters.length - 3} more chapters extracted
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Level: {book.verificationLevel}
                    </span>

                    <Link
                      href={`/books/${book.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <span>Review Content</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}

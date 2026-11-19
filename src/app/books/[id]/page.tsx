'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MathRenderer from '@/components/math/MathRenderer';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit3,
  RefreshCw,
  Sparkles,
  Network,
  Share2,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  X,
  Plus,
} from 'lucide-react';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [selectedPageNumber, setSelectedPageNumber] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Taxonomy mapping modal state
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [centralTopics, setCentralTopics] = useState<any[]>([]);
  const [selectedCentralTopicId, setSelectedCentralTopicId] = useState('');
  const [mappingSuccess, setMappingSuccess] = useState<string | null>(null);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/books/${bookId}`);
      const data = await res.json();
      if (data.success && data.book) {
        setBook(data.book);
        if (data.book.chapters?.[0]?.pages?.[0]?.pageNumber) {
          setSelectedPageNumber(data.book.chapters[0].pages[0].pageNumber);
        } else if (data.book.chapters?.[0]?.pageStart) {
          setSelectedPageNumber(data.book.chapters[0].pageStart);
        }
      }
    } catch (e) {
      console.error('Failed to load book detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  // Load central topics for mapping
  useEffect(() => {
    async function loadTaxonomy() {
      try {
        const res = await fetch('/api/taxonomy');
        const data = await res.json();
        if (data.success && data.topics) {
          setCentralTopics(data.topics);
        }
      } catch (e) {
        console.error('Failed to load taxonomy:', e);
      }
    }
    loadTaxonomy();
  }, []);

  const handleVerify = async (level: 'BOOK' | 'CHAPTER' | 'TOPIC' | 'PAGE', targetId?: string, status: string = 'VERIFIED') => {
    try {
      setIsVerifying(true);
      const res = await fetch(`/api/books/${bookId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          targetId,
          status,
          reviewerName: 'Dr. Priya Sharma (SME Reviewer)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBook();
      }
    } catch (e) {
      console.error('Verification failed:', e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMapToTaxonomy = async (bookTopicId: string) => {
    if (!selectedCentralTopicId) return;
    try {
      const res = await fetch(`/api/books/${bookId}/map`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTopicId,
          centralTopicId: selectedCentralTopicId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMappingSuccess(`Topic mapped to Central Taxonomy!`);
        setTimeout(() => setMappingSuccess(null), 3000);
        setShowMappingModal(false);
        await fetchBook();
      }
    } catch (e) {
      console.error('Mapping failed:', e);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">Loading structured book content...</div>
    );
  }

  if (!book) {
    return (
      <div className="p-12 text-center text-slate-400">Book not found.</div>
    );
  }

  const activeChapter = book.chapters?.[activeChapterIndex] || null;
  const activeTopic = activeChapter?.topics?.[activeTopicIndex] || null;
  const activePage = activeChapter?.pages?.find((p: any) => p.pageNumber === selectedPageNumber) || null;

  // Parse structured blocks from topic
  let contentBlocks: any[] = [];
  if (activeTopic?.contentBlocksJson) {
    try {
      contentBlocks = JSON.parse(activeTopic.contentBlocksJson);
    } catch (e) {
      contentBlocks = [];
    }
  }

  return (
    <div className="space-y-4 pb-12">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/books"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {book.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {book.curriculum} • Grade {book.grade} • {book.subject?.name || 'Science'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {book.status}
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
                {book.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVerify('BOOK', undefined, 'VERIFIED')}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Entire Book</span>
            </button>
            <button
              onClick={() => handleVerify('BOOK', undefined, 'PUBLISHED')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish to CMS DB</span>
            </button>
          </div>
        </div>

        {mappingSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mappingSuccess}</span>
          </div>
        )}

        {/* Chapter Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          {book.chapters?.map((ch: any, idx: number) => {
            const isSelected = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setActiveTopicIndex(0);
                  setSelectedPageNumber(ch.pageStart);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Ch.{ch.chapterNumber}: {ch.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-slate-700 text-emerald-400' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  p.{ch.pageStart}-{ch.pageEnd}
                </span>
              </button>
            );
          })}
        </div>

        {/* SPLIT-SCREEN REVIEW INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
          {/* LEFT PANE: ORIGINAL PDF PAGE PREVIEW (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {/* Viewer Header */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">Original PDF Source Page</span>
              </div>

              {/* Page Selector & Zoom */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs">
                  <button
                    onClick={() => setSelectedPageNumber((p) => Math.max(1, p - 1))}
                    className="p-1 hover:text-slate-900 text-slate-400"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="font-mono font-medium text-slate-700 px-1">
                    Page {selectedPageNumber}
                  </span>
                  <button
                    onClick={() => setSelectedPageNumber((p) => p + 1)}
                    className="p-1 hover:text-slate-900 text-slate-400"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Page Canvas / Image Viewer */}
            <div className="flex-1 p-4 bg-slate-100/60 overflow-y-auto flex flex-col items-center justify-center">
              {activePage?.imageUrl ? (
                <div
                  className="bg-white rounded shadow-md border border-slate-200 transition-all p-2 max-w-full"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <img
                    src={activePage.imageUrl}
                    alt={`Original PDF Page ${selectedPageNumber}`}
                    className="max-h-[500px] w-auto object-contain rounded"
                  />
                  <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 font-mono">
                    <span className="font-semibold block text-slate-400 uppercase text-[9px]">
                      Raw OCR Extracted Stream (Page {selectedPageNumber})
                    </span>
                    {activePage.rawText || 'Activity 1.4: Chemical reaction and equation demonstration with quick lime.'}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-slate-200 shadow-sm max-w-xs">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    Page {selectedPageNumber} High-Res Scan
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Extracted from book PDF ({book.pdfUrl ? 'Indexed from S3' : 'Local Archive'})
                  </span>
                  <div className="mt-4 p-2.5 bg-slate-50 rounded text-left font-mono text-[11px] text-slate-600 border border-slate-100">
                    {activeChapter?.introduction?.slice(0, 160)}...
                  </div>
                </div>
              )}
            </div>

            {/* Page Verification Footer */}
            <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                OCR Confidence: <strong className="text-emerald-600 font-mono">98.4%</strong>
              </span>
              <button
                onClick={() => handleVerify('PAGE', activePage?.id, 'VERIFIED')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded font-semibold text-[11px] transition-colors"
              >
                Mark Page Verified
              </button>
            </div>
          </div>

          {/* RIGHT PANE: STRUCTURED EXTRACTED CONTENT & EDITOR (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Extracted & Structured Content
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Confidence: {Math.round((activeChapter?.extractionConfidence || 0.95) * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMappingModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Connect to Central Taxonomy</span>
                </button>
                <button
                  onClick={() => handleVerify('CHAPTER', activeChapter?.id, 'VERIFIED')}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify Chapter</span>
                </button>
              </div>
            </div>

            {/* Structured Content Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* Chapter Information */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Chapter {activeChapter?.chapterNumber} Metadata
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Pages {activeChapter?.pageStart} – {activeChapter?.pageEnd}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeChapter?.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeChapter?.introduction}
                </p>
              </div>

              {/* Topics Navigation inside Chapter */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Identified Topics & Academic Sections ({activeChapter?.topics?.length || 0})
                </span>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {activeChapter?.topics?.map((top: any, idx: number) => {
                    const isTopActive = idx === activeTopicIndex;
                    return (
                      <button
                        key={top.id}
                        onClick={() => setActiveTopicIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
                          isTopActive
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{top.title}</span>
                        {top.centralTopicId && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" title="Mapped to Central Taxonomy"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Topic Detail & Extracted Content Blocks */}
              {activeTopic && (
                <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        Active Topic
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{activeTopic.title}</h3>
                      {activeTopic.centralTopic && (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1 border border-indigo-100">
                          <Network className="w-3.5 h-3.5" />
                          <span>
                            Mapped to Central Taxonomy: <strong>{activeTopic.centralTopic.name}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleVerify('TOPIC', activeTopic.id, 'VERIFIED')}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    >
                      Verify Topic
                    </button>
                  </div>

                  {/* Extracted Blocks: Text, Formulas with KaTeX, Diagrams */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Extracted Content Blocks ({contentBlocks.length})
                    </span>

                    {contentBlocks.map((blk: any, bIdx: number) => (
                      <div
                        key={blk.id || bIdx}
                        className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold uppercase text-slate-500 font-mono">
                            Block {bIdx + 1} • {blk.type}
                          </span>
                          <span className="text-emerald-600 font-mono font-medium">
                            Confidence: {Math.round((blk.confidence || 0.95) * 100)}%
                          </span>
                        </div>

                        {blk.type === 'FORMULA' ? (
                          <div className="p-3 bg-slate-50 rounded border border-slate-100 overflow-x-auto text-center">
                            <MathRenderer content={`$$${blk.content}$$`} />
                          </div>
                        ) : blk.type === 'IMAGE' ? (
                          <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-700">
                            <span className="font-semibold block text-slate-900">Extracted Diagram:</span>
                            {blk.content}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-800 leading-relaxed">{blk.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL: CONNECT TO CENTRAL TAXONOMY */}
        {showMappingModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Network className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-base">Connect to Central Taxonomy</h3>
                </div>
                <button
                  onClick={() => setShowMappingModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Link this verified Book Topic (<strong>{activeTopic?.title}</strong>) to a single canonical
                Academic Topic in the central taxonomy. Once linked, Question Bank and YoShorts will automatically
                reuse this academic record.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Canonical Academic Topic:
                </label>
                <select
                  value={selectedCentralTopicId}
                  onChange={(e) => setSelectedCentralTopicId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  <option value="">-- Choose Canonical Topic --</option>
                  {centralTopics.map((top) => (
                    <option key={top.id} value={top.id}>
                      {top.name} ({top.chapter?.name || 'General Chapter'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowMappingModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMapToTaxonomy(activeTopic?.id)}
                  disabled={!selectedCentralTopicId}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  Confirm & Link Taxonomy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

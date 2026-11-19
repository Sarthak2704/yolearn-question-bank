'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  Video,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Network,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function ShortsPage() {
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchShorts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCurriculum !== 'ALL') params.set('curriculum', selectedCurriculum);
      if (selectedGrade !== 'ALL') params.set('grade', selectedGrade);
      if (selectedStatus !== 'ALL') params.set('status', selectedStatus);

      const res = await fetch(`/api/shorts?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setShorts(data.shorts);
      }
    } catch (e) {
      console.error('Failed to load shorts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, [selectedCurriculum, selectedGrade, selectedStatus]);

  // Metrics
  const totalShorts = shorts.length;
  const pendingShorts = shorts.filter((s) => s.verificationStatus === 'PENDING_REVIEW').length;
  const approvedShorts = shorts.filter((s) => s.verificationStatus === 'APPROVED').length;
  const publishedShorts = shorts.filter((s) => s.publishingStatus === 'PUBLISHED').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
              <Video className="w-4 h-4" />
              <span>Unified CMS • Vertical 3</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              YoShorts Video Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Create educational micro-videos from transcripts, preview AI generation, and map to books & central taxonomy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchShorts}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh Videos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/shorts/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New YoShort</span>
            </Link>
          </div>
        </div>

        {/* Operational KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalShorts}</div>
              <div className="text-xs text-slate-500">Total Educational Videos</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{pendingShorts}</div>
              <div className="text-xs text-slate-500">Pending Review</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{approvedShorts}</div>
              <div className="text-xs text-slate-500">Approved Videos</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{publishedShorts}</div>
              <div className="text-xs text-slate-500">Live in Mobile App</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search YoShorts by title, code (e.g. YS-CHM-001), or transcript text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchShorts()}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Curricula</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
              </select>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Grades</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="CHANGES_REQUESTED">Changes Requested</option>
              </select>
            </div>
          </div>
        </div>

        {/* Video Catalog Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading YoShorts...</div>
        ) : shorts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No YoShorts found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first educational short video from a transcript and map it to an academic topic.
            </p>
            <Link
              href="/shorts/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create YoShort</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shorts.map((short) => {
              const isApproved = short.verificationStatus === 'APPROVED';
              const bookMapping = short.bookMappings?.[0];
              return (
                <div
                  key={short.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Video Thumbnail Preview Header */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                      <img
                        src={short.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'}
                        alt={short.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-sm text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                          {short.code}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold">
                        {short.durationSeconds}s
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                            {short.curriculum || 'CBSE'} • Grade {short.grade || 10} • {short.subject?.name || 'Science'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {short.verificationStatus.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <h3 className="font-semibold text-slate-900 text-sm mt-1.5 leading-snug line-clamp-1">
                          {short.title}
                        </h3>
                      </div>

                      {/* Transcript Snippet */}
                      <p className="text-xs text-slate-500 line-clamp-2 italic bg-slate-50 p-2 rounded border border-slate-100">
                        "{short.transcript}"
                      </p>

                      {/* Mapped Topic & Book */}
                      <div className="space-y-1 text-xs">
                        {short.centralTopic && (
                          <div className="flex items-center gap-1.5 text-indigo-700 font-medium">
                            <Network className="w-3 h-3 shrink-0" />
                            <span className="truncate">Topic: {short.centralTopic.name}</span>
                          </div>
                        )}
                        {bookMapping && (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span className="truncate">Book: {bookMapping.book?.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {short.publishingStatus === 'PUBLISHED' ? '🟢 Live in App' : '⚪ Unverified Draft'}
                    </span>

                    <Link
                      href={`/shorts/${short.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <span>Review Video</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

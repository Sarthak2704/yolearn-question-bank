'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  Video,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Network,
  BookOpen,
  Edit3,
  Check,
  X,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export default function ShortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shortId = params.id as string;

  const [short, setShort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Edit transcript state
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState('');

  const fetchShort = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/shorts/${shortId}`);
      const data = await res.json();
      if (data.success && data.short) {
        setShort(data.short);
        setEditedTranscript(data.short.transcript);
      }
    } catch (e) {
      console.error('Failed to load short:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShort();
  }, [shortId]);

  const handleReviewAction = async (action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'REGENERATE') => {
    try {
      setIsActionLoading(true);
      const res = await fetch(`/api/shorts/${shortId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerName: 'Dr. Priya Sharma (SME Reviewer)',
          comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComment('');
        await fetchShort();
      }
    } catch (e) {
      console.error('Action failed:', e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveTranscript = async () => {
    try {
      const res = await fetch(`/api/shorts/${shortId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: editedTranscript }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingTranscript(false);
        await fetchShort();
      }
    } catch (e) {
      console.error('Failed to save transcript:', e);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-slate-400">Loading YoShort detail...</div>
      </AppLayout>
    );
  }

  if (!short) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-slate-400">YoShort not found.</div>
      </AppLayout>
    );
  }

  const isApproved = short.verificationStatus === 'APPROVED';
  const bookMapping = short.bookMappings?.[0];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/shorts"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {short.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {short.curriculum || 'CBSE'} • Grade {short.grade || 10} • {short.durationSeconds}s
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {short.verificationStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
                {short.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReviewAction('REQUEST_CHANGES')}
              disabled={isActionLoading}
              className="px-3 py-1.5 border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold"
            >
              Request Changes
            </button>
            <button
              onClick={() => handleReviewAction('APPROVE')}
              disabled={isActionLoading}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Approve Video
            </button>
          </div>
        </div>

        {/* Video Player & Transcript Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Video Player Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[9/16] max-h-[580px] w-full mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 flex flex-col justify-between p-4">
              {/* Background Video / Thumbnail */}
              <img
                src={short.thumbnailUrl || 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600'}
                alt={short.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />

              {/* Top Video Overlay */}
              <div className="relative z-10 flex items-center justify-between text-white text-xs">
                <span className="font-bold bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full font-mono text-[10px]">
                  {short.code} • {short.durationSeconds}s
                </span>
                <span className="text-[10px] bg-purple-600/80 px-2 py-0.5 rounded-full font-semibold">
                  YoShort HD
                </span>
              </div>

              {/* Play / Pause Toggle Center Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 w-16 h-16 rounded-full bg-white/90 text-purple-700 flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 ml-0.5 fill-current" />}
              </button>

              {/* Bottom Captions & Synced Transcript Subtitles */}
              <div className="relative z-10 space-y-2 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">
                  Synchronized Spoken Subtitle
                </span>
                <p className="text-xs font-semibold leading-snug drop-shadow-md">
                  "{short.transcript.slice(0, 110)}..."
                </p>

                {/* Simulated Seekbar */}
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-1 w-2/5"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Metadata, Transcript Editor & Review History (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Academic & Book Relationships */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Academic Mappings (Shared with Books & QB)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                    <Network className="w-3.5 h-3.5" />
                    <span>Canonical Academic Topic</span>
                  </div>
                  <span className="font-bold text-slate-900 block">
                    {short.centralTopic?.name || 'Types of Chemical Reactions'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Chapter: {short.centralTopic?.chapter?.name || 'Chemical Reactions'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Associated Ingested Book</span>
                  </div>
                  <span className="font-bold text-slate-900 block">
                    {bookMapping?.book?.title || 'Science Class 10 (NCERT)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Chapter: {bookMapping?.chapter?.title || 'Ch.1 Chemical Reactions'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transcript Editor & Verifier */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Spoken Educational Transcript</h3>
                  <span className="text-xs text-slate-400">
                    Reviewers can correct typos, formulas, and terminology
                  </span>
                </div>

                {isEditingTranscript ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsEditingTranscript(false)}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded font-medium text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTranscript}
                      className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingTranscript(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 rounded font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Transcript</span>
                  </button>
                )}
              </div>

              {isEditingTranscript ? (
                <textarea
                  rows={6}
                  value={editedTranscript}
                  onChange={(e) => setEditedTranscript(e.target.value)}
                  className="w-full p-3 text-xs border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed text-slate-800"
                />
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                  {short.transcript}
                </div>
              )}
            </div>

            {/* Reviewer Comment & Action Input */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Reviewer Evaluation & Feedback
              </h3>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter feedback notes, correction remarks or reason for change request..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Signed in as: <strong>SME Reviewer</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReviewAction('REGENERATE')}
                    className="px-3 py-1.5 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
                  >
                    Regenerate Video
                  </button>
                  <button
                    onClick={() => handleReviewAction('APPROVE')}
                    className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Approve & Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

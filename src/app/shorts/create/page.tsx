'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Video,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Cpu,
  Play,
  Pause,
  Network,
  BookOpen,
  ArrowRight,
  FileText,
} from 'lucide-react';

export default function CreateShortPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Types of Chemical Reactions Explained in 60s');
  const [transcript, setTranscript] = useState(
    'Did you know that every chemical change in our universe can be classified into five fundamental types? First: Combination reaction, where two substances combine into one, like 2H2 + O2 -> 2H2O. Second: Decomposition reaction, where one compound breaks down with heat, light or electricity. Third: Displacement reaction, where a more reactive metal kicks out a less reactive one. Fourth: Double displacement, where partners swap ions forming a precipitate. And fifth: Redox, where oxidation and reduction happen hand in hand! Remember: Combination builds up, decomposition tears down!'
  );
  const [curriculum, setCurriculum] = useState('CBSE');
  const [grade, setGrade] = useState(10);
  const [subjectId, setSubjectId] = useState('');
  const [centralTopicId, setCentralTopicId] = useState('');
  const [bookId, setBookId] = useState('');

  // Dropdown lists
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  // Generation simulation state
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [taxRes, booksRes] = await Promise.all([
          fetch('/api/taxonomy'),
          fetch('/api/books'),
        ]);
        const taxData = await taxRes.json();
        const booksData = await booksRes.json();

        if (taxData.success) {
          setSubjects(taxData.subjects || []);
          setTopics(taxData.topics || []);
          if (taxData.subjects?.[0]) setSubjectId(taxData.subjects[0].id);
          if (taxData.topics?.[0]) setCentralTopicId(taxData.topics[0].id);
        }
        if (booksData.success) {
          setBooks(booksData.books || []);
          if (booksData.books?.[0]) setBookId(booksData.books[0].id);
        }
      } catch (e) {
        console.error('Error loading taxonomy for shorts creation:', e);
      }
    }
    loadData();
  }, []);

  const handleStartGeneration = async () => {
    setGenerating(true);
    setStep(2);

    const stages = [
      '1. Natural Language Processing & Script Parsing...',
      '2. Visual Cue Generation & Diagram Synthesis...',
      '3. High-Definition Voiceover Synthesis...',
      '4. Compositing Video Stream & Subtitle Synchronization...',
      '5. Final Video Asset Render Complete!',
    ];

    for (let i = 0; i < stages.length; i++) {
      setGenerationStage(stages[i]);
      setGenerationProgress(Math.round(((i + 1) / stages.length) * 100));
      await new Promise((r) => setTimeout(r, 400));
    }

    setGenerating(false);
    setStep(3); // Preview
  };

  const handleFinalSubmit = async () => {
    try {
      const res = await fetch('/api/shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          transcript,
          curriculum,
          grade,
          subjectId,
          centralTopicId,
          bookId,
        }),
      });

      const data = await res.json();
      if (data.success && data.short) {
        router.push(`/shorts/${data.short.id}`);
      }
    } catch (e) {
      console.error('Failed to create short:', e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/shorts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to YoShorts</span>
          </Link>
          <span className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
            YoShorts Creation Workflow (Section 6.A)
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Educational YoShort
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide the educational transcript, simulate video synthesis, and connect to books and central taxonomy.
          </p>
        </div>

        {/* Step 1: Transcript & Metadata */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Video Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Curriculum</label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="NCERT">NCERT</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value={9}>Class 9</option>
                  <option value={10}>Class 10</option>
                  <option value={11}>Class 11</option>
                  <option value={12}>Class 12</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Educational Video Transcript * (Spoken Script)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {transcript.split(/\s+/).length} words • ~{Math.round((transcript.split(/\s+/).length / 140) * 60)}s duration
                </span>
              </div>
              <textarea
                rows={6}
                required
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the educational spoken transcript..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleStartGeneration}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process Transcript & Generate Video</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: AI Generation Animation */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto animate-pulse">
              <Cpu className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Generating Video Asset from Transcript
              </h2>
              <p className="text-xs text-purple-700 font-mono mt-1 font-semibold">
                {generationStage}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>

            <span className="text-xs text-slate-400 block font-mono">
              Stage: {generationProgress}% Complete
            </span>
          </div>
        )}

        {/* Step 3: Video Preview & Academic Mapping */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Video Generation Complete
              </span>
              <span className="text-xs text-slate-500 font-mono">60s Micro-Learning</span>
            </div>

            {/* Video Player Simulator */}
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800"
                alt="Video preview background"
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute w-14 h-14 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
              </button>

              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg text-white text-xs">
                <span className="font-semibold block text-[11px] text-purple-300 uppercase tracking-wider">
                  Synced Transcript Subtitles
                </span>
                <span className="italic font-medium">"{transcript.slice(0, 95)}..."</span>
              </div>
            </div>

            {/* Academic & Book Mapping Selectors */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Academic Taxonomy & Book Mapping
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Central Academic Topic */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Canonical Academic Topic (Shared with QB)
                  </label>
                  <select
                    value={centralTopicId}
                    onChange={(e) => setCentralTopicId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                  >
                    <option value="">-- Select Canonical Topic --</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.chapter?.name || 'General'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Book Linkage */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Associated Ingested Book (Optional)
                  </label>
                  <select
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                  >
                    <option value="">-- No Specific Book (General Syllabus) --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.curriculum} Grade {b.grade})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Back to Transcript
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save YoShort & Queue for Review</span>
              </button>
            </div>
          </div>
        )}
      </div>
  );
}

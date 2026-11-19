'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Database,
  Cpu,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function BookUploadPage() {
  const router = useRouter();

  // Form state initialized matching the exact screenshot requirements
  const [formData, setFormData] = useState({
    pdfFileName: '',
    chapter_split: '1-16,17-38,39-55',
    subject_id: '',
    subject_name: '',
    curriculum: 'CBSE',
    chapter_names: 'Chemical Reactions and Equations, Acids Bases and Salts, Metals and Non-metals',
    s3_path: 'CBSE/Grade 10/Science/1',
    book_code: 'jesc1',
    grade: 10,
    qdrant_collection_name: 'yolearn_books_cbse_10',
    book_title: 'Science Class 10 (NCERT)',
    database: 'primary',
    publisher: 'NCERT',
    academic_year: '2024-2025',
    edition: 'Revised Edition 2024',
    language: 'English',
    isbn: '978-81-7450-492-0',
  });

  const [subjects, setSubjects] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [ingestedBookId, setIngestedBookId] = useState<string | null>(null);

  // 14 Ingestion Pipeline Stages specified in Section 4.B
  const pipelineStages = [
    { name: '1. PDF Uploaded', desc: 'Binary stream received and validated' },
    { name: '2. File Validation', desc: 'MIME check, checksum & page counts' },
    { name: '3. PDF Processing', desc: 'Vector rasterization & stream tokenizing' },
    { name: '4. OCR / Text Extraction', desc: 'Multi-lingual OCR engine execution' },
    { name: '5. Page Identification', desc: '1-indexed page boundaries verified' },
    { name: '6. Chapter Identification', desc: 'Regex & LLM chapter boundary detection' },
    { name: '7. Topic Identification', desc: 'Hierarchical section & sub-topic parsing' },
    { name: '8. Text & Content Structuring', desc: 'Paragraphs, notes, & activity blocks' },
    { name: '9. Image & Diagram Extraction', desc: 'High-res diagram crop & captioning' },
    { name: '10. Formula & Math Extraction', desc: 'LaTeX equation transcription' },
    { name: '11. Content Organization', desc: 'JSON tree hierarchy synthesis' },
    { name: '12. Human Verification', desc: 'Queued for SME review and approval' },
    { name: '13. Final Approval', desc: 'Academic sign-off check' },
    { name: '14. Publish to Content DB', desc: 'Sync to relational DB & Qdrant vector store' },
  ];

  // Fetch subjects from Central Taxonomy
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch('/api/taxonomy');
        const data = await res.json();
        if (data.success && data.subjects) {
          setSubjects(data.subjects);
          if (data.subjects.length > 0 && !formData.subject_id) {
            const first = data.subjects[0];
            setFormData((prev) => ({
              ...prev,
              subject_id: first.id,
              subject_name: first.name,
              s3_path: `CBSE/Grade 10/${first.name}/1`,
              qdrant_collection_name: `yolearn_books_cbse_10_${first.code.toLowerCase()}`,
            }));
          }
        }
      } catch (e) {
        console.error('Failed to load subjects:', e);
      }
    }
    fetchSubjects();
  }, []);

  const handleSubjectChange = (subjectId: string) => {
    const selected = subjects.find((s) => s.id === subjectId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        subject_id: selected.id,
        subject_name: selected.name,
        s3_path: `${prev.curriculum}/Grade ${prev.grade}/${selected.name}/1`,
        qdrant_collection_name: `yolearn_books_${prev.curriculum.toLowerCase()}_${prev.grade}_${selected.code.toLowerCase()}`,
      }));
    }
  };

  const handleBookCodeChange = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      book_code: code,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCurrentStep(2); // Show live pipeline tracker

    try {
      // Simulate pipeline progression
      for (let i = 0; i <= 10; i++) {
        setActiveStageIndex(i);
        setPipelineProgress(Math.round(((i + 1) / 14) * 100));
        await new Promise((r) => setTimeout(r, 200));
      }

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfUrl: formData.pdfFileName ? `https://storage.yolearn.ai/books/${formData.pdfFileName}` : undefined,
          chapterSplit: formData.chapter_split,
          subjectId: formData.subject_id,
          subjectName: formData.subject_name,
          curriculum: formData.curriculum,
          chapterNames: formData.chapter_names,
          s3Path: formData.s3_path,
          bookCode: formData.book_code,
          grade: formData.grade,
          qdrantCollection: formData.qdrant_collection_name,
          bookTitle: formData.book_title,
          databaseTarget: formData.database,
          publisher: formData.publisher,
          academicYear: formData.academic_year,
          edition: formData.edition,
          language: formData.language,
          isbn: formData.isbn,
        }),
      });

      const data = await res.json();
      if (data.success && data.book) {
        setIngestedBookId(data.book.id);
        setActiveStageIndex(11); // Ready for human verification
        setPipelineProgress(85);
      }
    } catch (err) {
      console.error('Ingestion failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books</span>
          </Link>

          <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            Physical Book PDF Ingestion Pipeline
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ingest Physical Book (PDF)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in required curriculum metadata matching the YoLearn Book Ingestion schema, then initiate automated extraction.
          </p>
        </div>

        {currentStep === 1 ? (
          /* Form matching uploaded screenshot */
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Book Metadata Specification
              </h2>
              <span className="text-xs text-slate-400">
                Preserving required API parameters and taxonomy linkage
              </span>
            </div>

            {/* 1. PDF File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  pdf <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">Full book PDF to ingest</span>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer transition-all">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData((p) => ({ ...p, pdfFileName: e.target.files![0].name }));
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  {formData.pdfFileName && (
                    <span className="text-xs font-medium text-emerald-600 mt-2 block">
                      Selected: {formData.pdfFileName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Chapter Split */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  chapter_split <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Page ranges e.g. '1-3,4-7,8-12' (1-indexed, inclusive)
                </span>
                <input
                  type="text"
                  required
                  value={formData.chapter_split}
                  onChange={(e) => setFormData({ ...formData, chapter_split: e.target.value })}
                  placeholder="e.g. 1-16,17-38,39-55"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                />
              </div>
            </div>

            {/* 3. Subject ID & Searchable Subject Picker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  subject_id <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2 space-y-2">
                <span className="text-xs text-slate-600 block">
                  UUID of an existing subject in the DB (select from central taxonomy)
                </span>
                <select
                  required
                  value={formData.subject_id}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                >
                  <option value="">-- Select Existing Subject from Central Taxonomy --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code}) — {sub.id}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  readOnly
                  value={formData.subject_id}
                  placeholder="Subject UUID"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-500 font-mono"
                />
              </div>
            </div>

            {/* 4. Subject Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  subject_name <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">Display name of the subject</span>
                <input
                  type="text"
                  required
                  value={formData.subject_name}
                  onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>

            {/* 5. Curriculum */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  curriculum <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">Curriculum name e.g. 'CBSE'</span>
                <input
                  type="text"
                  required
                  value={formData.curriculum}
                  onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>

            {/* 6. Chapter Names */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  chapter_names <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Comma-separated chapter titles, one per range
                </span>
                <textarea
                  rows={2}
                  required
                  value={formData.chapter_names}
                  onChange={(e) => setFormData({ ...formData, chapter_names: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>

            {/* 7. S3 Path */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  s3_path <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Base S3 key prefix e.g. 'CBSE/Grade 9-10/History/1'
                </span>
                <input
                  type="text"
                  required
                  value={formData.s3_path}
                  onChange={(e) => setFormData({ ...formData, s3_path: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                />
              </div>
            </div>

            {/* 8. Book Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  book_code <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Book code with index e.g. 'lehs3' — split into code='lehs', book_index=3
                </span>
                <input
                  type="text"
                  required
                  value={formData.book_code}
                  onChange={(e) => handleBookCodeChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* 9. Grade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  grade <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">integer</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">Grade number</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value, 10) || 10 })}
                  className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* 10. Qdrant Collection Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  qdrant_collection_name <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Qdrant collection to index chunks into
                </span>
                <input
                  type="text"
                  required
                  value={formData.qdrant_collection_name}
                  onChange={(e) => setFormData({ ...formData, qdrant_collection_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                />
              </div>
            </div>

            {/* 11. Book Title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  book_title
                </label>
                <span className="text-xs text-slate-400 font-mono">string | (string | null)</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Book title (defaults to subject_name)
                </span>
                <input
                  type="text"
                  value={formData.book_title}
                  onChange={(e) => setFormData({ ...formData, book_title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>
            </div>

            {/* 12. Database Target */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start border-b border-slate-100 pb-4">
              <div>
                <label className="text-xs font-bold text-red-600 block">
                  database <span className="text-red-500">* required</span>
                </label>
                <span className="text-xs text-slate-400 font-mono">string</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-slate-600 block mb-1">
                  Database to write to (see GET /databases)
                </span>
                <input
                  type="text"
                  required
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Form Submit Footer */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/books"
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>Execute Ingestion & OCR Pipeline</span>
              </button>
            </div>
          </form>
        ) : (
          /* Live 14-Stage Ingestion Pipeline Progress Tracker */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Asynchronous Ingestion Pipeline
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Processing: {formData.book_title} ({formData.book_code})
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-600 font-mono">
                  {pipelineProgress}%
                </span>
                <span className="text-xs text-slate-400 block">Overall Ingestion</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${pipelineProgress}%` }}
              ></div>
            </div>

            {/* 14 Individual Stage Status List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {pipelineStages.map((stg, idx) => {
                const isPassed = idx < activeStageIndex;
                const isCurrent = idx === activeStageIndex;
                return (
                  <div
                    key={stg.name}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      isPassed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : isCurrent
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm text-indigo-900 animate-pulse'
                        : 'bg-slate-50/60 border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Cpu className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight">{stg.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{stg.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion Actions */}
            {ingestedBookId && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-emerald-950 text-sm block">
                      Extraction Completed & Queued for Human Review
                    </span>
                    <span className="text-xs text-emerald-700">
                      Chapters, topics, and LaTeX formulas structured. Ready for SME verification.
                    </span>
                  </div>
                </div>

                <Link
                  href={`/books/${ingestedBookId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  <span>Open Split-Screen Reviewer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

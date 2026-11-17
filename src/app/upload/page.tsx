'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCw,
  Download,
  Eye,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function BulkUploadPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawTextSample, setRawTextSample] = useState('');
  const [totalPagesInput, setTotalPagesInput] = useState('5');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const fetchJobs = () => {
    fetch('/api/uploads')
      .then((res) => res.json())
      .then((d) => {
        setJobs(d.jobs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStartExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fileName = selectedFile ? selectedFile.name : `Batch_Upload_${Date.now()}.pdf`;
      const fileType = fileName.endsWith('.xlsx')
        ? 'XLSX'
        : fileName.endsWith('.csv')
        ? 'CSV'
        : 'PDF';

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileType,
          totalPages: parseInt(totalPagesInput) || 5,
          rawContent: rawTextSample || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedFile(null);
        setRawTextSample('');
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/uploads/${jobId}/retry`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downloadExcelTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Type,Statement,Option_A,Option_B,Option_C,Option_D,Correct_Option,Subject,Chapter,Difficulty,Marks,Source\n' +
      'MCQ,"A uniform thin rod of mass $M$ and length $L$ has moment of inertia about its end:","$\\frac{1}{3}ML^2$","$\\frac{1}{12}ML^2$","$\\frac{1}{2}ML^2$","$ML^2$",Option_A,Physics,Rotational Motion,MEDIUM,4,JEE Advanced 2024\n' +
      'MCQ,"Calculate the molarity of pure water at 298 K with density 1.0 g/mL:","55.55 M","18.0 M","1.0 M","100 M",Option_A,Chemistry,Solutions,EASY,4,NCERT Exemplar\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'YoLearn_Question_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bulk Ingestion & AI Document Extraction
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Process previous year question papers (PDF), NCERT books, DOCX documents, and bulk Excel/CSV sheets.
          </p>
        </div>

        <button
          onClick={downloadExcelTemplate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Download Standard Excel Template</span>
        </button>
      </div>

      {/* Upload Zone & Ingestion Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleStartExtraction}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Upload Document for AI Parsing</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Supports PDF, DOCX, XLSX, CSV</span>
          </div>

          {/* Drag & Drop Mock Zone */}
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 text-center space-y-2 bg-slate-50/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.docx,.xlsx,.csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-700">
              {selectedFile ? (
                <span className="text-indigo-600">{selectedFile.name}</span>
              ) : (
                'Drop your examination question paper here or click to browse'
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              PDF question papers, NCERT scans, or tabular Excel files up to 50MB
            </p>
          </div>

          {/* Document Content Input or Quick Paste */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Raw Text / Scanned OCR Paste (Optional quick test)
            </label>
            <textarea
              rows={3}
              value={rawTextSample}
              onChange={(e) => setRawTextSample(e.target.value)}
              placeholder="Paste raw unformatted question text with options to test AI parser..."
              className="w-full text-xs font-mono py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Simulate Pages:</span>
              <input
                type="number"
                value={totalPagesInput}
                onChange={(e) => setTotalPagesInput(e.target.value)}
                className="w-16 py-1 px-2 border border-slate-200 rounded text-center text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{uploading ? 'Processing Extraction...' : 'Start AI Extraction Job'}</span>
            </button>
          </div>
        </form>

        {/* Workflow Info Box */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Document Processing Workflow</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <span>Document is securely ingested and partitioned page-by-page.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <span>OCR extracts scanned text and equation delimiters into KaTeX tokens.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <span>AI boundaries identify statement, options, key, and solution steps.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                4
              </span>
              <span>Taxonomy classifier auto-tags Subject, Chapter, and Bloom level.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                5
              </span>
              <span>Duplicate checks execute; questions enter Review Queue for SME sign-off.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Job Dashboard (Module 6 requirement) */}
      <div id="jobs" className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Document Extraction Job Dashboard</h3>
            <p className="text-xs text-slate-400">Status of active and completed bulk ingestion jobs</p>
          </div>
          <button
            onClick={fetchJobs}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh jobs"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Pages</th>
                <th className="py-3 px-3">Detected</th>
                <th className="py-3 px-3">Extracted</th>
                <th className="py-3 px-3">Failed</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Upload Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Loading import jobs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No upload jobs recorded.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        {job.fileType === 'PDF' ? (
                          <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                        ) : (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span>{job.fileName}</span>
                      </div>
                      {job.errorSummary && (
                        <div className="text-[10px] text-amber-600 mt-0.5 truncate max-w-sm">
                          {job.errorSummary}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-600 text-[10px]">
                        {job.fileType}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-700">{job.totalPages}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{job.totalDetected}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{job.successfullyExtracted}</td>
                    <td className="py-3 px-3 font-semibold text-rose-600">{job.failedCount}</td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === 'COMPLETED' || job.status === 'EXTRACTION_COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.status === 'PROCESSING'
                            ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                            : job.status === 'PARTIALLY_FAILED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {job.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {job.failedCount > 0 && (
                          <button
                            onClick={() => handleRetryJob(job.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200"
                            title="Retry failed extraction items"
                          >
                            Retry Failed
                          </button>
                        )}
                        <Link
                          href={`/upload/review/${job.id}`}
                          className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>Split-Screen Review</span>
                        </Link>
                        <Link
                          href="/questions?verificationStatus=DRAFT"
                          className="px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded"
                        >
                          Questions List
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

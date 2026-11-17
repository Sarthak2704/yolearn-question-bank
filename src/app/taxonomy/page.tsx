'use client';

import React, { useState, useEffect } from 'react';
import {
  Network,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Layers,
  GraduationCap,
  Folder,
  FileText,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function TaxonomyManagementPage() {
  const [taxonomy, setTaxonomy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // Modal State for Adding Items
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLevel, setModalLevel] = useState<'subject' | 'chapter' | 'topic' | 'concept'>('subject');
  const [formData, setFormData] = useState<any>({ name: '', code: '', number: '1' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTaxonomy = () => {
    fetch('/api/taxonomy')
      .then((res) => res.json())
      .then((d) => {
        setTaxonomy(d);
        if (d.subjects && d.subjects.length > 0 && !selectedSubject) {
          setSelectedSubject(d.subjects[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTaxonomy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTaxonomy = async () => {
    setSubmitting(true);
    try {
      let payload: any = { name: formData.name, code: formData.code };
      if (modalLevel === 'chapter') {
        payload.subjectId = selectedSubject;
        payload.chapterNumber = parseInt(formData.number) || 1;
      } else if (modalLevel === 'topic') {
        payload.chapterId = selectedChapter;
      }

      const res = await fetch('/api/taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: modalLevel, data: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ name: '', code: '', number: '1' });
        fetchTaxonomy();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTaxonomy = async (level: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${level}?`)) return;
    try {
      await fetch(`/api/taxonomy?level=${level}&id=${id}`, { method: 'DELETE' });
      fetchTaxonomy();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading Academic Taxonomy Hierarchy...</span>
      </div>
    );
  }

  const subjects = taxonomy?.subjects || [];
  const chapters = taxonomy?.chapters?.filter((c: any) => c.subjectId === selectedSubject) || [];
  const currentChapter = chapters.find((c: any) => c.id === selectedChapter) || chapters[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Academic Taxonomy Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure Education Segments, Boards, Exams, Subjects, Chapters, Topics, and Concepts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setModalLevel('subject');
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Segments & Boards Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Education Segments
            </span>
            <span className="text-xs text-indigo-600 font-semibold">
              {taxonomy?.segments?.length} active
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {taxonomy?.segments?.map((seg: any) => (
              <span
                key={seg.id}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {seg.name} ({seg.code})
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mapped Examinations & Boards
            </span>
            <span className="text-xs text-purple-600 font-semibold">
              {(taxonomy?.exams?.length || 0) + (taxonomy?.boards?.length || 0)} mapped
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {taxonomy?.exams?.map((ex: any) => (
              <span
                key={ex.id}
                className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-50 text-purple-700 border border-purple-100"
              >
                {ex.name}
              </span>
            ))}
            {taxonomy?.boards?.map((b: any) => (
              <span
                key={b.id}
                className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200"
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Cascading Taxonomy Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden min-h-[500px]">
        {/* Column 1: Subjects List (Cols 3) */}
        <div className="md:col-span-3 border-r border-slate-200 p-4 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Subjects ({subjects.length})
            </span>
          </div>

          <div className="space-y-1">
            {subjects.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubject(sub.id);
                  setSelectedChapter(null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedSubject === sub.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sub.name}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    selectedSubject === sub.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {sub.code}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Chapters List (Cols 4) */}
        <div className="md:col-span-4 border-r border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Chapters ({chapters.length})
            </span>
            <button
              onClick={() => {
                setModalLevel('chapter');
                setShowAddModal(true);
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Chapter</span>
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[460px]">
            {chapters.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">
                No chapters added for this subject yet.
              </div>
            ) : (
              chapters.map((chap: any) => {
                const isSelected = (currentChapter && currentChapter.id === chap.id);
                return (
                  <div
                    key={chap.id}
                    onClick={() => setSelectedChapter(chap.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-300 bg-indigo-50/50 text-indigo-900 font-semibold'
                        : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="text-slate-400 text-[10px]">Ch {chap.chapterNumber}.</span>
                        <span>{chap.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {chap.topics?.length || 0} topics • {chap._count?.taxonomyMappings || 0} questions
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Topics, Subtopics & Concepts (Cols 5) */}
        <div className="md:col-span-5 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Topics & Concepts
            </span>
            {currentChapter && (
              <button
                onClick={() => {
                  setSelectedChapter(currentChapter.id);
                  setModalLevel('topic');
                  setShowAddModal(true);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Topic</span>
              </button>
            )}
          </div>

          {currentChapter ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <span className="text-slate-400 text-[11px] block font-medium">Selected Chapter</span>
                <span className="font-bold text-slate-800 text-sm">{currentChapter.name}</span>
              </div>

              <div className="space-y-2">
                {currentChapter.topics?.length === 0 ? (
                  <div className="text-xs text-slate-400 py-6 text-center">
                    No topics mapped yet. Click &quot;Add Topic&quot; to create one.
                  </div>
                ) : (
                  currentChapter.topics?.map((top: any) => (
                    <div
                      key={top.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Folder className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{top.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteTaxonomy('topic', top.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Delete topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {top.subtopics && top.subtopics.length > 0 && (
                        <div className="pl-4 space-y-1.5 border-l-2 border-indigo-100 text-[11px]">
                          {top.subtopics.map((st: any) => (
                            <div key={st.id} className="text-slate-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              <span className="font-medium">{st.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-12 text-center">
              Select a chapter to view its topics and concepts.
            </div>
          )}
        </div>
      </div>

      {/* Add Taxonomy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Add New {modalLevel}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{modalLevel} Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`e.g. ${
                    modalLevel === 'subject'
                      ? 'Computer Science'
                      : modalLevel === 'chapter'
                      ? 'Electromagnetic Waves'
                      : 'Displacement Current'
                  }`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              {modalLevel === 'subject' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CS"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 uppercase"
                  />
                </div>
              )}

              {modalLevel === 'chapter' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter Number</label>
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTaxonomy}
                disabled={submitting || !formData.name}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                {submitting ? 'Saving...' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

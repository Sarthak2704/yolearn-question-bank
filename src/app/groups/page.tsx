'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Folders,
  Plus,
  BookOpen,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import MathRenderer from '@/components/math/MathRenderer';

export default function QuestionGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [groupType, setGroupType] = useState('PASSAGE');
  const [instruction, setInstruction] = useState('Read the passage carefully and answer the following questions:');
  const [sharedPassage, setSharedPassage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGroups = () => {
    fetch('/api/groups')
      .then((res) => res.json())
      .then((d) => {
        setGroups(d.groups || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, groupType, instruction, sharedPassage }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setTitle('');
        setSharedPassage('');
        fetchGroups();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Folders className="w-6 h-6 text-indigo-600" />
            <span>Question Groups & Comprehension Passages</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage parent passages, case studies, shared diagrams, and linked child question sets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Passage Group</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading question groups...</div>
      ) : groups.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Question Groups Created</h3>
          <p className="text-xs text-slate-400">
            Create a passage group to bundle multiple questions under a shared case study.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {group.groupType}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{group.title}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {group.questions?.length || 0} Child Questions
                </span>
              </div>

              {/* Shared Passage Body with KaTeX */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-normal">
                <span className="font-semibold text-slate-500 block mb-1">Passage Text:</span>
                <MathRenderer content={group.sharedPassage} />
              </div>

              {/* Child questions list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Linked Child Questions:</span>
                {group.questions && group.questions.length > 0 ? (
                  group.questions.map((child: any, i: number) => (
                    <div
                      key={child.id}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-400 text-xs">#{i + 1}</span>
                        <span className="font-mono font-bold text-indigo-600">{child.code}</span>
                        <span className="text-slate-800 line-clamp-1">{child.statementText}</span>
                      </div>
                      <Link
                        href={`/questions/${child.id}`}
                        className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No questions linked to this passage yet.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateGroup}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl"
          >
            <h3 className="text-base font-bold text-slate-900">Create Question Group / Passage</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Passage Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Case Study: Photoelectric Effect in Cesium"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Group Type</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="PASSAGE">Comprehension Passage</option>
                  <option value="CASE_STUDY">Case Study</option>
                  <option value="COMMON_DATA">Common Data Question Set</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shared Passage Content (with KaTeX)</label>
                <textarea
                  rows={5}
                  required
                  value={sharedPassage}
                  onChange={(e) => setSharedPassage(e.target.value)}
                  placeholder="Enter the full comprehension passage or scientific paragraph here..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                {submitting ? 'Creating...' : 'Create Passage Group'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

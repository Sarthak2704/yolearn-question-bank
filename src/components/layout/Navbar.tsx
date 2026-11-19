'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  ShieldCheck,
  User,
  CheckCircle2,
  BookOpen,
  Database,
  Video,
  Network,
  X,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [activeRole, setActiveRole] = useState('SUPER_ADMIN');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full System Permissions & Taxonomy Config' },
    { id: 'CONTENT_MANAGER', label: 'Content Manager', desc: 'Books, QB, YoShorts Lifecycle Manager' },
    { id: 'SME', label: 'Subject Matter Expert (SME)', desc: 'Verify Equations, Rubrics & Proofs' },
    { id: 'CONTENT_EDITOR', label: 'Content Editor', desc: 'OCR Correction & Metadata Tagging' },
    { id: 'REVIEWER', label: 'Reviewer', desc: 'Approve & Reject Content Queues' },
    { id: 'VIEWER', label: 'Viewer', desc: 'Read-only Access' },
  ];

  // Debounced global search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search/global?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results);
          setShowSearchDropdown(true);
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/questions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Global Unified Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-xl">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across Books, Questions, YoShorts, and Topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                if (searchResults) setShowSearchDropdown(true);
              }}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Global Search Results Dropdown */}
        {showSearchDropdown && searchResults && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 max-h-[480px] overflow-y-auto z-50 divide-y divide-slate-100 p-2">
            {/* Books Results */}
            {searchResults.books?.length > 0 && (
              <div className="py-2">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Books ({searchResults.books.length})</span>
                </div>
                {searchResults.books.map((b: any) => (
                  <Link
                    key={b.id}
                    href={b.url}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-xs text-slate-700"
                  >
                    <div>
                      <span className="font-medium text-slate-900">{b.title}</span>
                      <span className="text-slate-400 ml-2">({b.code})</span>
                      <p className="text-[11px] text-slate-500">{b.details}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}

            {/* Questions Results */}
            {searchResults.questions?.length > 0 && (
              <div className="py-2">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                  <Database className="w-3.5 h-3.5" />
                  <span>Question Bank ({searchResults.questions.length})</span>
                </div>
                {searchResults.questions.map((q: any) => (
                  <Link
                    key={q.id}
                    href={q.url}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-xs text-slate-700"
                  >
                    <div>
                      <span className="font-mono text-indigo-600 font-semibold mr-1.5">{q.code}</span>
                      <span className="text-slate-800">{q.title}</span>
                      <p className="text-[11px] text-slate-500">{q.details}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}

            {/* YoShorts Results */}
            {searchResults.shorts?.length > 0 && (
              <div className="py-2">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                  <Video className="w-3.5 h-3.5" />
                  <span>YoShorts ({searchResults.shorts.length})</span>
                </div>
                {searchResults.shorts.map((s: any) => (
                  <Link
                    key={s.id}
                    href={s.url}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-xs text-slate-700"
                  >
                    <div>
                      <span className="font-medium text-slate-900">{s.title}</span>
                      <p className="text-[11px] text-slate-500">{s.details}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}

            {/* Taxonomy Topics Results */}
            {searchResults.topics?.length > 0 && (
              <div className="py-2">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                  <Network className="w-3.5 h-3.5" />
                  <span>Academic Topics ({searchResults.topics.length})</span>
                </div>
                {searchResults.topics.map((t: any) => (
                  <Link
                    key={t.id}
                    href={t.url}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-xs text-slate-700"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{t.title}</span>
                      <p className="text-[11px] text-slate-500">{t.details}</p>
                    </div>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                      Topic Hub
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {searchResults.books?.length === 0 &&
              searchResults.questions?.length === 0 &&
              searchResults.shorts?.length === 0 &&
              searchResults.topics?.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching content found across Books, QB, or YoShorts.
                </div>
              )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Role: {roles.find((r) => r.id === activeRole)?.label}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-30 divide-y divide-slate-100">
              <div className="px-3.5 py-2 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Simulate User Role (RBAC)
              </div>
              <div className="py-1">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-start gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors ${
                      activeRole === r.id ? 'bg-indigo-50/70 text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        activeRole === r.id ? 'text-indigo-600' : 'text-slate-300'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-medium">{r.label}</div>
                      <div className="text-[11px] text-slate-500">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Unified Quick Create Button */}
        <div className="relative group">
          <Link
            href="/books/upload"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Content</span>
          </Link>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-200 p-3 z-30">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Unified Activity Feed</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                  Live
                </span>
              </div>
              <div className="space-y-2 mt-2 text-xs">
                <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg">
                  <span className="font-semibold block">Book Ingestion Complete</span>
                  Science Class 10 (jesc1) OCR & formula structuring ready for review.
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-900 rounded-lg">
                  <span className="font-semibold block">YoShort Generated</span>
                  YS-CHM-001 "Types of Chemical Reactions" transcript synthesized.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50">
            AN
          </div>
        </div>
      </div>
    </header>
  );
}

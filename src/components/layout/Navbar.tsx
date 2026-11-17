'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  ShieldCheck,
  User,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('SUPER_ADMIN');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full System Permissions' },
    { id: 'QB_MANAGER', label: 'QB Manager', desc: 'Manage Repository & Workflows' },
    { id: 'SME', label: 'Subject Matter Expert (SME)', desc: 'Verify Answers & Solutions' },
    { id: 'REVIEWER', label: 'Reviewer', desc: 'Approve & Reject Questions' },
    { id: 'CONTENT_MANAGER', label: 'Content Manager', desc: 'Upload & Edit Questions' },
    { id: 'VIEWER', label: 'Viewer', desc: 'Read-only Access' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/questions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Global Search Input */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by text, code (e.g. QB-PHY-000001), exam, chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Role: {activeRole.replace('_', ' ')}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Role Permissions
              </div>
              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                      activeRole === r.id ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        activeRole === r.id ? 'text-indigo-600' : 'text-transparent'
                      }`}
                    />
                    <div>
                      <div className="font-semibold">{r.label}</div>
                      <div className="text-[11px] text-slate-400">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Generator Quick Link */}
        <Link
          href="/ai-generator"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Assist</span>
        </Link>

        {/* Create Question Button */}
        <Link
          href="/questions/create"
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Question</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-indigo-600 cursor-pointer font-medium">Mark read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="font-semibold text-slate-800">Bulk Import Finished</div>
                  <div className="text-slate-500 text-[11px]">NEET 2024 Biology parsed 45 questions.</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="font-semibold text-slate-800">Review Requested</div>
                  <div className="text-slate-500 text-[11px]">QB-PHY-000001 submitted by Vikram Mehta.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-300">
            AN
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">Aditya Narayan</span>
            <span className="text-[10px] text-slate-400">admin@yolearn.ai</span>
          </div>
        </div>
      </div>
    </header>
  );
}

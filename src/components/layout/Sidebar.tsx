'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  UploadCloud,
  PlusCircle,
  Sparkles,
  Cpu,
  Network,
  ListFilter,
  CopyCheck,
  CheckSquare,
  Folders,
  BarChart3,
  Users2,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  pendingCount?: number;
  duplicateCount?: number;
}

export default function Sidebar({ pendingCount = 1, duplicateCount = 1 }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Question Repository', href: '/questions', icon: Database },
    { name: 'Upload Questions', href: '/upload', icon: UploadCloud },
    { name: 'Create Question', href: '/questions/create', icon: PlusCircle },
    { name: 'AI Question Generator', href: '/ai-generator', icon: Sparkles },
    { name: 'AI Extraction Jobs', href: '/upload#jobs', icon: Cpu },
    { name: 'Taxonomy Management', href: '/taxonomy', icon: Network },
    { name: 'Question Types', href: '/question-types', icon: ListFilter },
    {
      name: 'Duplicate Management',
      href: '/duplicates',
      icon: CopyCheck,
      badge: duplicateCount > 0 ? duplicateCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Review & Approval',
      href: '/review',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    { name: 'Question Collections', href: '/groups', icon: Folders },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'User & Role Management', href: '/users', icon: Users2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold shadow-sm shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-slate-900 text-base leading-tight tracking-tight">
                YoLearn<span className="text-indigo-600">.ai</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Question Bank OS</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!collapsed && <span className="truncate flex-1">{item.name}</span>}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/60 m-2 rounded-lg text-xs text-slate-500">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-700">Environment</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Engine: PostgreSQL/SQLite + KaTeX
          </div>
        </div>
      )}
    </aside>
  );
}

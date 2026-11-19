'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Database,
  Video,
  CheckSquare,
  Network,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  PlusCircle,
  UploadCloud,
  CopyCheck,
  Folders,
} from 'lucide-react';

interface SidebarProps {
  pendingCount?: number;
  duplicateCount?: number;
}

export default function Sidebar({ pendingCount = 3, duplicateCount = 1 }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Unified 8-item primary navigation as defined in Master Prompt Section 2
  const primaryNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    {
      name: 'Books',
      href: '/books',
      icon: BookOpen,
      badge: 'PDF OCR',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Question Bank',
      href: '/questions',
      icon: Database,
    },
    {
      name: 'YoShorts',
      href: '/shorts',
      icon: Video,
      badge: 'Video AI',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      name: 'Content Review Queue',
      href: '/review',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      name: 'Taxonomy Management',
      href: '/taxonomy',
      icon: Network,
    },
    {
      name: 'Reports & Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  // Quick action shortcuts under Question Bank for fast operational access
  const qbSubItems = [
    { name: 'Create Question', href: '/questions/create', icon: PlusCircle },
    { name: 'Bulk Import', href: '/upload', icon: UploadCloud },
    { name: 'Duplicates', href: '/duplicates', icon: CopyCheck, count: duplicateCount },
    { name: 'Collections', href: '/groups', icon: Folders },
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
              <span className="text-[11px] text-slate-500 font-medium">Unified Content CMS</span>
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
        {primaryNavigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        {/* Question Bank Quick Actions */}
        {!collapsed && pathname?.startsWith('/questions') && (
          <div className="pt-3 pb-1 border-t border-slate-100 mt-2 space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3">
              QB Shortcuts
            </span>
            {qbSubItems.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = pathname === sub.href;
              return (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isSubActive
                      ? 'bg-indigo-100/60 text-indigo-800'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SubIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.name}</span>
                  </div>
                  {sub.count && sub.count > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                      {sub.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* System Status Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-600">3 Verticals Synced</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v2.0-unified</span>
          </div>
        </div>
      )}
    </aside>
  );
}

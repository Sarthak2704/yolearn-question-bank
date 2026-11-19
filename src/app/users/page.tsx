'use client';

import React, { useEffect, useState } from 'react';
import {
  Users2,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Lock,
  Plus,
} from 'lucide-react';

export default function UserRoleManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => {
        setUsers(d.availableUsers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const permissionMatrix = [
    { module: 'Physical Book PDF Ingestion', SUPER_ADMIN: true, QB_MANAGER: true, SME: false, REVIEWER: false, CONTENT_MANAGER: true, VIEWER: false },
    { module: 'Book OCR Review & Chapter Structuring', SUPER_ADMIN: true, QB_MANAGER: true, SME: true, REVIEWER: true, CONTENT_MANAGER: true, VIEWER: false },
    { module: 'View Question Repository', SUPER_ADMIN: true, QB_MANAGER: true, SME: true, REVIEWER: true, CONTENT_MANAGER: true, VIEWER: true },
    { module: 'Create & Edit Questions', SUPER_ADMIN: true, QB_MANAGER: true, SME: true, REVIEWER: false, CONTENT_MANAGER: true, VIEWER: false },
    { module: 'Bulk Document Question Extraction', SUPER_ADMIN: true, QB_MANAGER: true, SME: false, REVIEWER: false, CONTENT_MANAGER: true, VIEWER: false },
    { module: 'YoShorts Educational Video Creation', SUPER_ADMIN: true, QB_MANAGER: true, SME: false, REVIEWER: false, CONTENT_MANAGER: true, VIEWER: false },
    { module: 'YoShorts Transcript Verification', SUPER_ADMIN: true, QB_MANAGER: true, SME: true, REVIEWER: true, CONTENT_MANAGER: false, VIEWER: false },
    { module: 'Unified Content Review Queue Approval', SUPER_ADMIN: true, QB_MANAGER: true, SME: true, REVIEWER: true, CONTENT_MANAGER: false, VIEWER: false },
    { module: 'Taxonomy & Syllabus Mapping Config', SUPER_ADMIN: true, QB_MANAGER: true, SME: false, REVIEWER: false, CONTENT_MANAGER: false, VIEWER: false },
    { module: 'User Management & Role Permissions', SUPER_ADMIN: true, QB_MANAGER: false, SME: false, REVIEWER: false, CONTENT_MANAGER: false, VIEWER: false },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users2 className="w-6 h-6 text-indigo-600" />
          <span>User & Role Management</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Role-based access control (RBAC) and permissions for Super Admins, QB Managers, SMEs, Reviewers, and Content Managers.
        </p>
      </div>

      {/* Users List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Active Team Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Permissions Scope</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                  <td className="py-3 px-3 text-slate-600">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {u.role === 'SUPER_ADMIN'
                      ? 'Full System Authority'
                      : u.role === 'SME'
                      ? 'Academic Verification & Rubrics'
                      : u.role === 'CONTENT_MANAGER'
                      ? 'Question Creation & Ingestion'
                      : 'Repository Access'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Role Permissions Matrix</h3>
          <p className="text-xs text-slate-400">Functional capabilities assigned to each role</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Feature / Capability</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
                <th className="py-3 px-3 text-center">QB Manager</th>
                <th className="py-3 px-3 text-center">SME</th>
                <th className="py-3 px-3 text-center">Reviewer</th>
                <th className="py-3 px-3 text-center">Content Mgr</th>
                <th className="py-3 px-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-medium text-slate-800">{row.module}</td>
                  <td className="py-3 px-3 text-center">
                    {row.SUPER_ADMIN ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.QB_MANAGER ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.SME ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.REVIEWER ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.CONTENT_MANAGER ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.VIEWER ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

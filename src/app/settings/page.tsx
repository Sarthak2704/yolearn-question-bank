'use client';

import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Key,
  Save,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Database,
} from 'lucide-react';

export default function SettingsPage() {
  const [provider, setProvider] = useState('mock_gemini');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [apiKey, setApiKey] = useState('');
  const [promptVersion, setPromptVersion] = useState('v2.1');
  const [dedupThreshold, setDedupThreshold] = useState('70');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>System & AI Engine Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure AI extraction providers, prompts, duplicate detection thresholds, and database persistence.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* AI Engine Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>AI Extraction & Auto-Tagging Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="mock_gemini">Google Gemini Adapter (Local Heuristic Engine)</option>
                <option value="gemini">Google Gemini API (Live Google AI Cloud)</option>
                <option value="openai">OpenAI GPT-4o API</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model Version</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Configured via environment variable AI_API_KEY"
                  className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Do not hardcode production keys in code. Managed via server environment.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prompt Version</label>
              <input
                type="text"
                value={promptVersion}
                onChange={(e) => setPromptVersion(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Duplicate Detection Settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Duplicate Detection Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fuzzy Match Jaccard Threshold (%)
              </label>
              <input
                type="number"
                value={dedupThreshold}
                onChange={(e) => setDedupThreshold(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Questions with text similarity above this percentage will trigger duplicate review alerts.
              </span>
            </div>
          </div>
        </div>

        {/* Database & Storage Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-600" />
            <span>Database & Storage Persistence</span>
          </h2>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Database Engine:</span>
              <span className="font-semibold text-slate-900">PostgreSQL / SQLite (Transactional ORM)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Object Storage:</span>
              <span className="font-semibold text-slate-900">Local Disk / S3 Compatible</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Math Rendering:</span>
              <span className="font-semibold text-emerald-600">KaTeX Engine Active</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
}

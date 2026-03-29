import React, { useState } from 'react';
import { Search, Filter, Download, Plus, TrendingUp, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { KeywordData } from '../types';

const mockKeywords: KeywordData[] = [
  { keyword: 'seo strategy 2026', volume: '12.5k', difficulty: 45, intent: 'Informational' },
  { keyword: 'best marketing tools', volume: '45.2k', difficulty: 82, intent: 'Commercial' },
  { keyword: 'how to grow tiktok', volume: '8.4k', difficulty: 32, intent: 'Informational' },
  { keyword: 'nexus seo suite pricing', volume: '1.2k', difficulty: 15, intent: 'Transactional' },
  { keyword: 'content marketing guide', volume: '22.1k', difficulty: 68, intent: 'Informational' },
  { keyword: 'social media automation', volume: '15.8k', difficulty: 54, intent: 'Commercial' },
];

export default function KeywordExplorer() {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Keyword Explorer</h1>
          <p className="text-slate-500">Discover high-intent keywords and cluster them for maximum reach.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Create Cluster
        </button>
      </header>

      <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter a seed keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md border border-[var(--color-line)] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-[var(--color-line)]">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keyword</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Intent</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {mockKeywords.map((kw, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium text-slate-900">{kw.keyword}</td>
                <td className="px-6 py-4 text-slate-600">{kw.volume}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px]">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          kw.difficulty > 70 ? "bg-rose-500" : kw.difficulty > 40 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${kw.difficulty}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{kw.difficulty}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    kw.intent === 'Informational' ? "bg-blue-50 text-blue-600" :
                    kw.intent === 'Commercial' ? "bg-purple-50 text-purple-600" :
                    kw.intent === 'Transactional' ? "bg-emerald-50 text-emerald-600" :
                    "bg-slate-50 text-slate-600"
                  )}>
                    {kw.intent}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

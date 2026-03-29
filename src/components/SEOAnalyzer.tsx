import React, { useState } from 'react';
import { Search, Globe, AlertCircle, CheckCircle2, Info, ArrowRight, Video, Sparkles, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEOAuditResult } from '../types';
import { SYSTEM_INSTRUCTION } from '../lib/gemini';
import puter from '@heyputer/puter.js';

export default function SEOAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SEOAuditResult | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [teardownScript, setTeardownScript] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!url) return;
    setIsAnalyzing(true);
    setTeardownScript(null);
    // Simulate analysis
    setTimeout(() => {
      setResult({
        score: 78,
        critical: [
          'Missing meta description',
          'Large image files (3.2MB total)',
          'No H1 tag found'
        ],
        warnings: [
          'Low text-to-HTML ratio',
          'Missing alt tags on 4 images',
          'Render-blocking resources'
        ],
        passed: [
          'SSL Certificate valid',
          'Mobile responsive',
          'Canonical tag present',
          'Robots.txt found'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateTeardownScript = async () => {
    if (!result || !url) return;
    setIsGeneratingScript(true);
    try {
      const prompt = `Generate a viral "SEO Teardown" short video script (TikTok/Reel) for the website: ${url}.
      Based on these audit results:
      - Score: ${result.score}
      - Critical Issues: ${result.critical.join(', ')}
      - Warnings: ${result.warnings.join(', ')}
      
      The script should be high-energy, educational, and demonstrate expertise. 
      Include a hook, the "teardown" of the issues, and a call to action to use Nexus Suite for their own audit.
      Format it with [Visual] and [Audio] cues.`;

      const responseText = await puter.ai.chat(
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        { model: "gemini-3.1-pro-preview" }
      );

      setTeardownScript(responseText || 'Failed to generate script.');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">SEO Analyzer</h1>
        <p className="text-slate-500">Technical audit and optimization recommendations for any webpage.</p>
      </header>

      <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm">
        <div className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            {!isAnalyzing && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col items-center justify-center text-center">
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * result.score) / 100}
                    className="text-blue-600 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">{result.score}</span>
                  <span className="text-sm font-medium text-slate-500">SEO Score</span>
                </div>
              </div>
              <p className="text-slate-600 mb-6">Your site is performing better than 65% of competitors in your niche.</p>
              
              <button 
                onClick={generateTeardownScript}
                disabled={isGeneratingScript}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingScript ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                Generate Teardown Script
              </button>
            </div>

            {teardownScript && (
              <div className="bg-slate-900 p-6 rounded-md text-white flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500 relative">
                <button 
                  onClick={() => setTeardownScript(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Video Teardown Script</span>
                </div>
                <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto pr-2">
                  {teardownScript}
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(teardownScript);
                    alert('Script copied to clipboard!');
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md text-[10px] font-bold transition-all"
                >
                  Copy Script
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                Critical Issues
              </h3>
              <ul className="flex flex-col gap-3">
                {result.critical.map((issue, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 bg-rose-50 p-3 rounded-md border border-rose-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-600">
                <Info className="w-5 h-5" />
                Warnings
              </h3>
              <ul className="flex flex-col gap-3">
                {result.warnings.map((issue, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 bg-amber-50 p-3 rounded-md border border-amber-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                Passed Checks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.passed.map((check, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600 bg-emerald-50 p-3 rounded-md border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {check}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

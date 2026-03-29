import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Layers, 
  Target, 
  FileText, 
  Code, 
  Share2, 
  Loader2, 
  Check, 
  Copy, 
  ArrowRight,
  ChevronRight,
  Plus,
  Sparkles,
  Database,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SYSTEM_INSTRUCTION } from '../lib/gemini';
import { TopicalMap, SERPAnalysis, ContentOutline } from '../types';
import ExportToolbar from './ExportToolbar';
import puter from '@heyputer/puter.js';

export default function ContentMachine() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [seedKeyword, setSeedKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [topicalMap, setTopicalMap] = useState<TopicalMap | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [serpAnalysis, setSerpAnalysis] = useState<SERPAnalysis | null>(null);
  const [finalContent, setFinalContent] = useState<ContentOutline | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const generateTopicalMap = async () => {
    if (!seedKeyword.trim()) return;
    setIsGenerating(true);
    setTopicalMap(null);
    setFinalContent(null);
    setSerpAnalysis(null);
    try {
      const prompt = `Generate a "Hub and Spoke" topical map for the seed keyword: "${seedKeyword}".
      Identify one massive Pillar Page concept and 10-15 supporting cluster articles that interlink.
      Return as JSON:
      {
        "pillar": { "title": "...", "description": "...", "keywords": ["..."] },
        "clusters": [{ "title": "...", "intent": "...", "keywords": ["..."] }]
      }`;

      const responseText = await puter.ai.chat(
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        { 
          model: "gemini-3.1-pro-preview",
          response_format: { type: "json_object" }
        }
      );

      // Clean up markdown formatting if present
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson || '{}');
      setTopicalMap(data);
      setStep(1);
    } catch (error) {
      console.error("Topical map error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeSERP = async (topic: string) => {
    setSelectedTopic(topic);
    setIsGenerating(true);
    setFinalContent(null);
    try {
      const prompt = `Perform a SERP Skyscraper Analysis for the topic: "${topic}".
      Analyze search intent, identify gaps in top 3 results, extract "People Also Ask" questions, and identify key NLP entities and LSI keywords.
      Return as JSON:
      {
        "intent": "...",
        "topResultsGaps": ["..."],
        "peopleAlsoAsk": ["..."],
        "entities": ["..."],
        "lsiKeywords": ["..."]
      }`;

      const responseText = await puter.ai.chat(
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        { 
          model: "gemini-3.1-pro-preview",
          response_format: { type: "json_object" }
        }
      );

      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson || '{}');
      setSerpAnalysis(data);
      setStep(2);
    } catch (error) {
      console.error("SERP analysis error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFinalContent = async () => {
    if (!selectedTopic || !serpAnalysis) return;
    setIsGenerating(true);
    try {
      const prompt = `You are an elite SEO Strategist and Expert Technical Copywriter. 
      Your goal is to generate a comprehensively better SEO article for: "${selectedTopic}".
      
      Strict Constraints & Requirements:
      1. Search Intent Mastery: Open with a strong hook (PAS framework: Problem, Agitation, Solution) that immediately satisfies the user's primary search intent.
      2. Semantic SEO & Entities: Naturally integrate these NLP entities: ${serpAnalysis.entities.join(', ')} and these LSI keywords: ${serpAnalysis.lsiKeywords.join(', ')}.
      3. Formatting for Readability: Use hierarchical H2 and H3 tags. Keep paragraphs short (2-3 sentences max). Include bulleted or numbered lists. Bold key concepts.
      4. Content Gap Filling: Include a "Frequently Asked Questions (FAQ)" section at the bottom addressing these "People Also Ask" questions: ${serpAnalysis.peopleAlsoAsk.join(', ')}.
      5. Internal Linking: Suggest 2-3 natural anchor texts within the body that should link back to the main Pillar Topic: ${topicalMap?.pillar.title}.
      6. Technical Output: Provide clean, semantic HTML5 format.
      7. Schema Markup: Generate a valid JSON-LD <script> tag for 'FAQPage' schema.
      
      Return as JSON:
      {
        "title": "...",
        "metaDescription": "...",
        "slug": "...",
        "sections": [{ "heading": "...", "points": ["..."] }],
        "schema": "...",
        "html": "..."
      }`;

      const responseText = await puter.ai.chat(
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        { 
          model: "gemini-3.1-pro-preview",
          response_format: { type: "json_object" }
        }
      );

      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson || '{}');
      setFinalContent(data);
      setStep(3);
    } catch (error) {
      console.error("Content generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToWordPress = async () => {
    if (!finalContent) return;
    
    const wpUrl = localStorage.getItem('wp_url');
    const wpUser = localStorage.getItem('wp_user');
    const wpPassword = localStorage.getItem('wp_password');

    if (!wpUrl || !wpUser || !wpPassword) {
      setExportStatus({ type: 'error', message: 'Please configure WordPress settings in the Settings view.' });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const auth = btoa(`${wpUser}:${wpPassword}`);
      const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          title: finalContent.title,
          content: finalContent.html,
          status: 'draft',
          excerpt: finalContent.metaDescription,
          slug: finalContent.slug
        })
      });

      if (response.ok) {
        setExportStatus({ type: 'success', message: 'Post exported to WordPress as draft!' });
      } else {
        const err = await response.json();
        setExportStatus({ type: 'error', message: `Export failed: ${err.message || response.statusText}` });
      }
    } catch (error) {
      setExportStatus({ type: 'error', message: 'Export failed. Check your URL and credentials.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Content Machine</h1>
        <p className="text-slate-500">Automate topical authority and rank #1 with AI-engineered content.</p>
      </header>

      {/* Progress Stepper */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-md border border-[var(--color-line)] shadow-sm">
        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all", step === 1 ? "bg-blue-600 text-white" : "text-slate-400")}>
          <Layers className="w-4 h-4" />
          1. Topical Map
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all", step === 2 ? "bg-blue-600 text-white" : "text-slate-400")}>
          <Target className="w-4 h-4" />
          2. SERP Analysis
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all", step === 3 ? "bg-blue-600 text-white" : "text-slate-400")}>
          <FileText className="w-4 h-4" />
          3. Content Engine
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Seed Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Remote Work Tools"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={generateTopicalMap}
                disabled={isGenerating || !seedKeyword.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isGenerating && step === 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Topical Map
              </button>
            </div>

            {topicalMap && (
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Cluster to Analyze</p>
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                  <button 
                    onClick={() => analyzeSERP(topicalMap.pillar.title)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-md border transition-all text-sm font-bold flex items-center justify-between group",
                      selectedTopic === topicalMap.pillar.title ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      {topicalMap.pillar.title}
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Pillar</span>
                  </button>
                  {topicalMap.clusters.map((cluster, i) => (
                    <button 
                      key={i}
                      onClick={() => analyzeSERP(cluster.title)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-md border transition-all text-sm flex items-center justify-between group",
                        selectedTopic === cluster.title ? "border-blue-600 bg-blue-50 text-blue-700 font-bold" : "border-slate-100 hover:border-slate-200 text-slate-600"
                      )}
                    >
                      {cluster.title}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {isGenerating && (
            <div className="bg-white p-12 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-4 items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <div>
                <p className="text-lg font-bold text-slate-900">Nexus AI is Processing...</p>
                <p className="text-sm text-slate-500">
                  {step === 1 ? "Mapping topical authority clusters..." : 
                   step === 2 ? "Analyzing SERP gaps and NLP entities..." : 
                   "Engineering comprehensively better content..."}
                </p>
              </div>
            </div>
          )}

          {!isGenerating && step === 1 && topicalMap && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900 p-8 rounded-md text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Pillar Page Concept</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{topicalMap.pillar.title}</h2>
                  <p className="text-slate-400 leading-relaxed max-w-2xl mb-6">{topicalMap.pillar.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {topicalMap.pillar.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/10">#{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topicalMap.clusters.map((cluster, i) => (
                  <div key={i} className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{cluster.intent}</span>
                      <button onClick={() => analyzeSERP(cluster.title)} className="text-slate-300 group-hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{cluster.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.keywords.slice(0, 3).map((kw, j) => (
                        <span key={j} className="text-[10px] text-slate-400">#{kw}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isGenerating && step === 2 && serpAnalysis && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">SERP Skyscraper Analysis</h2>
                    <p className="text-slate-500">Topic: <span className="text-blue-600 font-bold">{selectedTopic}</span></p>
                  </div>
                  <button 
                    onClick={generateFinalContent}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Engineer Content
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-6">
                    <div className="bg-rose-50 p-6 rounded-md border border-rose-100">
                      <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Content Gaps in Top 3
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {serpAnalysis.topResultsGaps.map((gap, i) => (
                          <li key={i} className="text-sm text-rose-900 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-md border border-blue-100">
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        People Also Ask
                      </h4>
                      <ul className="flex flex-col gap-3">
                        {serpAnalysis.peopleAlsoAsk.map((q, i) => (
                          <li key={i} className="text-sm text-blue-900 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="bg-emerald-50 p-6 rounded-md border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        NLP Entities & LSI Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {serpAnalysis.entities.map((e, i) => (
                          <span key={i} className="px-2 py-1 bg-white text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">{e}</span>
                        ))}
                        {serpAnalysis.lsiKeywords.map((k, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">{k}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-md border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Search Intent</h4>
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">{serpAnalysis.intent}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isGenerating && step === 3 && finalContent && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{finalContent.title}</h2>
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-slate-500 text-sm max-w-2xl">{finalContent.metaDescription}</p>
                      {finalContent.slug && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-mono rounded border border-slate-200">
                          /{finalContent.slug}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(finalContent.html)}
                      className="px-4 py-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-md border border-slate-100"
                      title="Copy HTML"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Code className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={exportToWordPress}
                      disabled={isExporting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                      Export to WordPress
                    </button>
                  </div>
                </div>

                {exportStatus && (
                  <div className={cn(
                    "mb-6 p-4 rounded-md text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2",
                    exportStatus.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                  )}>
                    {exportStatus.type === 'success' ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {exportStatus.message}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 prose prose-slate max-w-none">
                    <div className="bg-slate-50 p-8 rounded-md border border-slate-100 overflow-y-auto max-h-[600px] mb-4">
                      <div dangerouslySetInnerHTML={{ __html: finalContent.html }} />
                    </div>
                    <ExportToolbar 
                      content={finalContent.html} 
                      filename={finalContent.slug || `seo-article-${Date.now()}`} 
                      exportType="html" 
                    />
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-900 p-6 rounded-md text-white">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        JSON-LD Schema
                      </h4>
                      <pre className="text-[10px] text-slate-400 overflow-x-auto bg-black/30 p-4 rounded-md">
                        {finalContent.schema}
                      </pre>
                      <button 
                        onClick={() => handleCopy(finalContent.schema)}
                        className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-bold transition-all"
                      >
                        Copy Schema
                      </button>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-md border border-blue-100">
                      <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Content Outline</h4>
                      <div className="flex flex-col gap-4">
                        {finalContent.sections.map((section, i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-xs font-bold text-slate-900">{section.heading}</p>
                            <ul className="space-y-1">
                              {section.points.slice(0, 2).map((p, j) => (
                                <li key={j} className="text-[10px] text-slate-500 flex items-start gap-1">
                                  <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!topicalMap && !isGenerating && (
            <div className="h-[500px] bg-white rounded-md border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12 text-slate-300">
              <Zap className="w-20 h-20 mb-6 opacity-10" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">Content Machine Offline</h3>
              <p className="max-w-md">Enter a seed keyword on the left to start building your topical authority engine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

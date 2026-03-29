import React, { useState } from 'react';
import { 
  Rocket, 
  Zap, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Video, 
  Globe, 
  Search,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SYSTEM_INSTRUCTION } from '../lib/gemini';
import puter from '@heyputer/puter.js';

export default function GrowthHub() {
  const [activeTab, setActiveTab] = useState<'micro-tools' | 'prompt-library'>('micro-tools');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Growth Hub</h1>
        <p className="text-slate-500">Engineering as marketing: Free tools and open-source prompts to grow your audience.</p>
      </header>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-md w-fit">
        <button 
          onClick={() => setActiveTab('micro-tools')}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-bold transition-all",
            activeTab === 'micro-tools' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Micro-Tools
        </button>
        <button 
          onClick={() => setActiveTab('prompt-library')}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-bold transition-all",
            activeTab === 'prompt-library' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Prompt Library
        </button>
      </div>

      {activeTab === 'micro-tools' ? <MicroTools /> : <PromptLibrary handleCopy={handleCopy} copied={copied} />}
    </div>
  );
}

function MicroTools() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <TikTokHookGenerator />
      <MetaTagAuditor />
    </div>
  );
}

function TikTokHookGenerator() {
  const [topic, setTopic] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHooks = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `Generate 3 viral TikTok hooks for the topic: "${topic}". 
      Make them high-energy, scroll-stopping, and curiosity-driven.
      Return as JSON: { "hooks": ["...", "...", "..."] }`;

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
      setHooks(data.hooks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-100 rounded-md flex items-center justify-center text-rose-600">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">TikTok Hook Generator</h3>
          <p className="text-xs text-slate-500">Stop the scroll with AI-powered hooks.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Enter your video topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all text-sm"
        />
        <button 
          onClick={generateHooks}
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Hooks
        </button>
      </div>

      {hooks.length > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          {hooks.map((hook, i) => (
            <div key={i} className="p-3 bg-rose-50 rounded-md text-sm text-rose-900 border border-rose-100 italic">
              "{hook}"
            </div>
          ))}
          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 mb-2">Want full scripts and scene breakdowns?</p>
            <button className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 mx-auto">
              Try Nexus Pro <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaTagAuditor() {
  const [url, setUrl] = useState('');
  const [audit, setAudit] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const performAudit = async () => {
    if (!url.trim()) return;
    setIsAuditing(true);
    // Simulate meta tag extraction since we can't easily fetch external HTML in browser without proxy
    // In a real app, this would call a backend route
    setTimeout(() => {
      setAudit({
        title: "Nexus SEO & Marketing Suite | Scale Your Organic Growth",
        description: "The ultimate omnichannel content planner and SEO machine. Automate your topical authority and social media scripts with AI.",
        ogImage: "https://nexus-suite.com/og-image.png",
        status: 'warning',
        suggestions: [
          "Title is 62 characters (Good)",
          "Description is 142 characters (Good)",
          "Missing Twitter Card metadata",
          "H1 tag matches title (Good)"
        ]
      });
      setIsAuditing(false);
    }, 1500);
  };

  return (
    <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Meta Tag Auditor</h3>
          <p className="text-xs text-slate-500">Check how your site looks in search results.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
        />
        <button 
          onClick={performAudit}
          disabled={isAuditing || !url.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Audit Meta Tags
        </button>
      </div>

      {audit && (
        <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-md border border-slate-100 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Google Preview</p>
            <p className="text-blue-700 text-lg font-medium hover:underline cursor-pointer truncate">{audit.title}</p>
            <p className="text-emerald-700 text-xs truncate">{url}</p>
            <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{audit.description}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</p>
            <div className="grid grid-cols-1 gap-2">
              {audit.suggestions.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className={cn("w-1.5 h-1.5 rounded-full", s.includes('(Good)') ? "bg-emerald-500" : "bg-amber-500")} />
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 mb-2">Need a full technical SEO audit?</p>
            <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mx-auto">
              Open SEO Analyzer <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PromptLibrary({ handleCopy, copied }: { handleCopy: (t: string, id: string) => void, copied: string | null }) {
  const prompts = [
    {
      id: 'system',
      title: 'Nexus System Instruction',
      description: 'The core logic that powers the Nexus Growth Strategist.',
      content: SYSTEM_INSTRUCTION
    },
    {
      id: 'topical-map',
      title: 'Topical Map Generator',
      description: 'The prompt used to engineer hub-and-spoke authority maps.',
      content: `Generate a "Hub and Spoke" topical map for the seed keyword: "{seedKeyword}".
Identify one massive Pillar Page concept and 10-15 supporting cluster articles that interlink.
Return as JSON:
{
  "pillar": { "title": "...", "description": "...", "keywords": ["..."] },
  "clusters": [{ "title": "...", "intent": "...", "keywords": ["..."] }]
}`
    },
    {
      id: 'social-script',
      title: 'Viral Video Scripting',
      description: 'Engineered for high retention and dwell time on TikTok/Reels.',
      content: `Generate a high-converting {activeFormat} script for {activePlatform} about: "{topic}". 
Use the {activeFramework} framework.
Provide a scene-by-scene breakdown with:
- time
- visual
- audio
- textOnScreen
- bRollSuggestion`
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {prompts.map((p) => (
        <div key={p.id} className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                {p.title}
              </h3>
              <p className="text-xs text-slate-500">{p.description}</p>
            </div>
            <button 
              onClick={() => handleCopy(p.content, p.id)}
              className="p-2 hover:bg-slate-50 rounded-md transition-colors"
            >
              {copied === p.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
          <div className="bg-slate-900 p-6 rounded-md">
            <code className="text-xs text-blue-400 font-mono whitespace-pre-wrap leading-relaxed">
              {p.content}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Video, 
  Type, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check,
  Zap,
  Play,
  Image as ImageIcon,
  Hash,
  AtSign,
  Film,
  Layers,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SYSTEM_INSTRUCTION } from '../lib/gemini';
import { VideoScript, VideoScene, Platform, ContentFormat } from '../types';
import ExportToolbar from './ExportToolbar';
import puter from '@heyputer/puter.js';

const frameworks = [
  { id: 'pas', name: 'PAS', description: 'Problem - Agitate - Solution' },
  { id: 'aida', name: 'AIDA', description: 'Attention - Interest - Desire - Action' },
  { id: 'bab', name: 'BAB', description: 'Before - After - Bridge' },
];

const platforms: { id: Platform; label: string; formats: { id: ContentFormat; label: string }[] }[] = [
  { 
    id: 'tiktok', 
    label: 'TikTok / Shorts', 
    formats: [{ id: 'short', label: 'Short Video' }] 
  },
  { 
    id: 'instagram', 
    label: 'Instagram', 
    formats: [
      { id: 'reel', label: 'Reel' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'story', label: 'Story' }
    ] 
  },
  { 
    id: 'facebook', 
    label: 'Facebook', 
    formats: [
      { id: 'post', label: 'Page Post' },
      { id: 'group-post', label: 'Group Post' }
    ] 
  },
  { 
    id: 'pinterest', 
    label: 'Pinterest', 
    formats: [{ id: 'pin', label: 'Static Pin' }] 
  },
  { 
    id: 'linkedin', 
    label: 'LinkedIn', 
    formats: [{ id: 'post', label: 'Professional Post' }] 
  },
];

export default function SocialScripts() {
  const [activeFramework, setActiveFramework] = useState('pas');
  const [activePlatform, setActivePlatform] = useState<Platform>('tiktok');
  const [activeFormat, setActiveFormat] = useState<ContentFormat>('short');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [metadata, setMetadata] = useState<{ imagePrompt?: string; hashtags?: string[]; mentions?: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    try {
      const prompt = `Generate a high-converting ${activeFormat} script for ${activePlatform} about: "${topic}". 
      Use the ${activeFramework.toUpperCase()} framework.
      
      If it's a video format (short, reel), provide a scene-by-scene breakdown with:
      - time (e.g. 0:00-0:03)
      - visual (what happens on screen)
      - audio (what is said)
      - textOnScreen (captions)
      - bRollSuggestion (stock footage ideas)
      
      Also provide:
      - imagePrompt (for AI image generators)
      - hashtags (trending, low-competition)
      - mentions (relevant accounts)
      
      Return as JSON matching this structure:
      {
        "hook": "...",
        "scenes": [{ "time": "...", "visual": "...", "audio": "...", "textOnScreen": "...", "bRollSuggestion": "..." }],
        "cta": "...",
        "metadata": { "imagePrompt": "...", "hashtags": ["..."], "mentions": ["..."] }
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
      setScript({
        hook: data.hook,
        scenes: data.scenes,
        cta: data.cta
      });
      setMetadata(data.metadata);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
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
        <h1 className="text-3xl font-bold text-slate-900">Omnichannel Scripting</h1>
        <p className="text-slate-500">Platform-native scripts with scene breakdowns and visual prompts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Topic or Product</label>
              <textarea 
                placeholder="e.g. A new AI tool that automates SEO audits..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-24 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Platform & Format</label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePlatform(p.id);
                      setActiveFormat(p.formats[0].id);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-md border text-xs font-bold transition-all",
                      activePlatform === p.id 
                        ? "border-blue-600 bg-blue-50 text-blue-600" 
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {activePlatform && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {platforms.find(p => p.id === activePlatform)?.formats.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFormat(f.id)}
                      className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all",
                        activeFormat === f.id 
                          ? "border-slate-900 bg-slate-900 text-white" 
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Framework</label>
              <div className="grid grid-cols-1 gap-2">
                {frameworks.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFramework(f.id)}
                    className={cn(
                      "text-left p-3 rounded-md border transition-all",
                      activeFramework === f.id 
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <p className="text-sm font-bold text-slate-900">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Generating...' : 'Generate Script'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {!script && !isGenerating && (
            <div className="bg-white p-12 rounded-md border border-dashed border-slate-300 flex flex-col items-center justify-center text-center text-slate-400">
              <Zap className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Enter a topic and select a platform to generate your growth engine.</p>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-40 bg-slate-100 rounded-md" />
              <div className="h-64 bg-slate-100 rounded-md" />
            </div>
          )}

          {script && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Hook Section */}
              <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-900">The Hook</h3>
                  </div>
                  <button onClick={() => handleCopy(script.hook)} className="text-slate-400 hover:text-slate-600">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-lg font-medium text-slate-900 italic leading-relaxed">"{script.hook}"</p>
              </div>

              {/* Scene Breakdown */}
              <div className="bg-white rounded-md border border-[var(--color-line)] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[var(--color-line)] bg-slate-50 flex items-center gap-2">
                  <Film className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900">Scene-by-Scene Breakdown</h3>
                </div>
                <div className="divide-y divide-[var(--color-line)]">
                  {script.scenes.map((scene, i) => (
                    <div key={i} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 hover:bg-slate-50 transition-colors">
                      <div className="md:col-span-2 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-blue-600 font-mono text-xs font-bold">
                          <Clock className="w-3 h-3" />
                          {scene.time}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scene {i + 1}</span>
                      </div>
                      <div className="md:col-span-5 flex flex-col gap-3">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Visual Action</p>
                          <p className="text-sm text-slate-800">{scene.visual}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Audio / Script</p>
                          <p className="text-sm font-medium text-slate-900">"{scene.audio}"</p>
                        </div>
                      </div>
                      <div className="md:col-span-5 flex flex-col gap-3">
                        <div className="bg-slate-100 p-3 rounded-md border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            Text on Screen
                          </p>
                          <p className="text-xs font-bold text-blue-600">{scene.textOnScreen}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                          <p className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            B-Roll Suggestion
                          </p>
                          <p className="text-xs text-amber-800">{scene.bRollSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata Section */}
              {metadata && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-slate-900">AI Visual Prompt</h3>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md border border-purple-100 relative group">
                      <p className="text-xs text-purple-900 leading-relaxed">{metadata.imagePrompt}</p>
                      <button 
                        onClick={() => handleCopy(metadata.imagePrompt || '')}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded shadow-sm"
                      >
                        <Copy className="w-3 h-3 text-purple-600" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Hash className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-900">Hashtags & Mentions</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {metadata.hashtags?.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metadata.mentions?.map((mention, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                          <AtSign className="w-3 h-3" />
                          {mention}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Export Toolbar */}
              <div className="pt-4">
                <ExportToolbar 
                  content={`HOOK:\n${script.hook}\n\nSCENES:\n${script.scenes.map((s, i) => `Scene ${i+1} (${s.time}):\nVisual: ${s.visual}\nAudio: ${s.audio}\nText: ${s.textOnScreen}\nB-Roll: ${s.bRollSuggestion}`).join('\n\n')}\n\nCTA:\n${script.cta}${metadata ? `\n\nMETADATA:\nImage Prompt: ${metadata.imagePrompt}\nHashtags: ${metadata.hashtags?.join(', ')}\nMentions: ${metadata.mentions?.join(', ')}` : ''}`}
                  filename={`${activePlatform}-${activeFormat}-script`}
                  exportType="text"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

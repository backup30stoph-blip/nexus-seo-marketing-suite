import React from 'react';
import { 
  History, 
  CheckCircle2, 
  Bug, 
  Zap, 
  Code, 
  Layout, 
  Sparkles, 
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function DevLog() {
  const updates = [
    {
      date: 'Mar 28, 2026',
      title: 'The Content Machine Creator',
      type: 'feature',
      description: 'Automated topical authority mapping and SERP skyscraper analysis. Added direct WordPress CMS export.',
      icon: Zap,
      color: 'bg-amber-100 text-amber-600'
    },
    {
      date: 'Mar 27, 2026',
      title: 'Omnichannel Expansion',
      type: 'feature',
      description: 'Support for Instagram Reels, Carousels, Stories, and Pinterest board strategies. Added AI visual prompting.',
      icon: Layout,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      date: 'Mar 26, 2026',
      title: 'Gemini 3.1 Pro Integration',
      type: 'tech',
      description: 'Upgraded core AI logic to Gemini 3.1 Pro for faster reasoning and structured JSON output.',
      icon: Code,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      date: 'Mar 25, 2026',
      title: 'HMR & SDK Fixes',
      type: 'bug',
      description: 'Resolved race conditions in Gemini SDK initialization and fixed HMR-related state persistence issues.',
      icon: Bug,
      color: 'bg-rose-100 text-rose-600'
    },
    {
      date: 'Mar 24, 2026',
      title: 'Initial MVP Launch',
      type: 'feature',
      description: 'Core SEO Analyzer and Keyword Explorer launched with React 19 and Tailwind 4.',
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dev Log</h1>
          <p className="text-slate-500">Building Nexus in public. Documenting the journey from MVP to Market Leader.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-md border border-slate-200 hover:text-blue-600 transition-colors">
            <Twitter className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white rounded-md border border-slate-200 hover:text-blue-700 transition-colors">
            <Linkedin className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white rounded-md border border-slate-200 hover:text-slate-900 transition-colors">
            <Github className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100" />

        <div className="space-y-12">
          {updates.map((update, i) => (
            <div key={i} className="relative pl-16 group">
              {/* Timeline Dot */}
              <div className={cn(
                "absolute left-0 w-12 h-12 rounded-md flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                update.color
              )}>
                <update.icon className="w-6 h-6" />
              </div>

              <div className="bg-white p-8 rounded-md border border-[var(--color-line)] shadow-sm hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{update.date}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{update.title}</h3>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    update.type === 'feature' ? "bg-blue-50 text-blue-600" : 
                    update.type === 'tech' ? "bg-emerald-50 text-emerald-600" : 
                    "bg-rose-50 text-rose-600"
                  )}>
                    {update.type}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">{update.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-video bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center text-slate-300 text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                  <div className="aspect-video bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center text-slate-300 text-xs font-medium">
                    Code Snippet Placeholder
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((_, j) => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold">
                      +12
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    Read Full Post <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

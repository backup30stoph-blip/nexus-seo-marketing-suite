import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreHorizontal,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  X,
  Sparkles,
  Image as ImageIcon,
  Hash,
  AtSign,
  Loader2,
  Check,
  Copy,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eye,
  Edit3,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ThumbsUp,
  Share2,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Platform, ContentFormat, ContentSpoke } from '../types';
import { SYSTEM_INSTRUCTION } from '../lib/gemini';
import puter from '@heyputer/puter.js';

const platforms: { id: Platform; icon: any; color: string; formats: { id: ContentFormat; label: string }[] }[] = [
  { 
    id: 'instagram', 
    icon: Instagram, 
    color: 'text-pink-600',
    formats: [
      { id: 'reel', label: 'Reel' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'story', label: 'Story' }
    ]
  },
  { 
    id: 'facebook', 
    icon: Globe, 
    color: 'text-blue-700',
    formats: [
      { id: 'post', label: 'Page Post' },
      { id: 'group-post', label: 'Group Post' }
    ]
  },
  { 
    id: 'pinterest', 
    icon: Globe, 
    color: 'text-rose-600',
    formats: [{ id: 'pin', label: 'Pin' }]
  },
  { 
    id: 'tiktok', 
    icon: Youtube, 
    color: 'text-slate-900',
    formats: [{ id: 'short', label: 'TikTok' }]
  },
  { 
    id: 'linkedin', 
    icon: Linkedin, 
    color: 'text-blue-800',
    formats: [{ id: 'post', label: 'Post' }]
  },
];

const getDefaultAspectRatio = (platform: Platform, format: ContentFormat) => {
  if (['reel', 'story', 'short'].includes(format)) return 'aspect-[9/16]';
  if (format === 'pin') return 'aspect-[2/3]';
  if (platform === 'instagram') return 'aspect-[4/5]';
  return 'aspect-video';
};

export default function ContentPlanner() {
  const [events, setEvents] = useState([
    { day: 12, platform: 'web', title: 'SEO Guide: 2026 Trends' },
    { day: 12, platform: 'tiktok', title: '3 Tips for SEO' },
    { day: 14, platform: 'linkedin', title: 'B2B Growth Story' },
    { day: 15, platform: 'twitter', title: 'Thread: Automation' },
    { day: 18, platform: 'instagram', title: 'Behind the Scenes' },
  ]);
  const [currentMonth, setCurrentMonth] = useState('March 2026');
  const [showModal, setShowModal] = useState(false);
  const [scheduledDay, setScheduledDay] = useState<number>(new Date().getDate());
  const [platformSettings, setPlatformSettings] = useState({ targetAudience: '', optimalTime: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('reel');
  const [generatedContent, setGeneratedContent] = useState<ContentSpoke | null>(null);
  const [editedContent, setEditedContent] = useState<{
    hook: string;
    description: string;
    imagePrompt: string;
    hashtags: string[];
    mentions: string[];
    aspectRatio: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `Generate a platform-native content plan for ${selectedPlatform} (${selectedFormat}) about: "${topic}".
      ${platformSettings.targetAudience ? `Target Audience: ${platformSettings.targetAudience}` : ''}
      ${platformSettings.optimalTime ? `Optimal Posting Time: ${platformSettings.optimalTime}` : ''}
      Provide:
      - hook (the opening line)
      - description (the body copy)
      - imagePrompt (detailed visual prompt for AI image generator)
      - hashtags (5 trending, low-competition)
      - mentions (3 relevant accounts)
      
      Return as JSON:
      {
        "hook": "...",
        "description": "...",
        "imagePrompt": "...",
        "hashtags": ["..."],
        "mentions": ["..."]
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
      setGeneratedContent({
        platform: selectedPlatform,
        type: selectedFormat,
        ...data
      });
      setEditedContent({
        hook: data.hook || '',
        description: data.description || '',
        imagePrompt: data.imagePrompt || '',
        hashtags: data.hashtags || [],
        mentions: data.mentions || [],
        aspectRatio: getDefaultAspectRatio(selectedPlatform, selectedFormat)
      });
      setActiveTab('edit');
    } catch (error) {
      console.error("Content generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('description-editor') as HTMLTextAreaElement;
    if (!textarea || !editedContent) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editedContent.description;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    setEditedContent({
      ...editedContent,
      description: `${before}${prefix}${selected}${suffix}${after}`
    });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSchedule = () => {
    if (!editedContent) return;
    
    const newEvent = {
      day: scheduledDay,
      platform: selectedPlatform,
      title: editedContent.hook || 'New Post'
    };
    
    setEvents([...events, newEvent]);
    setShowModal(false);
    setGeneratedContent(null);
    setEditedContent(null);
    setTopic('');
    setPlatformSettings({ targetAudience: '', optimalTime: '' });
  };

  const renderPreview = () => {
    if (!editedContent) return null;

    const isVideo = ['reel', 'story', 'short'].includes(selectedFormat);
    const isIG = selectedPlatform === 'instagram';
    const isFB = selectedPlatform === 'facebook';
    const isLI = selectedPlatform === 'linkedin';
    const isPin = selectedPlatform === 'pinterest';

    const tags = [...editedContent.hashtags.map(t => `#${t.replace(/^#/, '')}`), ...editedContent.mentions.map(m => `@${m.replace(/^@/, '')}`)];

    if (isVideo) {
      return (
        <div className={cn("relative bg-slate-900 overflow-hidden mx-auto rounded-md border-[6px] border-slate-800 shadow-2xl max-w-[280px] w-full flex flex-col", editedContent.aspectRatio)}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
            <ImageIcon className="w-10 h-10 text-slate-700 mb-3 opacity-50" />
            <p className="text-xs text-slate-500 italic line-clamp-4">"{editedContent.imagePrompt}"</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 z-10" />
          
          <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center z-20">
            <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><Heart className="w-5 h-5 text-white" /></div><span className="text-[10px] text-white font-medium">12K</span></div>
            <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div><span className="text-[10px] text-white font-medium">342</span></div>
            <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><Share2 className="w-5 h-5 text-white" /></div><span className="text-[10px] text-white font-medium">Share</span></div>
          </div>

          <div className="absolute bottom-4 left-4 right-16 z-20 text-white">
            <p className="text-sm font-bold mb-1 flex items-center gap-2">@yourbrand <Check className="w-3 h-3 bg-blue-500 rounded-full p-0.5" /></p>
            <p className="text-xs font-medium mb-1 line-clamp-2">{editedContent.hook}</p>
            <p className="text-[10px] opacity-80 line-clamp-1">{tags.join(' ')}</p>
          </div>
        </div>
      );
    }

    if (isIG) {
      return (
        <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5"><div className="w-full h-full bg-white rounded-full border border-white" /></div>
            <p className="text-sm font-bold text-slate-900 flex-1">yourbrand</p>
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </div>
          <div className={cn("w-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center relative border-y border-slate-100", editedContent.aspectRatio)}>
            <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 italic line-clamp-3">"{editedContent.imagePrompt}"</p>
          </div>
          <div className="p-3">
            <div className="flex gap-4 mb-3">
              <Heart className="w-6 h-6 text-slate-800" />
              <MessageCircle className="w-6 h-6 text-slate-800" />
              <Send className="w-6 h-6 text-slate-800" />
              <div className="flex-1" />
              <Bookmark className="w-6 h-6 text-slate-800" />
            </div>
            <p className="text-sm font-bold text-slate-900 mb-1">1,234 likes</p>
            <div className="text-sm text-slate-800">
              <span className="font-bold mr-2">yourbrand</span>
              <span>{editedContent.hook}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 line-clamp-2">
              <Markdown>{editedContent.description}</Markdown>
            </div>
            <p className="text-blue-800 text-xs mt-1 line-clamp-1">{tags.join(' ')}</p>
          </div>
        </div>
      );
    }

    if (isPin) {
      return (
        <div className={cn("max-w-[260px] mx-auto bg-slate-100 rounded-md shadow-sm overflow-hidden relative flex flex-col", editedContent.aspectRatio)}>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-0">
            <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 italic line-clamp-4">"{editedContent.imagePrompt}"</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
            <p className="text-sm font-bold line-clamp-2 mb-1">{editedContent.hook}</p>
            <p className="text-[10px] opacity-90 line-clamp-1">{tags.join(' ')}</p>
          </div>
        </div>
      );
    }

    // Default (Facebook / LinkedIn)
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center"><Globe className="w-5 h-5 text-slate-400" /></div>
          <div>
            <p className="text-sm font-bold text-slate-900">Your Brand</p>
            <p className="text-xs text-slate-500">Just now • 🌐</p>
          </div>
          <div className="flex-1" />
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </div>
        <div className="px-4 pb-3 text-sm text-slate-800">
          <p className="font-bold mb-2">{editedContent.hook}</p>
          <div className="mb-2 text-slate-700 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_a]:text-blue-600">
            <Markdown>{editedContent.description}</Markdown>
          </div>
          <p className="text-blue-600 text-xs">{tags.join(' ')}</p>
        </div>
        <div className={cn("w-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center relative border-t border-slate-100", editedContent.aspectRatio)}>
          <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-xs text-slate-400 italic line-clamp-3">"{editedContent.imagePrompt}"</p>
        </div>
        <div className="px-4 py-2 border-t border-slate-100 flex justify-between text-slate-500">
          <button className="flex items-center gap-2 text-xs font-bold hover:bg-slate-50 px-3 py-2 rounded-md"><ThumbsUp className="w-4 h-4" /> Like</button>
          <button className="flex items-center gap-2 text-xs font-bold hover:bg-slate-50 px-3 py-2 rounded-md"><MessageSquare className="w-4 h-4" /> Comment</button>
          <button className="flex items-center gap-2 text-xs font-bold hover:bg-slate-50 px-3 py-2 rounded-md"><Share2 className="w-4 h-4" /> Share</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Planner</h1>
          <p className="text-slate-500">Schedule and manage your multi-platform content engine.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
            <button className="p-2 hover:bg-slate-50 border-r border-slate-200"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-4 py-2 text-sm font-bold">{currentMonth}</span>
            <button className="p-2 hover:bg-slate-50 border-l border-slate-200"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden shadow-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const day = i - 2;
          const isCurrentMonth = day > 0 && day <= 31;
          const dayEvents = events.filter(e => e.day === day);

          return (
            <div key={i} className={cn(
              "bg-white min-h-[140px] p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50",
              !isCurrentMonth && "bg-slate-50/50"
            )}>
              <span className={cn(
                "text-xs font-bold mb-1 ml-1",
                !isCurrentMonth ? "text-slate-300" : "text-slate-500"
              )}>
                {isCurrentMonth ? day : ''}
              </span>
              {dayEvents.map((event, j) => {
                const platform = platforms.find(p => p.id === event.platform);
                const PlatformIcon = platform?.icon || Globe;
                return (
                  <div key={j} className="bg-slate-50 border border-slate-100 p-1.5 rounded-md flex items-center gap-2 group cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition-all">
                    <PlatformIcon className={cn("w-3 h-3 shrink-0", platform?.color)} />
                    <span className="text-[10px] font-medium text-slate-700 truncate">{event.title}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Omnichannel Content Creator</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-slate-700">What are we promoting?</label>
                  <textarea 
                    placeholder="e.g. A guide on Pinterest SEO for e-commerce brands..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-32 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-slate-700">Target Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {platforms.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPlatform(p.id);
                          setSelectedFormat(p.formats[0].id);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-md border transition-all",
                          selectedPlatform === p.id 
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                            : "border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <p.icon className={cn("w-5 h-5", p.color)} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{p.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-slate-700">Content Format</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.find(p => p.id === selectedPlatform)?.formats.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFormat(f.id)}
                        className={cn(
                          "px-4 py-2 rounded-md text-xs font-bold border transition-all",
                          selectedFormat === f.id 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-md border border-slate-100">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Platform Settings
                  </label>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Target Audience Demographics</label>
                      <input 
                        type="text"
                        placeholder="e.g. Gen Z, SaaS Founders, Fitness Enthusiasts..."
                        value={platformSettings.targetAudience}
                        onChange={(e) => setPlatformSettings({...platformSettings, targetAudience: e.target.value})}
                        className="w-full p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Optimal Posting Time</label>
                      <input 
                        type="time"
                        value={platformSettings.optimalTime}
                        onChange={(e) => setPlatformSettings({...platformSettings, optimalTime: e.target.value})}
                        className="w-full p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-slate-700">Schedule Date (March)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="31"
                    value={scheduledDay}
                    onChange={(e) => setScheduledDay(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {isGenerating ? 'Strategizing...' : 'Generate Omnichannel Plan'}
                </button>
              </div>

              <div className="lg:col-span-7">
                {!generatedContent && !isGenerating && (
                  <div className="h-full border-2 border-dashed border-slate-100 rounded-md flex flex-col items-center justify-center text-center p-12 text-slate-300">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-10" />
                    <p className="font-medium">Your AI-generated content strategy will appear here.</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex flex-col gap-6 animate-pulse">
                    <div className="h-24 bg-slate-50 rounded-md" />
                    <div className="h-48 bg-slate-50 rounded-md" />
                    <div className="h-32 bg-slate-50 rounded-md" />
                  </div>
                )}

                {generatedContent && editedContent && (
                  <div className="h-full flex flex-col bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 bg-slate-50 p-2 gap-2">
                      <button 
                        onClick={() => setActiveTab('edit')}
                        className={cn("px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all", activeTab === 'edit' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => setActiveTab('preview')}
                        className={cn("px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all", activeTab === 'preview' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
                      >
                        <Eye className="w-4 h-4" /> Preview
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 overflow-y-auto">
                      {activeTab === 'edit' ? (
                        <div className="flex flex-col gap-6">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">The Hook</label>
                            <input 
                              className="w-full p-3 rounded-md border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                              value={editedContent.hook} 
                              onChange={e => setEditedContent({...editedContent, hook: e.target.value})} 
                            />
                          </div>
                          
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Description</label>
                            <div className="border border-slate-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                              <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
                                <button onClick={() => insertFormatting('**', '**')} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><Bold className="w-4 h-4" /></button>
                                <button onClick={() => insertFormatting('*', '*')} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><Italic className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-slate-300 my-auto mx-1" />
                                <button onClick={() => insertFormatting('- ', '')} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><List className="w-4 h-4" /></button>
                                <button onClick={() => insertFormatting('1. ', '')} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><ListOrdered className="w-4 h-4" /></button>
                                <button onClick={() => insertFormatting('[', '](url)')} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><LinkIcon className="w-4 h-4" /></button>
                              </div>
                              <textarea 
                                id="description-editor"
                                className="w-full h-48 p-4 focus:outline-none text-sm resize-y text-slate-700"
                                value={editedContent.description}
                                onChange={(e) => setEditedContent({...editedContent, description: e.target.value})}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Image Prompt</label>
                            <textarea 
                              className="w-full p-3 rounded-md border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-y" 
                              value={editedContent.imagePrompt} 
                              onChange={e => setEditedContent({...editedContent, imagePrompt: e.target.value})} 
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Aspect Ratio</label>
                            <select 
                              className="w-full p-3 rounded-md border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                              value={editedContent.aspectRatio}
                              onChange={e => setEditedContent({...editedContent, aspectRatio: e.target.value})}
                            >
                              <option value="aspect-square">1:1 (Square)</option>
                              <option value="aspect-[4/5]">4:5 (Portrait)</option>
                              <option value="aspect-[9/16]">9:16 (Vertical Video)</option>
                              <option value="aspect-video">16:9 (Landscape)</option>
                              <option value="aspect-[2/3]">2:3 (Pinterest)</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Hashtags (comma separated)</label>
                              <input 
                                className="w-full p-3 rounded-md border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                value={editedContent.hashtags.join(', ')} 
                                onChange={e => setEditedContent({...editedContent, hashtags: e.target.value.split(',').map(s => s.trim())})} 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Mentions (comma separated)</label>
                              <input 
                                className="w-full p-3 rounded-md border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                value={editedContent.mentions.join(', ')} 
                                onChange={e => setEditedContent({...editedContent, mentions: e.target.value.split(',').map(s => s.trim())})} 
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-md p-4">
                          {renderPreview()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSchedule}
                disabled={!generatedContent}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white px-4 py-2 rounded-md text-sm font-bold transition-all shadow-lg shadow-slate-200"
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

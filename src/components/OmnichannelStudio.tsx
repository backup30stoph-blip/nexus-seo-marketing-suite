import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  HelpCircle, 
  MessageSquare,
  Sparkles,
  Download,
  Copy,
  Calendar,
  Loader2,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import puter from '@heyputer/puter.js';

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, aspect: 'aspect-[1.91/1]', geminiAspect: '16:9' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, aspect: 'aspect-square', geminiAspect: '1:1' },
  { id: 'x', label: 'X (Twitter)', icon: Twitter, aspect: 'aspect-video', geminiAspect: '16:9' },
  { id: 'threads', label: 'Threads', icon: MessageCircle, aspect: 'aspect-[3/4]', geminiAspect: '3:4' },
  { id: 'quora', label: 'Quora', icon: HelpCircle, aspect: 'aspect-video', geminiAspect: '16:9' },
  { id: 'reddit', label: 'Reddit', icon: MessageSquare, aspect: 'aspect-video', geminiAspect: '16:9' },
];

const HOOKS = [
  'PAS (Problem-Agitate-Solution)',
  'AIDA (Attention-Interest-Desire-Action)',
  'Contrarian Take',
  'Storytelling',
  'Direct Offer',
  'Question/Engagement'
];

const IMAGE_STYLES = [
  { id: 'b2b', label: 'Professional B2B', desc: 'Clean, corporate, trustworthy' },
  { id: 'vibrant', label: 'Creative & Vibrant', desc: 'Bold colors, high energy' },
  { id: 'minimalist', label: 'Minimalist Flat Vector', desc: 'Simple, modern illustrations' },
  { id: '3d', label: '3D Render', desc: 'High-quality 3D graphics' },
  { id: 'cinematic', label: 'Cinematic Photography', desc: 'Dramatic lighting, realistic' },
  { id: 'infographic', label: 'Infographic Style', desc: 'Data-driven, educational' },
];

// Helper Component: Platform Selector
const PlatformSelector = ({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">Platform</label>
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((platform) => (
        <motion.button
          key={platform.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(platform.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all border",
            selected === platform.id
              ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          )}
        >
          <platform.icon className="w-4 h-4" strokeWidth={1.5} />
          {platform.label}
        </motion.button>
      ))}
    </div>
  </div>
);

// Helper Component: Image Style Selector
const ImageStyleSelector = ({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">Image Style</label>
    <div className="grid grid-cols-2 gap-3">
      {IMAGE_STYLES.map((style) => (
        <motion.button
          key={style.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(style.id)}
          className={cn(
            "flex flex-col items-start text-left p-3 rounded-md border transition-all",
            selected === style.id
              ? "bg-blue-50 border-blue-200 ring-1 ring-blue-600"
              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <span className={cn("text-sm font-bold", selected === style.id ? "text-blue-700" : "text-slate-800")}>
            {style.label}
          </span>
          <span className="text-xs text-slate-500 mt-1">{style.desc}</span>
        </motion.button>
      ))}
    </div>
  </div>
);

// Helper Component: Export Toolbar
const ExportToolbar = ({ onCopy, isCopied }: { onCopy: () => void, isCopied: boolean }) => (
  <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-md shadow-sm mt-auto">
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onCopy}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors flex-1 justify-center"
    >
      {isCopied ? (
        <><Check className="w-4 h-4 text-emerald-600" strokeWidth={1.5} /> Copied!</>
      ) : (
        <><Copy className="w-4 h-4" strokeWidth={1.5} /> Copy Text</>
      )}
    </motion.button>
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors flex-1 justify-center shadow-sm"
    >
      <Calendar className="w-4 h-4" strokeWidth={1.5} /> Save to Planner
    </motion.button>
  </div>
);

const SYSTEM_PROMPT = `**Role:** You are an Elite Omnichannel Social Media Strategist and a Master AI Image Prompt Engineer.

**Context:** You are generating content for the "Nexus SEO & Marketing Suite". The user will provide a [Topic], a target [Platform], a [Copywriting Hook], and a desired [Image Style].

**Task 1: Social Media Copy**
Write highly engaging, platform-native copy based on the requested [Platform] and [Copywriting Hook]. Strict rules per platform:
- **X (Twitter) / Threads:** Punchy, concise, use line breaks, max 2-3 hashtags. Use the hook immediately in the first sentence.
- **LinkedIn / Facebook:** Professional yet conversational. Use line spacing, bullet points, and a strong, clear Call To Action (CTA).
- **Instagram:** Visually driven caption, use emojis appropriately, end with an engaging question, and include 5-8 targeted hashtags.
- **Reddit / Quora:** ZERO corporate fluff. Pure value, highly detailed, authentic, and native tone. Strictly NO hashtags and NO emojis. Answer the core problem directly.

**Task 2: AI Image Generation Prompt**
Create a highly detailed, technical image generation prompt (optimized for Midjourney, DALL-E, or Imagen) to create the perfect accompanying visual.
- The image must perfectly reflect the requested [Image Style] and represent the [Topic].
- Include specific details about: Subject, Environment, Lighting (e.g., cinematic, soft, volumetric), Camera Angle, and Color Palette.
- Keep the prompt under 70 words.
- DO NOT ask the AI to generate text or words inside the image.

**Output Structure:** (You MUST strictly follow this exact format)

[Social Text Begins]
(Insert the generated social media copy here)
[Social Text Ends]

[Image Prompt Begins]
(Insert the highly detailed image generation prompt here)
[Image Prompt Ends]`;

export default function OmnichannelStudio() {
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].id);
  const [selectedHook, setSelectedHook] = useState(HOOKS[0]);
  const [selectedStyle, setSelectedStyle] = useState(IMAGE_STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{ text: string; imageUrl: string; imagePrompt: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const platformLabel = PLATFORMS.find(p => p.id === selectedPlatform)?.label || selectedPlatform;
      const styleLabel = IMAGE_STYLES.find(s => s.id === selectedStyle)?.label || selectedStyle;

      const prompt = `[Topic]: ${topic}\n[Platform]: ${platformLabel}\n[Copywriting Hook]: ${selectedHook}\n[Image Style]: ${styleLabel}`;

      // 1. Generate Text & Image Prompt
      const responseText = await puter.ai.chat(
        [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        {
          model: 'gemini-3.1-pro-preview',
          temperature: 0.7,
        }
      );
      
      // Parse using Regex
      const socialTextMatch = responseText.match(/\[Social Text Begins\]([\s\S]*?)\[Social Text Ends\]/i);
      const imagePromptMatch = responseText.match(/\[Image Prompt Begins\]([\s\S]*?)\[Image Prompt Ends\]/i);

      const socialText = socialTextMatch ? socialTextMatch[1].trim() : 'Failed to generate social text.';
      const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : '';

      let imageUrl = '';

      // 2. Generate Image if we have a prompt
      if (imagePrompt) {
        try {
          const activePlatform = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];
          const imageElement = await puter.ai.txt2img(imagePrompt, {
            model: 'gemini-2.5-flash-image-preview',
            aspect_ratio: activePlatform.geminiAspect
          });
          imageUrl = imageElement.src;
        } catch (imgErr) {
          console.error("Image generation failed:", imgErr);
          // Fallback to placeholder if image generation fails
          imageUrl = `https://picsum.photos/seed/${encodeURIComponent(topic.replace(/\s+/g, ''))}/800/800?blur=2`;
        }
      } else {
        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(topic.replace(/\s+/g, ''))}/800/800?blur=2`;
      }

      setGeneratedContent({
        text: socialText,
        imageUrl: imageUrl,
        imagePrompt: imagePrompt
      });

    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const activePlatform = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Omnichannel Social Studio</h1>
          <p className="text-slate-500">Generate platform-specific copy and matching AI images.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Campaign Configurator */}
        <div className="bg-white p-6 rounded-md border border-[var(--color-line)] shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Campaign Configurator</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-400">Topic or URL</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to promote? (e.g., 'New feature launch: AI-powered analytics')"
                className="w-full h-24 p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
              />
            </div>

            <PlatformSelector selected={selectedPlatform} onSelect={setSelectedPlatform} />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-400">Copywriting Hook</label>
              <select
                value={selectedHook}
                onChange={(e) => setSelectedHook(e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm bg-white"
              >
                {HOOKS.map((hook) => (
                  <option key={hook} value={hook}>{hook}</option>
                ))}
              </select>
            </div>

            <ImageStyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />
          </div>

          <div className="pt-4 mt-auto border-t border-slate-100">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={!topic || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> Generating Campaign...</>
              ) : (
                <><Sparkles className="w-4 h-4" strokeWidth={1.5} /> Generate Post & Image</>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right Column: Live Preview & Export */}
        <div className="bg-slate-50 p-6 rounded-md border border-[var(--color-line)] shadow-inner flex flex-col gap-6 h-full">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-600">
              <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Live Preview & Export</h2>
          </div>

          {!generatedContent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-md bg-white">
              <ImageIcon className="w-12 h-12 mb-4 text-slate-300" strokeWidth={1.5} />
              <p className="font-medium text-slate-600">No content generated yet</p>
              <p className="text-sm mt-1">Configure your campaign on the left and click generate to see the preview here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 flex-1">
              {/* Image Preview */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Generated Image</span>
                  {isGenerating && <span className="text-blue-500 animate-pulse">Generating...</span>}
                </label>
                <div className={cn("relative bg-slate-200 rounded-md overflow-hidden border border-slate-300 shadow-sm w-full max-w-md mx-auto group", activePlatform.aspect)}>
                  <img 
                    src={generatedContent.imageUrl} 
                    alt="Generated AI" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = generatedContent.imageUrl;
                        a.download = `nexus-image-${Date.now()}.png`;
                        a.click();
                      }}
                      className="bg-white text-slate-900 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" strokeWidth={1.5} /> Download Image
                    </motion.button>
                  </div>
                </div>
                {generatedContent.imagePrompt && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                    <p className="text-xs font-bold text-slate-500 mb-1">IMAGE PROMPT USED:</p>
                    <p className="text-xs text-slate-600 italic">"{generatedContent.imagePrompt}"</p>
                  </div>
                )}
              </div>

              {/* Text Preview */}
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Copy</label>
                <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex-1 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                  {generatedContent.text}
                </div>
              </div>

              {/* Export Toolbar */}
              <ExportToolbar onCopy={handleCopy} isCopied={isCopied} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

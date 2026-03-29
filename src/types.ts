export type View = 'dashboard' | 'seo-analyzer' | 'keyword-explorer' | 'content-machine' | 'content-planner' | 'social-scripts' | 'growth-hub' | 'dev-log' | 'settings' | 'omnichannel-studio';

export interface SEOAuditResult {
  score: number;
  critical: string[];
  warnings: string[];
  passed: string[];
}

export interface KeywordData {
  keyword: string;
  volume: string;
  difficulty: number;
  intent: 'Informational' | 'Navigational' | 'Commercial' | 'Transactional';
}

export type Platform = 'instagram' | 'facebook' | 'pinterest' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'web';

export type ContentFormat = 
  | 'reel' | 'carousel' | 'story' | 'post' | 'group-post' 
  | 'pin' | 'short' | 'video' | 'thread' | 'article';

export interface ContentSpoke {
  platform: Platform;
  type: ContentFormat;
  hook: string;
  description: string;
  imagePrompt?: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface VideoScene {
  time: string;
  visual: string;
  audio: string;
  textOnScreen: string;
  bRollSuggestion: string;
}

export interface VideoScript {
  hook: string;
  scenes: VideoScene[];
  cta: string;
}

export interface TopicalMap {
  pillar: {
    title: string;
    description: string;
    keywords: string[];
  };
  clusters: {
    title: string;
    intent: string;
    keywords: string[];
  }[];
}

export interface SERPAnalysis {
  intent: string;
  topResultsGaps: string[];
  peopleAlsoAsk: string[];
  entities: string[];
  lsiKeywords: string[];
}

export interface ContentOutline {
  title: string;
  metaDescription: string;
  slug?: string;
  sections: {
    heading: string;
    points: string[];
  }[];
  schema: string;
  html: string;
}

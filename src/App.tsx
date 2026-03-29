/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SEOAnalyzer from './components/SEOAnalyzer';
import KeywordExplorer from './components/KeywordExplorer';
import ContentPlanner from './components/ContentPlanner';
import SocialScripts from './components/SocialScripts';
import OmnichannelStudio from './components/OmnichannelStudio';
import AIChat from './components/AIChat';
import ContentMachine from './components/ContentMachine';
import GrowthHub from './components/GrowthHub';
import DevLog from './components/DevLog';
import { View } from './types';
import { cn } from './lib/utils';
import { Globe, Share2, Menu, Check } from 'lucide-react';

const SettingsView = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 bg-white rounded-md border border-[var(--color-line)] shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-slate-500">Configure your workspace preferences.</p>
      <div className="mt-8 space-y-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            CMS Export (WordPress)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">WordPress Site URL</label>
              <input 
                type="text" 
                placeholder="https://your-site.com"
                defaultValue={localStorage.getItem('wp_url') || ''}
                onBlur={(e) => localStorage.setItem('wp_url', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Application Password</label>
              <input 
                type="password" 
                placeholder="xxxx xxxx xxxx xxxx"
                defaultValue={localStorage.getItem('wp_password') || ''}
                onBlur={(e) => localStorage.setItem('wp_password', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Username</label>
              <input 
                type="text" 
                placeholder="admin"
                defaultValue={localStorage.getItem('wp_user') || ''}
                onBlur={(e) => localStorage.setItem('wp_user', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            To generate an Application Password, go to <strong>Users &gt; Profile</strong> in your WordPress dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'seo-analyzer': return <SEOAnalyzer />;
      case 'keyword-explorer': return <KeywordExplorer />;
      case 'content-machine': return <ContentMachine />;
      case 'content-planner': return <ContentPlanner />;
      case 'social-scripts': return <SocialScripts />;
      case 'omnichannel-studio': return <OmnichannelStudio />;
      case 'growth-hub': return <GrowthHub />;
      case 'dev-log': return <DevLog />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">NEXUS</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>

      <AIChat />
    </div>
  );
}

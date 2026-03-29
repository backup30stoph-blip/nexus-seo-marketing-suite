import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Globe, 
  Calendar, 
  PenTool, 
  Settings,
  Zap,
  Rocket,
  History,
  ChevronLeft,
  ChevronRight,
  X,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'seo-analyzer', label: 'SEO Analyzer', icon: Globe },
  { id: 'keyword-explorer', label: 'Keyword Explorer', icon: Search },
  { id: 'content-machine', label: 'Content Machine', icon: Zap },
  { id: 'content-planner', label: 'Content Planner', icon: Calendar },
  { id: 'social-scripts', label: 'Social Scripts', icon: PenTool },
  { id: 'omnichannel-studio', label: 'Omnichannel Studio', icon: Layers },
  { id: 'growth-hub', label: 'Growth Hub', icon: Rocket },
  { id: 'dev-log', label: 'Dev Log', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export default function Sidebar({ activeView, onViewChange, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "border-r border-[var(--color-line)] bg-white flex flex-col h-screen sticky top-0 z-50 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        "fixed md:sticky left-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className={cn("p-6 flex items-center h-20 shrink-0", isCollapsed ? "justify-center px-0" : "gap-2 justify-between")}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
              <Zap className="text-white w-5 h-5" />
            </div>
            {!isCollapsed && <span className="font-bold text-xl tracking-tight whitespace-nowrap">NEXUS</span>}
          </div>
          
          {/* Mobile Close Button */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id as View);
                setIsMobileOpen(false);
              }}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center rounded-md text-sm font-medium transition-colors",
                isCollapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5",
                activeView === item.id 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer / Upgrade */}
        <div className="p-4 border-t border-[var(--color-line)] shrink-0">
          {!isCollapsed ? (
            <div className="bg-slate-900 rounded-md p-4 text-white">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Nexus Pro</p>
              <p className="text-sm font-medium mb-3">Unlock AI-powered growth engines.</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-md transition-colors">
                Upgrade Now
              </button>
            </div>
          ) : (
            <button 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-md flex items-center justify-center transition-colors" 
              title="Upgrade to Pro"
            >
              <Rocket className="w-5 h-5 text-blue-400" />
            </button>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 shadow-sm z-50 transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}

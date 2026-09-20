import React, { useState } from 'react';
import {
  Compass,
  MessageSquare,
  Wrench,
  FolderCode,
  Search,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Download,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { playSound } from '../utils/audio';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userName: string;
  hasApiKey: boolean;
  forceMockMode: boolean;
  soundEnabled: boolean;
  unreadChatsCount?: number;
  onNewChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userName,
  hasApiKey,
  forceMockMode,
  soundEnabled,
  onNewChat,
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'files', label: 'Files', icon: FolderCode },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    playSound('click', soundEnabled);
    setActiveTab(tab);
    if (tab === 'chat' && onNewChat) {
      // Optional focus
    }
  };

  return (
    <aside
      id="graviton-sidebar"
      className="w-64 h-screen bg-[#08090d] border-r border-[#151922] flex flex-col justify-between select-none z-30 shrink-0 transition-all duration-300"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#151922]/60">
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 w-full group text-left cursor-pointer focus:outline-none"
        >
          {/* Graviton Mini Brand Mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400/20 to-cyan-500/5 border border-sky-400/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(56,189,248,0.2)] group-hover:border-sky-400/60 transition-colors">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-200 shadow-[0_0_8px_#38bdf8]" />
            <div className="absolute inset-0 rounded-lg border border-sky-300/20 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-[0.2em] text-slate-100 uppercase">
                Graviton
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-950/70 border border-sky-500/30 text-sky-400">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Cognitive Workspace</p>
          </div>
        </button>
      </div>

      {/* Navigation List */}
      <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-sky-950/40 text-sky-200 border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f121a]/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
              )}
            </button>
          );
        })}

        {/* Quick status card */}
        <div className="pt-6 px-1">
          <div className="p-3 rounded-xl bg-[#0c0e14] border border-[#1a202c] text-slate-400 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Engine State</span>
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  hasApiKey && !forceMockMode
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                }`}
              >
                {hasApiKey && !forceMockMode ? 'Gemini 3.8' : 'Simulated AI'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {hasApiKey && !forceMockMode
                ? 'Server-side Gemini connected.'
                : 'Zero-cost offline mode active. Free forever.'}
            </p>
          </div>
        </div>
      </div>

      {/* User Profile & Account Footer */}
      <div className="p-3 border-t border-[#151922] relative">
        <button
          id="user-profile-menu-button"
          onClick={() => {
            playSound('click', soundEnabled);
            setShowAccountMenu(!showAccountMenu);
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#0f131c] transition-colors text-left cursor-pointer border border-transparent hover:border-[#1e2638]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-xs font-semibold text-slate-200">
              {userName.charAt(0).toUpperCase() || 'E'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-200 truncate">{userName || 'Explorer'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
                <span className="text-[10px] text-slate-500 font-mono">Connected</span>
              </div>
            </div>
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
              showAccountMenu ? 'rotate-90 text-sky-400' : ''
            }`}
          />
        </button>

        {/* Account Menu Dropdown */}
        {showAccountMenu && (
          <div className="absolute bottom-16 left-3 right-3 p-2 bg-[#0c0e14] border border-[#1e2638] rounded-xl shadow-2xl z-40 space-y-1">
            <div className="px-2.5 py-1.5 text-[11px] text-slate-400 border-b border-[#1a202c]">
              <span className="text-slate-200 font-medium">{userName || 'Explorer'}</span>
              <p className="text-[10px] text-slate-500">Autonomous Workspace User</p>
            </div>

            <button
              onClick={() => {
                setActiveTab('settings');
                setShowAccountMenu(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:bg-[#151a26] rounded-lg transition-colors text-left"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Preferences</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('files');
                setShowAccountMenu(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:bg-[#151a26] rounded-lg transition-colors text-left"
            >
              <FolderCode className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Workspace</span>
            </button>

            <a
              href="/api/download-zip"
              download="graviton-ai-project.zip"
              onClick={() => {
                playSound('click', soundEnabled);
                setShowAccountMenu(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-sky-300 hover:bg-sky-950/40 rounded-lg transition-colors text-left"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download Project (.zip)</span>
            </a>

            <div className="px-2.5 py-1 text-[10px] text-slate-500 border-t border-[#1a202c] flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>Encrypted Local State</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

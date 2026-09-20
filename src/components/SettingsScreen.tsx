import React from 'react';
import {
  Settings,
  Palette,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Shield,
  Trash2,
  Check,
  Zap,
  Info,
  Download,
} from 'lucide-react';
import { AppSettings } from '../types';
import { playSound } from '../utils/audio';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  hasApiKey: boolean;
  onClearHistory: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  hasApiKey,
  onClearHistory,
}) => {
  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: next });
    if (next) playSound('click', true);
  };

  return (
    <div id="graviton-settings-screen" className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#08090d] text-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-[#151922] bg-[#08090d]/80 backdrop-blur-md shrink-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <span>Graviton Preferences</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Calibrate liquid-glass optical behavior, intelligence engine, and user identity
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* 1. User Identity */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-3">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
            <User className="w-4 h-4 text-sky-400" />
            <span>User Identity</span>
          </div>
          <p className="text-xs text-slate-400">
            The name used for personalized workspace greetings and chat identification.
          </p>
          <div className="max-w-md">
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => onUpdateSettings({ userName: e.target.value })}
              placeholder="Your name or callsign..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-[#1e2739] text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-sky-500/40 font-mono"
            />
          </div>
        </section>

        {/* 2. Orb Animation Intensity */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-3">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Liquid-Glass Orb Dynamics</span>
          </div>
          <p className="text-xs text-slate-400">
            Controls caustic wave frequency, fluid turbulence, and responsiveness to your typing cadence.
          </p>
          <div className="grid grid-cols-3 gap-2.5 max-w-md">
            {[
              { id: 'calm', label: 'Calm', desc: 'Gentle ripples' },
              { id: 'balanced', label: 'Balanced', desc: 'Standard fluidity' },
              { id: 'energetic', label: 'Energetic', desc: 'Active waves' },
            ].map((mode) => {
              const active = settings.orbIntensity === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    playSound('click', settings.soundEnabled);
                    onUpdateSettings({ orbIntensity: mode.id as any });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                      : 'bg-[#080a0f] border-[#18202d] text-slate-400 hover:border-[#222c3e]'
                  }`}
                >
                  <p className="text-xs font-semibold">{mode.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{mode.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Audio & Haptics */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-sky-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span>Acoustic Feedback</span>
              </div>
              <p className="text-xs text-slate-400">
                Play subtle, minimalist glass resonant clicks on actions and chat responses.
              </p>
            </div>

            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                settings.soundEnabled
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-semibold'
                  : 'bg-[#0f131c] text-slate-400 border-[#1f283a]'
              }`}
            >
              {settings.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </section>

        {/* 4. Intelligence Engine & Mock Mode */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Simulated Offline AI Mode</span>
              </div>
              <p className="text-xs text-slate-400">
                Toggle between zero-cost intelligent mock synthesis and cloud Gemini AI.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('click', settings.soundEnabled);
                onUpdateSettings({ forceMockMode: !settings.forceMockMode });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                settings.forceMockMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {settings.forceMockMode ? 'MOCK ACTIVE' : 'LIVE API ACTIVE'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#080a0f] border border-[#161c28] text-[11px] text-slate-400 font-mono space-y-1">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>Backend Status:</span>
            </div>
            <p>
              • Gemini Server-side Key:{' '}
              <span className={hasApiKey ? 'text-emerald-400' : 'text-amber-400'}>
                {hasApiKey ? 'Detected & Attached (Secure)' : 'Not Set (Defaulting to Simulation)'}
              </span>
            </p>
            <p>
              • Active Engine Mode:{' '}
              <span className="text-sky-300">
                {settings.forceMockMode || !hasApiKey ? 'Autonomous Mock Engine' : 'Gemini 3.8 Flash'}
              </span>
            </p>
          </div>
        </section>

        {/* 5. Theme Palette */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-3">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
            <Palette className="w-4 h-4 text-sky-400" />
            <span>Theme Tone</span>
          </div>
          <p className="text-xs text-slate-400">
            Ultra-low eye strain dark schemes with subtle optical tinting.
          </p>
          <div className="grid grid-cols-3 gap-2.5 max-w-md">
            {[
              { id: 'void', label: 'Deep Void', desc: '#08090d Obsidian' },
              { id: 'midnight', label: 'Midnight Cyan', desc: 'Subtle cool blue' },
              { id: 'titanium', label: 'Titanium Slate', desc: 'Muted dark gray' },
            ].map((t) => {
              const active = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    playSound('click', settings.soundEnabled);
                    onUpdateSettings({ theme: t.id as any });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                      : 'bg-[#080a0f] border-[#18202d] text-slate-400 hover:border-[#222c3e]'
                  }`}
                >
                  <p className="text-xs font-semibold">{t.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. Export Project Codebase */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-sky-900/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
                <Download className="w-4 h-4 text-sky-400" />
                <span>Download Entire Project (.zip)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Packages all source code, components, Express backend, and configuration into a ready-to-run ZIP archive.
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-500/20 text-sky-300">
                  graviton-ai-project.zip
                </span>
                <span>• Includes full TypeScript/React & Node source</span>
              </div>
            </div>
            <a
              id="download-project-zip-button"
              href="/api/download-zip"
              download="graviton-ai-project.zip"
              onClick={() => playSound('click', settings.soundEnabled)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-medium text-xs shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download ZIP</span>
            </a>
          </div>
        </section>

        {/* 7. Workspace Data Reset */}
        <section className="p-5 rounded-2xl bg-[#0c0f16] border border-red-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-red-300">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Clear Conversation History</span>
              </div>
              <p className="text-xs text-slate-500">
                Removes local cached chat messages and resets conversation threads.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Clear all conversation messages?')) {
                  onClearHistory();
                  playSound('click', settings.soundEnabled);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 border border-red-500/30 text-xs font-mono text-red-300 transition-colors cursor-pointer"
            >
              RESET HISTORY
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

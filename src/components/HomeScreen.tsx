import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles, BookOpen, Lightbulb, PenTool, Compass } from 'lucide-react';
import { Orb } from './Orb';
import { playSound } from '../utils/audio';

interface HomeScreenProps {
  userName: string;
  onSendMessage: (text: string) => void;
  typingEnergy: number;
  onTyping: () => void;
  soundEnabled: boolean;
  orbIntensity: 'calm' | 'balanced' | 'energetic';
  hasStartedConversation?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  onSendMessage,
  typingEnergy,
  onTyping,
  soundEnabled,
  orbIntensity,
  hasStartedConversation = false,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [greeting, setGreeting] = useState('Good day');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Compute greeting dynamically based on local time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleSend = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    playSound('send', soundEnabled);
    onSendMessage(trimmed);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
    onTyping();
  };

  const suggestions = [
    {
      label: 'Explain something',
      prompt: 'Explain the core principles of quantum entanglement and gravitational curvature in accessible terms.',
      icon: Compass,
    },
    {
      label: 'Help me learn',
      prompt: 'Create an accelerated 4-phase learning roadmap for mastering modern reactive systems.',
      icon: BookOpen,
    },
    {
      label: 'Write something',
      prompt: 'Write an elegant TypeScript state management engine with zero dependencies and subscriber teardowns.',
      icon: PenTool,
    },
    {
      label: 'Explore an idea',
      prompt: 'Explore conceptual frontiers for ambient spatial computing and frictionless cognitive interfaces.',
      icon: Lightbulb,
    },
  ];

  return (
    <div
      id="graviton-home-screen"
      className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full min-h-screen select-none"
    >
      {/* Centered Floating Liquid Glass Orb */}
      <div className="relative mb-6 flex items-center justify-center">
        <Orb
          size={240}
          phase="home"
          typingEnergy={typingEnergy}
          intensity={orbIntensity}
        />
      </div>

      {/* Welcoming Headline */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-100 font-sans">
          {greeting}
          {userName && userName !== 'Explorer' ? `, ${userName}` : ''}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-normal max-w-lg mx-auto leading-relaxed">
          Your AI copilot for thinking, creating, and exploring.
        </p>
      </div>

      {/* Large Elegant Prompt Box */}
      <div className="w-full max-w-2xl relative mb-6">
        {!hasStartedConversation && (
          <div className="text-center mb-2.5">
            <p className="text-[11px] sm:text-xs text-slate-500 font-sans tracking-tight select-none">
              Graviton can make mistakes. Please verify important facts.
            </p>
          </div>
        )}
        <div className="relative rounded-2xl bg-[#0c0e15]/90 border border-[#1e2536] shadow-[0_4px_30px_rgba(0,0,0,0.6)] focus-within:border-sky-500/50 focus-within:shadow-[0_0_25px_rgba(56,189,248,0.15)] transition-all duration-300">
          <textarea
            ref={inputRef}
            id="home-prompt-input"
            value={inputVal}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Ask Graviton anything..."
            className="w-full px-5 pt-4 pb-12 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base resize-none focus:outline-none leading-relaxed"
          />

          <div className="absolute bottom-3 right-3 flex items-center pointer-events-none">
            <button
              id="home-send-button"
              onClick={handleSend}
              disabled={!inputVal.trim()}
              className={`p-2 rounded-xl pointer-events-auto transition-all duration-200 cursor-pointer ${
                inputVal.trim()
                  ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'bg-[#151922] text-slate-600 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Optional Suggestion Buttons */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              id={`suggestion-chip-${idx}`}
              onClick={() => {
                playSound('click', soundEnabled);
                setInputVal(item.prompt);
                onTyping();
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#111622] border border-[#19202e] hover:border-sky-500/30 text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#141a28] border border-[#1e2738] flex items-center justify-center shrink-0 group-hover:border-sky-500/40 transition-colors">
                <Icon className="w-3 h-3 text-slate-400 group-hover:text-sky-400 transition-colors" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

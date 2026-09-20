import React, { useState, useMemo } from 'react';
import { Search, MessageSquare, ArrowRight, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { playSound } from '../utils/audio';

interface SearchScreenProps {
  messages: ChatMessage[];
  soundEnabled: boolean;
  onSelectMessage: (msg: ChatMessage) => void;
  onSendToChat: (text: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  messages,
  soundEnabled,
  onSelectMessage,
  onSendToChat,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'assistant'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchRole = filterType === 'all' || msg.role === filterType;
      const matchQuery =
        !query.trim() || msg.content.toLowerCase().includes(query.toLowerCase());
      return matchRole && matchQuery;
    });
  }, [messages, query, filterType]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    playSound('click', soundEnabled);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="graviton-search-screen" className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#08090d] text-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-[#151922] bg-[#08090d]/80 backdrop-blur-md shrink-0">
        <div className="max-w-3xl mx-auto space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-sky-400" />
              <span>Workspace Search</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Query local conversation history, generated formulas, and synthetic insights
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, queries, code snippets, formulas..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0c0e15] border border-[#1e2536] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/40 focus:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All History' },
              { id: 'user', label: 'My Inquiries' },
              { id: 'assistant', label: 'Graviton Syntheses' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  setFilterType(chip.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterType === chip.id
                    ? 'bg-sky-950/50 text-sky-300 border border-sky-500/30'
                    : 'bg-[#0f121a] text-slate-400 hover:text-slate-200 border border-[#1a202c]'
                }`}
              >
                {chip.label}
              </button>
            ))}
            <span className="text-xs text-slate-500 font-mono ml-auto">
              {filteredMessages.length} matches
            </span>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0a0d14] border border-[#161c28] space-y-2">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No matching conversations found.</p>
            <p className="text-xs text-slate-600 font-mono">
              Try adjusting your query or start a new inquiry in Chat.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl bg-[#0a0d14] border border-[#161c27] hover:border-sky-500/30 transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-b border-[#141924] pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      msg.role === 'user' ? 'bg-slate-400' : 'bg-sky-400'
                    }`}
                  />
                  <span className="text-slate-300 capitalize font-medium">
                    {msg.role === 'user' ? 'Inquiry' : 'Graviton Synthesis'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-4">
                {msg.content}
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleCopy(msg.content, msg.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-[#131824] transition-colors cursor-pointer"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="text-[11px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click', soundEnabled);
                    onSelectMessage(msg);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950/40 text-sky-400 hover:bg-sky-900/60 border border-sky-500/20 text-xs transition-colors cursor-pointer"
                >
                  <span>Open in Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

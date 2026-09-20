import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  PlusCircle,
  Clock,
  User,
  Bot,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, OrbPhase } from '../types';
import { Orb } from './Orb';
import { playSound } from '../utils/audio';

interface ChatScreenProps {
  messages: ChatMessage[];
  isThinking: boolean;
  thinkingMessage: string;
  orbPhase: OrbPhase;
  typingEnergy: number;
  onSendMessage: (text: string) => void;
  onTyping: () => void;
  onNewConversation: () => void;
  soundEnabled: boolean;
  orbIntensity: 'calm' | 'balanced' | 'energetic';
  hasApiKey: boolean;
  forceMockMode: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  isThinking,
  thinkingMessage,
  orbPhase,
  typingEnergy,
  onSendMessage,
  onTyping,
  onNewConversation,
  soundEnabled,
  orbIntensity,
  hasApiKey,
  forceMockMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to bottom smoothly when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isThinking) return;
    playSound('send', soundEnabled);
    onSendMessage(trimmed);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    playSound('click', soundEnabled);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="graviton-chat-screen"
      className="flex-1 flex flex-col h-screen bg-[#08090d] text-slate-200 overflow-hidden relative"
    >
      {/* Top Header with Small Floating Orb in the Top-Left corner */}
      <header className="h-16 px-6 border-b border-[#151922] bg-[#08090d]/90 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          {/* Small Liquid-Glass Orb (48-52px) */}
          <div className="relative flex items-center justify-center">
            <Orb
              size={48}
              phase={orbPhase}
              isThinking={isThinking}
              typingEnergy={typingEnergy}
              intensity={orbIntensity}
              onClick={onNewConversation}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-wide text-slate-100">
                Graviton Core
              </span>
              {isThinking ? (
                <span className="flex items-center gap-1.5 text-xs text-sky-400 font-mono animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>{thinkingMessage || 'Thinking...'}</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/40 text-sky-400/90 border border-sky-500/20">
                  {hasApiKey && !forceMockMode ? 'Gemini 3.8 Flash' : 'Simulated AI'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              {isThinking ? 'Processing semantic synthesis' : 'Ready for inquiry'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="chat-new-conversation-button"
            onClick={onNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#0f131c] hover:bg-[#161c28] border border-[#1e2638] hover:border-sky-500/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>New Session</span>
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 transition-all leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#10141e] border border-[#1f283d] text-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                    : 'bg-[#0b0e14] border border-[#161c27] text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-800/40 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    {msg.role === 'user' ? (
                      <>
                        <User className="w-3 h-3 text-slate-400" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                        <span className="text-slate-300 font-medium">Graviton</span>
                        {msg.source && (
                          <span className="text-[10px] text-slate-500">({msg.source})</span>
                        )}
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span className="text-[10px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Message Body */}
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm sm:text-[15px] font-normal text-slate-100">
                    {msg.content}
                  </p>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-sm sm:text-[15px] space-y-3">
                    <ReactMarkdown
                      components={{
                        code({ className, children, ...props }) {
                          const isInline = !className;
                          return isInline ? (
                            <code
                              className="px-1.5 py-0.5 rounded bg-[#161c28] text-sky-300 font-mono text-[13px] border border-[#232d40]"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <div className="relative my-3 rounded-xl overflow-hidden bg-[#07090e] border border-[#1a2130]">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e121a] border-b border-[#192130] text-[11px] font-mono text-slate-400">
                                <span>Code Block</span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(String(children).replace(/\n$/, ''), msg.id + '-code')
                                  }
                                  className="flex items-center gap-1 hover:text-slate-200 text-[10px] cursor-pointer"
                                >
                                  {copiedId === msg.id + '-code' ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  <span>{copiedId === msg.id + '-code' ? 'Copied' : 'Copy Code'}</span>
                                </button>
                              </div>
                              <pre className="p-3 text-[13px] font-mono text-slate-200 overflow-x-auto">
                                <code>{children}</code>
                              </pre>
                            </div>
                          );
                        },
                        h3({ children }) {
                          return (
                            <h3 className="text-base font-semibold text-slate-100 mt-4 mb-2 tracking-tight">
                              {children}
                            </h3>
                          );
                        },
                        h4({ children }) {
                          return (
                            <h4 className="text-sm font-semibold text-sky-300 mt-3 mb-1">
                              {children}
                            </h4>
                          );
                        },
                        ul({ children }) {
                          return <ul className="list-disc pl-5 space-y-1 my-2 text-slate-300">{children}</ul>;
                        },
                        ol({ children }) {
                          return <ol className="list-decimal pl-5 space-y-1 my-2 text-slate-300">{children}</ol>;
                        },
                        blockquote({ children }) {
                          return (
                            <blockquote className="border-l-2 border-sky-400/60 pl-3.5 py-0.5 my-2.5 italic text-slate-400 bg-sky-950/10 rounded-r-lg">
                              {children}
                            </blockquote>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* AI Thinking indicator Card */}
          {isThinking && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="rounded-2xl p-4 bg-[#0b0e14] border border-sky-500/20 text-slate-300 max-w-md shadow-[0_0_25px_rgba(56,189,248,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                  <div>
                    <p className="text-xs font-medium text-slate-200">{thinkingMessage}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Generating high-density reasoning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Follow-up Prompt Input Box at Bottom */}
      <div className="p-4 sm:p-6 border-t border-[#151922] bg-[#08090d]/95 backdrop-blur-md shrink-0">
        <div className="max-w-3xl mx-auto relative">
          {!messages.some((m) => m.role === 'user') && (
            <div className="text-center mb-2">
              <p className="text-[11px] sm:text-xs text-slate-500 font-sans tracking-tight select-none">
                Graviton can make mistakes. Please verify important facts.
              </p>
            </div>
          )}
          <div className="relative rounded-2xl bg-[#0c0e14] border border-[#1e2536] focus-within:border-sky-500/40 focus-within:shadow-[0_0_20px_rgba(56,189,248,0.12)] transition-all">
            <textarea
              ref={inputRef}
              id="chat-followup-input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                onTyping();
              }}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask a follow-up question or explore deeper..."
              disabled={isThinking}
              className="w-full px-4 pt-3.5 pb-10 bg-transparent text-slate-100 placeholder-slate-500 text-sm resize-none focus:outline-none leading-relaxed"
            />

            <div className="absolute bottom-2.5 right-3 flex items-center pointer-events-none">
              <button
                id="chat-followup-send-button"
                onClick={handleSend}
                disabled={!inputText.trim() || isThinking}
                className={`p-1.5 rounded-lg pointer-events-auto transition-all cursor-pointer ${
                  inputText.trim() && !isThinking
                    ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-[#151922] text-slate-600 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

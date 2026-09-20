import React, { useState } from 'react';
import {
  Wrench,
  FileText,
  PenTool,
  Calculator,
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface ToolsScreenProps {
  soundEnabled: boolean;
  onSendToChat?: (prompt: string) => void;
}

type ToolTab = 'summarizer' | 'writer' | 'calculator' | 'brainstorm';

export const ToolsScreen: React.FC<ToolsScreenProps> = ({ soundEnabled, onSendToChat }) => {
  const [activeTool, setActiveTool] = useState<ToolTab>('summarizer');
  const [copied, setCopied] = useState(false);

  // Summarizer State
  const [sumInput, setSumInput] = useState(
    'Quantum computing harnesses fundamental principles of quantum mechanics—such as superposition, interference, and entanglement—to perform specialized calculations exponentially faster than classical supercomputers. While classical bits exist deterministically as 0 or 1, qubits can exist in a continuum of states simultaneously until observed, allowing parallel exploration of complex mathematical solution spaces.'
  );
  const [sumStyle, setSumStyle] = useState<'tldr' | 'bullets' | 'technical'>('bullets');
  const [sumResult, setSumResult] = useState('');
  const [isProcessingSum, setIsProcessingSum] = useState(false);

  // Writing Assistant State
  const [writerInput, setWriterInput] = useState('We need to make our product faster and look much better for users.');
  const [writerTone, setWriterTone] = useState<'futuristic' | 'concise' | 'executive'>('futuristic');
  const [writerResult, setWriterResult] = useState('');

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  // Brainstormer State
  const [ideaTopic, setIdeaTopic] = useState('Autonomous AI Workspace');
  const [ideaResults, setIdeaResults] = useState<string[]>([]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    playSound('click', soundEnabled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Summarizer
  const runSummarizer = () => {
    playSound('click', soundEnabled);
    setIsProcessingSum(true);
    setTimeout(() => {
      if (sumStyle === 'bullets') {
        setSumResult(
          `• Quantum computers leverage superposition and entanglement to explore computational solution spaces simultaneously.\n• Unlike classical binary bits (0 or 1), qubits operate across continuous quantum state amplitudes.\n• Practical supremacy targets cryptographic factoring, quantum chemistry simulation, and combinatorial optimization.`
        );
      } else if (sumStyle === 'tldr') {
        setSumResult(
          `Executive TL;DR: Quantum computing replaces binary bits with probabilistic qubits, enabling exponential speedups for specialized non-linear combinatorial problems.`
        );
      } else {
        setSumResult(
          `Technical Abstract: Hamiltonian simulation and quantum superposition enable polynomial-time solutions to discrete logarithm and matrix inversion problems intractable under classical Turing architectures.`
        );
      }
      setIsProcessingSum(false);
      playSound('receive', soundEnabled);
    }, 450);
  };

  // Run Writer
  const runWriter = () => {
    playSound('click', soundEnabled);
    if (writerTone === 'futuristic') {
      setWriterResult(
        'Accelerate application latency toward the zero-entropy horizon while architecting an ethereal, liquid-glass aesthetic calibrated for cognitive clarity.'
      );
    } else if (writerTone === 'concise') {
      setWriterResult('Optimize execution latency and refine interface ergonomics to maximize user conversion.');
    } else {
      setWriterResult(
        'We must strategically reduce operational latency and elevate product aesthetics to exceed user expectations and drive engagement.'
      );
    }
    playSound('receive', soundEnabled);
  };

  // Calculator logic
  const handleCalcInput = (val: string) => {
    playSound('click', soundEnabled);
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        // Safe evaluation for basic math expression
        const cleanExpr = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
        // eslint-disable-next-line no-new-func
        const res = Function(`'use strict'; return (${cleanExpr})`)();
        const formatted = String(Number(res.toFixed(6)));
        setCalcHistory((prev) => [calcDisplay + ' = ' + formatted, ...prev.slice(0, 5)]);
        setCalcDisplay(formatted);
        playSound('receive', soundEnabled);
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
    }
  };

  // Run Brainstormer
  const runBrainstorm = () => {
    playSound('click', soundEnabled);
    setIdeaResults([
      `1. Spatial Micro-Gestures: Calibrate orb refraction to eye-tracking velocity to highlight active workspace nodes.`,
      `2. Ambient Vector Memories: Automatically cross-reference past user inquiries to provide pre-emptive contextual briefs.`,
      `3. Zero-Latency Local Sandbox: Run offline deterministic simulations directly in the client browser with instantaneous fallback.`,
    ]);
    playSound('receive', soundEnabled);
  };

  return (
    <div id="graviton-tools-screen" className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#08090d] text-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-[#151922] bg-[#08090d]/80 backdrop-blur-md shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-400" />
            <span>Graviton Tools</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Specialized micro-engines for synthesis, calculation, and drafting
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0d1017] border border-[#19202e]">
          {[
            { id: 'summarizer', label: 'Summarizer', icon: FileText },
            { id: 'writer', label: 'Writing Assistant', icon: PenTool },
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'brainstorm', label: 'Brainstormer', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                id={`tool-tab-${tab.id}`}
                onClick={() => {
                  playSound('click', soundEnabled);
                  setActiveTool(tab.id as ToolTab);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-sky-950/50 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151a26]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Content Area */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* 1. SUMMARIZER TOOL */}
        {activeTool === 'summarizer' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Input Document / Passage
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setSumStyle('bullets')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      sumStyle === 'bullets' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'text-slate-400'
                    }`}
                  >
                    Bullet Points
                  </button>
                  <button
                    onClick={() => setSumStyle('tldr')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      sumStyle === 'tldr' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'text-slate-400'
                    }`}
                  >
                    TL;DR
                  </button>
                  <button
                    onClick={() => setSumStyle('technical')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      sumStyle === 'technical' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'text-slate-400'
                    }`}
                  >
                    Technical
                  </button>
                </div>
              </div>

              <textarea
                value={sumInput}
                onChange={(e) => setSumInput(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-xl bg-[#080a0f] border border-[#1e2536] text-sm text-slate-200 resize-none focus:outline-none focus:border-sky-500/40 leading-relaxed font-sans"
              />

              <div className="flex justify-end">
                <button
                  onClick={runSummarizer}
                  disabled={isProcessingSum}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isProcessingSum ? 'Synthesizing...' : 'Generate Summary'}</span>
                </button>
              </div>
            </div>

            {sumResult && (
              <div className="p-5 rounded-2xl bg-[#090c12] border border-sky-500/25 space-y-3">
                <div className="flex items-center justify-between text-xs text-sky-400 font-mono">
                  <span>Synthesized Output</span>
                  <button
                    onClick={() => handleCopy(sumResult)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{sumResult}</p>
              </div>
            )}
          </div>
        )}

        {/* 2. WRITING ASSISTANT TOOL */}
        {activeTool === 'writer' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Original Draft
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setWriterTone('futuristic')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      writerTone === 'futuristic' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'text-slate-400'
                    }`}
                  >
                    Futuristic
                  </button>
                  <button
                    onClick={() => setWriterTone('concise')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      writerTone === 'concise' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'text-slate-400'
                    }`}
                  >
                    Concise
                  </button>
                  <button
                    onClick={() => setWriterTone('executive')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      writerTone === 'executive' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' : 'text-slate-400'
                    }`}
                  >
                    Executive
                  </button>
                </div>
              </div>

              <textarea
                value={writerInput}
                onChange={(e) => setWriterInput(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl bg-[#080a0f] border border-[#1e2536] text-sm text-slate-200 resize-none focus:outline-none focus:border-sky-500/40 leading-relaxed font-sans"
              />

              <div className="flex justify-end">
                <button
                  onClick={runWriter}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Refine & Polish</span>
                </button>
              </div>
            </div>

            {writerResult && (
              <div className="p-5 rounded-2xl bg-[#090c12] border border-sky-500/25 space-y-3">
                <div className="flex items-center justify-between text-xs text-sky-400 font-mono">
                  <span>Enhanced Transformation</span>
                  <button
                    onClick={() => handleCopy(writerResult)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">{writerResult}</p>
              </div>
            )}
          </div>
        )}

        {/* 3. CALCULATOR TOOL */}
        {activeTool === 'calculator' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Calculator Interface */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-4">
              <div className="p-4 rounded-xl bg-[#07090e] border border-[#181f2c] text-right font-mono text-2xl text-sky-300 overflow-x-auto">
                {calcDisplay}
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm font-mono">
                {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'π', '='].map(
                  (btn) => (
                    <button
                      key={btn}
                      onClick={() => handleCalcInput(btn)}
                      className={`p-3 rounded-xl transition-all cursor-pointer ${
                        btn === '='
                          ? 'bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 col-span-1 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                          : btn === 'C'
                          ? 'bg-red-950/40 text-red-300 border border-red-500/20 hover:bg-red-900/50'
                          : ['÷', '×', '-', '+'].includes(btn)
                          ? 'bg-[#151c2a] text-sky-300 border border-[#202b3d] hover:bg-[#1a2335]'
                          : 'bg-[#0f131c] text-slate-200 border border-[#1b2230] hover:bg-[#151b26]'
                      }`}
                    >
                      {btn}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Calculation History Tape */}
            <div className="p-5 rounded-2xl bg-[#090c12] border border-[#161c28] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Calculation Tape
              </span>
              {calcHistory.length === 0 ? (
                <p className="text-xs text-slate-600 font-mono">No previous equations recorded.</p>
              ) : (
                <div className="space-y-2">
                  {calcHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#0d1118] border border-[#18202d] text-xs font-mono text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. BRAINSTORMER TOOL */}
        {activeTool === 'brainstorm' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0c0f16] border border-[#1a2130] space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Inquiry Seed / Topic
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ideaTopic}
                    onChange={(e) => setIdeaTopic(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2536] text-sm text-slate-200 focus:outline-none focus:border-sky-500/40"
                    placeholder="Enter concept (e.g. Ambient AI interfaces)..."
                  />
                  <button
                    onClick={runBrainstorm}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer shrink-0"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Spark Concepts</span>
                  </button>
                </div>
              </div>
            </div>

            {ideaResults.length > 0 && (
              <div className="space-y-2.5">
                {ideaResults.map((idea, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#090c12] border border-[#171f2e] text-sm text-slate-300 leading-relaxed hover:border-sky-500/30 transition-colors"
                  >
                    {idea}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

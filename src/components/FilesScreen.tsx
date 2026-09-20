import React, { useState, useEffect } from 'react';
import {
  FolderCode,
  FileText,
  Code,
  File,
  Plus,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  Check,
  Copy,
} from 'lucide-react';
import { WorkspaceFile } from '../types';
import { playSound } from '../utils/audio';

interface FilesScreenProps {
  soundEnabled: boolean;
  onSendToChat: (prompt: string) => void;
}

const DEFAULT_FILES: WorkspaceFile[] = [
  {
    id: 'f-1',
    name: 'quantum_curvature_notes.md',
    size: '1.8 KB',
    type: 'note',
    content: `# Notes on Gravitational Curvature\n\n- Einstein field equations relate geometry to stress-energy tensor: G_uv = (8*pi*G / c^4) * T_uv\n- Spacetime intervals invariant under Lorentz boosts\n- Geodesic deviation measures tidal stresses`,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'f-2',
    name: 'graviton_stream_engine.ts',
    size: '2.4 KB',
    type: 'code',
    content: `export interface StreamPacket<T> {\n  data: T;\n  seq: number;\n}\n\nexport class AutonomousStream<T> {\n  private buffer: StreamPacket<T>[] = [];\n  \n  emit(val: T): void {\n    this.buffer.push({ data: val, seq: Date.now() });\n  }\n}`,
    updatedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'f-3',
    name: 'ambient_ux_manifesto.txt',
    size: '890 B',
    type: 'document',
    content: `Graviton Design Philosophy:\n1. Zero intrusive noise\n2. Liquid glass optics reflecting user mental cadence\n3. High-density synthesis over verbose filler`,
    updatedAt: Date.now() - 3600000 * 48,
  },
];

export const FilesScreen: React.FC<FilesScreenProps> = ({ soundEnabled, onSendToChat }) => {
  const [files, setFiles] = useState<WorkspaceFile[]>(() => {
    try {
      const saved = localStorage.getItem('graviton_workspace_files');
      return saved ? JSON.parse(saved) : DEFAULT_FILES;
    } catch {
      return DEFAULT_FILES;
    }
  });

  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(files[0] || null);
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('graviton_workspace_files', JSON.stringify(files));
    } catch (e) {
      console.error(e);
    }
  }, [files]);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    playSound('click', soundEnabled);
    const newFile: WorkspaceFile = {
      id: 'f-' + Date.now(),
      name: newFileName.trim().includes('.') ? newFileName.trim() : `${newFileName.trim()}.md`,
      size: '120 B',
      type: newFileName.endsWith('.ts') || newFileName.endsWith('.js') ? 'code' : 'note',
      content: `# ${newFileName}\n\nCreated in Graviton Workspace.`,
      updatedAt: Date.now(),
    };
    setFiles([newFile, ...files]);
    setSelectedFile(newFile);
    setNewFileName('');
    setIsCreating(false);
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click', soundEnabled);
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (selectedFile?.id === id) {
      setSelectedFile(updated[0] || null);
    }
  };

  const handleAnalyzeInChat = (file: WorkspaceFile) => {
    playSound('click', soundEnabled);
    onSendToChat(`Please inspect and synthesize this file [${file.name}]:\n\n\`\`\`\n${file.content}\n\`\`\``);
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    playSound('click', soundEnabled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="graviton-files-screen" className="flex-1 flex h-screen overflow-hidden bg-[#08090d] text-slate-200">
      {/* File List Panel */}
      <div className="w-80 border-r border-[#151922] bg-[#090c13] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#151922] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FolderCode className="w-4 h-4 text-sky-400" />
              <span>Workspace Files</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">Local Storage Persistence</span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="/api/download-zip"
              download="graviton-ai-project.zip"
              onClick={() => playSound('click', soundEnabled)}
              className="p-1.5 rounded-lg bg-[#111622] text-slate-400 hover:text-sky-300 hover:bg-[#182030] border border-[#1e2739] transition-colors cursor-pointer"
              title="Download Full Project (.zip)"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1.5 rounded-lg bg-sky-950/60 text-sky-400 hover:bg-sky-900/80 border border-sky-500/30 transition-colors cursor-pointer"
              title="Create File"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="p-3 border-b border-[#151922] bg-[#0c1018] space-y-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g. quantum_state.ts"
              className="w-full px-3 py-1.5 rounded-lg bg-[#07090f] border border-[#1e2739] text-xs text-slate-100 focus:outline-none focus:border-sky-500/40"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              autoFocus
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => setIsCreating(false)}
                className="px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-2.5 py-1 rounded bg-sky-500 text-slate-950 text-[11px] font-medium"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* File Cards List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.map((file) => {
            const isSelected = selectedFile?.id === file.id;
            return (
              <div
                key={file.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  setSelectedFile(file);
                }}
                className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-sky-950/40 border border-sky-500/30 text-sky-200'
                    : 'hover:bg-[#10141e] border border-transparent text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {file.type === 'code' ? (
                    <Code className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteFile(file.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Editor / Preview Area */}
      <div className="flex-1 flex flex-col h-full bg-[#08090d] overflow-hidden">
        {selectedFile ? (
          <>
            <div className="p-4 border-b border-[#151922] bg-[#0a0d14] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-sky-400" />
                <div>
                  <h3 className="text-xs font-medium text-slate-200">{selectedFile.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Updated {new Date(selectedFile.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(selectedFile.content)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111622] hover:bg-[#182030] text-slate-300 text-xs border border-[#1e2638] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleAnalyzeInChat(selectedFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-medium shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Analyze with Graviton</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <textarea
                value={selectedFile.content}
                onChange={(e) => {
                  const updated = {
                    ...selectedFile,
                    content: e.target.value,
                    updatedAt: Date.now(),
                  };
                  setSelectedFile(updated);
                  setFiles(files.map((f) => (f.id === updated.id ? updated : f)));
                }}
                className="w-full h-full p-4 rounded-xl bg-[#06080d] border border-[#161c28] text-xs sm:text-sm font-mono text-slate-200 resize-none focus:outline-none focus:border-sky-500/30 leading-relaxed"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
            <FolderCode className="w-10 h-10 text-slate-700 mb-3" />
            <span>Select or create a file to view and edit</span>
          </div>
        )}
      </div>
    </div>
  );
};

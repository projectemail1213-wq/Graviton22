export type NavigationTab = 'home' | 'chat' | 'tools' | 'files' | 'search' | 'settings';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  source?: 'gemini' | 'mock';
}

export interface WorkspaceFile {
  id: string;
  name: string;
  size: string;
  type: 'note' | 'code' | 'document';
  content: string;
  updatedAt: number;
}

export interface AppSettings {
  theme: 'void' | 'midnight' | 'titanium';
  orbIntensity: 'calm' | 'balanced' | 'energetic';
  soundEnabled: boolean;
  userName: string;
  forceMockMode: boolean;
}

export type OrbPhase = 'home' | 'shrinking' | 'thinking' | 'finished';

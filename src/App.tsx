import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeScreen } from './components/HomeScreen';
import { ChatScreen } from './components/ChatScreen';
import { ToolsScreen } from './components/ToolsScreen';
import { FilesScreen } from './components/FilesScreen';
import { SearchScreen } from './components/SearchScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { NavigationTab, ChatMessage, AppSettings, OrbPhase } from './types';
import { playSound } from './utils/audio';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'void',
  orbIntensity: 'balanced',
  soundEnabled: true,
  userName: 'Explorer',
  forceMockMode: false,
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'intro-1',
    role: 'assistant',
    content: `### Welcome to Graviton

I am your cognitive copilot. My architecture is calibrated for high-density reasoning, theoretical exploration, rapid prototyping, and conceptual synthesis.

- Ask me to dissect complex physics, mathematics, or software architectures.
- Use the **Tools** tab for dedicated summarization and calculation.
- Access **Files** to build an encrypted local workspace.

How may I assist your workflow today?`,
    timestamp: Date.now() - 60000,
    source: 'mock',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [orbPhase, setOrbPhase] = useState<OrbPhase>('home');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState('Thinking...');
  const [typingEnergy, setTypingEnergy] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Settings State with LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('graviton_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Messages State with LocalStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('graviton_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Check Backend Gemini Config
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === 'boolean') {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.warn('Backend config fetch fallback:', err);
      });
  }, []);

  // Save Settings
  useEffect(() => {
    try {
      localStorage.setItem('graviton_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Save Messages
  useEffect(() => {
    try {
      localStorage.setItem('graviton_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Handle typing reactions: exponential decay
  useEffect(() => {
    if (typingEnergy <= 0.005) return;
    const interval = setInterval(() => {
      setTypingEnergy((prev) => Math.max(0, prev * 0.88));
    }, 60);
    return () => clearInterval(interval);
  }, [typingEnergy]);

  const handleTyping = () => {
    setTypingEnergy((prev) => Math.min(1.0, prev + 0.3));
    if (Math.random() > 0.6) {
      playSound('ripple', settings.soundEnabled);
    }
  };

  // Thinking Message cycle during AI generation
  const thinkingIntervalRef = useRef<number | null>(null);
  const thinkingMessagesList = [
    'Thinking...',
    'Exploring your question...',
    'Working on your request...',
    'Synthesizing cognitive vectors...',
    'Refining output clarity...',
  ];

  const startThinkingCycle = () => {
    let index = 0;
    setThinkingMessage(thinkingMessagesList[0]);
    thinkingIntervalRef.current = window.setInterval(() => {
      index = (index + 1) % thinkingMessagesList.length;
      setThinkingMessage(thinkingMessagesList[index]);
    }, 1800);
  };

  const stopThinkingCycle = () => {
    if (thinkingIntervalRef.current) {
      clearInterval(thinkingIntervalRef.current);
      thinkingIntervalRef.current = null;
    }
  };

  // Message Sender: Triggers Orb Shrinking & Moving to Top-Left
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setActiveTab('chat');
    setOrbPhase('shrinking');
    setIsThinking(true);
    startThinkingCycle();

    // After quick smooth spring transition, enter 'thinking' phase
    setTimeout(() => {
      setOrbPhase('thinking');
    }, 350);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-8),
          forceMock: settings.forceMockMode,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Analysis completed.';
      const source = data.source || 'mock';

      const assistantMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playSound('receive', settings.soundEnabled);
    } catch (err) {
      console.error(err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        role: 'assistant',
        content: `### Synthesis Generated (Offline Mode)\n\nI have evaluated your request regarding **"${userText}"**.\n\nEverything operates deterministically within the local client runtime. You can continue to explore queries or test tools seamlessly.`,
        timestamp: Date.now(),
        source: 'mock',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      playSound('receive', settings.soundEnabled);
    } finally {
      setIsThinking(false);
      stopThinkingCycle();
      setOrbPhase('finished');
    }
  };

  const handleNewConversation = () => {
    playSound('click', settings.soundEnabled);
    setOrbPhase('home');
    setActiveTab('home');
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('graviton_chat_history');
  };

  // Theme styling based on settings
  const themeClasses =
    settings.theme === 'midnight'
      ? 'bg-[#060a12] text-slate-100'
      : settings.theme === 'titanium'
      ? 'bg-[#0b0c10] text-slate-100'
      : 'bg-[#08090d] text-slate-100';

  const hasStartedConversation = messages.some((m) => m.role === 'user');

  return (
    <div className={`flex w-screen h-screen overflow-hidden ${themeClasses} selection:bg-sky-500/25 selection:text-sky-200`}>
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={settings.userName}
        hasApiKey={hasApiKey}
        forceMockMode={settings.forceMockMode}
        soundEnabled={settings.soundEnabled}
        onNewChat={handleNewConversation}
      />

      {/* Main Content Workspace */}
      <main id="graviton-main-workspace" className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeScreen
            userName={settings.userName}
            onSendMessage={handleSendMessage}
            typingEnergy={typingEnergy}
            onTyping={handleTyping}
            soundEnabled={settings.soundEnabled}
            orbIntensity={settings.orbIntensity}
            hasStartedConversation={hasStartedConversation}
          />
        )}

        {activeTab === 'chat' && (
          <ChatScreen
            messages={messages}
            isThinking={isThinking}
            thinkingMessage={thinkingMessage}
            orbPhase={orbPhase}
            typingEnergy={typingEnergy}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onNewConversation={handleNewConversation}
            soundEnabled={settings.soundEnabled}
            orbIntensity={settings.orbIntensity}
            hasApiKey={hasApiKey}
            forceMockMode={settings.forceMockMode}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsScreen
            soundEnabled={settings.soundEnabled}
            onSendToChat={(prompt) => {
              setActiveTab('chat');
              handleSendMessage(prompt);
            }}
          />
        )}

        {activeTab === 'files' && (
          <FilesScreen
            soundEnabled={settings.soundEnabled}
            onSendToChat={(prompt) => {
              setActiveTab('chat');
              handleSendMessage(prompt);
            }}
          />
        )}

        {activeTab === 'search' && (
          <SearchScreen
            messages={messages}
            soundEnabled={settings.soundEnabled}
            onSelectMessage={(msg) => {
              setActiveTab('chat');
            }}
            onSendToChat={(prompt) => {
              setActiveTab('chat');
              handleSendMessage(prompt);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            hasApiKey={hasApiKey}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>
    </div>
  );
}

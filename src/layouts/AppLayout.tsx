import React from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { useUIStore } from '../store';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const {
    isCopilotOpen,
    setCopilotOpen,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isAiLoading,
    setAiLoading
  } = useUIStore();

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userMessageId = Math.random().toString();
    const newUserMessage = {
      id: userMessageId,
      role: 'user' as const,
      content: chatInput,
      timestamp: 'Just now'
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    const originalInput = chatInput;
    setChatInput('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalInput })
      });

      if (!response.ok) {
        throw new Error('Network error reaching secure copilot engine');
      }

      const data = await response.json();
      const payload = data?.success ? data.data : data;
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant' as const,
          content: payload.text || payload.reply || "Grounded Copilot completed command successfully with no raw payload.",
          timestamp: 'Just now'
        }
      ]);
    } catch (error: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant' as const,
          content: `Security gateway error: ${error?.message || 'Failed to sync with Gemini LLM model.'}`,
          timestamp: 'Error'
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-bg text-white font-sans overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>

        <Footer />
      </div>

      {/* Slide-out secure Copilot Chat drawer */}
      {isCopilotOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-brand-bg-sec border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-intel animate-pulse" />
              <div>
                <p className="text-xs font-bold text-zinc-100">Grounded Copilot</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Enterprise RAG Mode</p>
              </div>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat message listing */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs line-clamp-none ${
                  msg.role === 'user'
                    ? 'bg-brand-accent/25 border border-brand-accent/30 text-white ml-auto rounded-tr-none'
                    : 'bg-white/[0.03] border border-white/5 text-zinc-200 rounded-tl-none'
                }`}
              >
                <p className="font-sans leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className="text-[8px] font-mono text-zinc-500 mt-1.5 self-end uppercase">
                  {msg.role === 'user' ? 'CLIENT' : 'Grounded AI'} • {msg.timestamp}
                </span>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-white/[0.01] border border-white/5 rounded-2xl p-3 max-w-[85%] rounded-tl-none">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-intel" /> Thinking...
              </div>
            )}
          </div>

          {/* Send Input form */}
          <form onSubmit={handleSendChat} className="p-4 border-t border-white/5 bg-brand-bg">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask custom metrics, columns or training goals..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-brand-accent/50"
                disabled={isAiLoading}
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-accent hover:bg-blue-500 text-white disabled:opacity-50 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

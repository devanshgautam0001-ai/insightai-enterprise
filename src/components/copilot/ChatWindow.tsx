import React, { useRef, useEffect } from 'react';
import { Conversation } from '../../types/copilot';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingAnimation } from './TypingAnimation';
import { Download, Sparkles, Trash2, Layers } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation | null;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onLike: (msgId: string, liked: boolean) => void;
  onDislike: (msgId: string, disliked: boolean) => void;
  onExport: (format: 'pdf' | 'pptx' | 'md' | 'html') => void;
  onDeleteCurrent: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  isStreaming,
  onSendMessage,
  onLike,
  onDislike,
  onExport,
  onDeleteCurrent
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isStreaming]);

  const handleSelectSuggestion = (prompt: string) => {
    onSendMessage(prompt);
  };

  const activeFilesCount = conversation?.contextFiles?.length || 0;

  return (
    <div className="flex flex-col h-full bg-zinc-950/20 border border-white/5 rounded-2xl overflow-hidden" id="copilot-workspace-window">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-md shadow-purple-500/5">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {conversation?.title || 'Sandbox Session'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-500" />
                {activeFilesCount} Files Mounted
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        {conversation && (
          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Export options */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-all">
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl hidden group-hover:block z-50">
                <button
                  onClick={() => onExport('md')}
                  className="w-full text-left px-3.5 py-2 hover:bg-white/5 text-zinc-300 hover:text-white text-[11px]"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={() => onExport('html')}
                  className="w-full text-left px-3.5 py-2 hover:bg-white/5 text-zinc-300 hover:text-white text-[11px]"
                >
                  HTML Page (.html)
                </button>
                <button
                  onClick={() => onExport('pdf')}
                  className="w-full text-left px-3.5 py-2 hover:bg-white/5 text-zinc-300 hover:text-white text-[11px]"
                >
                  PDF Report (.pdf)
                </button>
                <button
                  onClick={() => onExport('pptx')}
                  className="w-full text-left px-3.5 py-2 hover:bg-white/5 text-zinc-300 hover:text-white text-[11px]"
                >
                  PowerPoint (.pptx)
                </button>
              </div>
            </div>

            <button
              onClick={onDeleteCurrent}
              className="p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-zinc-500 hover:text-red-400 transition-colors"
              title="Clear Session Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Messages Feed area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {conversation?.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onLike={(liked) => onLike(msg.id, liked)}
            onDislike={(disliked) => onDislike(msg.id, disliked)}
            onSelectSuggestion={handleSelectSuggestion}
          />
        ))}

        {isStreaming && (
          <div className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-zinc-950/20">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border bg-purple-600/10 border-purple-500/20 text-purple-400 shadow-md shadow-purple-500/5">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                <span className="font-semibold text-zinc-400">ENTERPRISE COPILOT</span>
                <span>•</span>
                <span>Streaming Token Weights</span>
              </div>
              <TypingAnimation />
            </div>
          </div>
        )}

        {(!conversation || conversation.messages.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="p-4 rounded-full bg-purple-500/5 text-purple-400 border border-purple-500/10">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-300">Start an AI-Powered analytical workspace</h4>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Mount structured ledgers, trigger real-time feature charts, generate Python dataframes, or compose complex SQL indexes.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Bottom Input dock */}
      <div className="p-5 border-t border-white/5 bg-zinc-950/20">
        <ChatInput onSend={onSendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
};
export default ChatWindow;

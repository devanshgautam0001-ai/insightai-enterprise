import React, { useState } from 'react';
import { Send, Database, FileCode, BarChart3, Landmark } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  const handleShortcutClick = (prompt: string) => {
    if (disabled) return;
    onSend(prompt);
  };

  const shortcuts = [
    { label: 'SQL Query', icon: Database, prompt: 'Generate an optimized SQL query to review segment performance.' },
    { label: 'Pandas Script', icon: FileCode, prompt: 'Write a pandas python script to find and clean outliers.' },
    { label: 'Revenue Chart', icon: BarChart3, prompt: 'Show me a breakdown of transaction amounts in a bar chart.' },
    { label: 'Executive Summary', icon: Landmark, prompt: 'Provide an executive summary of current transaction amounts and margins.' }
  ];

  return (
    <div className="space-y-3" id="copilot-input-dock">
      {/* Quick shortcuts toolbelt */}
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((sc, idx) => {
          const Icon = sc.icon;
          return (
            <button
              key={idx}
              onClick={() => handleShortcutClick(sc.prompt)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400 hover:text-white hover:border-purple-500/20 hover:bg-purple-500/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Icon className="w-3.5 h-3.5 text-purple-400" />
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-md focus-within:border-purple-500/40 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all p-1.5 flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Query your CSV dataset, write a SQL structure, plot charts..."
            className="w-full bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none text-sm text-zinc-100 placeholder-zinc-500 pl-3.5 pr-12 py-2"
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
export default ChatInput;

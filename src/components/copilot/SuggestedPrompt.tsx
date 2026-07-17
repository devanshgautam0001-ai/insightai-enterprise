import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SuggestedPromptProps {
  prompt: string;
  onClick: () => void;
}

export const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({ prompt, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full text-left p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-purple-500/20 text-zinc-300 hover:text-white transition-all text-xs font-sans group relative overflow-hidden"
      type="button"
    >
      <div className="flex items-center gap-2.5 max-w-[90%]">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 group-hover:animate-pulse" />
        <span className="truncate leading-relaxed">{prompt}</span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transform translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
    </button>
  );
};
export default SuggestedPrompt;

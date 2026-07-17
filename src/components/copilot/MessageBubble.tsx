import React, { useState } from 'react';
import { ChatMessage } from '../../types/copilot';
import { Sparkles, User, Copy, Check, ThumbsUp, ThumbsDown, RotateCw } from 'lucide-react';
import { SQLPreview } from './SQLPreview';
import { PythonPreview } from './PythonPreview';
import { ChartRenderer } from './ChartRenderer';
import { SuggestedPrompt } from './SuggestedPrompt';

interface MessageBubbleProps {
  message: ChatMessage;
  onLike: (liked: boolean) => void;
  onDislike: (disliked: boolean) => void;
  onRegenerate?: () => void;
  onSelectSuggestion?: (prompt: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onLike,
  onDislike,
  onRegenerate,
  onSelectSuggestion
}) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 p-5 rounded-2xl border transition-all ${
      isAssistant
        ? 'bg-zinc-950/20 border-white/5 shadow-inner'
        : 'bg-white/[0.01] border-transparent'
    }`} id={`bubble-${message.id}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
        isAssistant
          ? 'bg-purple-600/10 border-purple-500/20 text-purple-400 shadow-md shadow-purple-500/5'
          : 'bg-zinc-800 border-white/5 text-zinc-300'
      }`}>
        {isAssistant ? <Sparkles className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
      </div>

      {/* Content wrapper */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Timestamp */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
          <span className="font-semibold text-zinc-400">
            {isAssistant ? 'ENTERPRISE COPILOT' : 'USER INQUIRY'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Text body */}
        <div className="text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
          {message.content || (message.isStreaming && <span className="text-zinc-500 animate-pulse font-mono text-xs">Connecting sandbox context and compiling vector embeddings...</span>)}
        </div>

        {/* Embedded SQL query */}
        {message.sql && <SQLPreview sql={message.sql} />}

        {/* Embedded Python/Pandas script */}
        {message.python && <PythonPreview python={message.python} />}

        {/* Embedded Charts */}
        {message.chart && (
          <ChartRenderer
            type={message.chart.type}
            data={message.chart.data}
            keys={message.chart.keys}
            xKey={message.chart.xKey}
          />
        )}

        {/* Interactive suggestions or follow ups */}
        {isAssistant && message.suggestions && message.suggestions.length > 0 && onSelectSuggestion && (
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              SUGGESTED FOLLOW-UPS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {message.suggestions.map((sug, i) => (
                <SuggestedPrompt key={i} prompt={sug} onClick={() => onSelectSuggestion(sug)} />
              ))}
            </div>
          </div>
        )}

        {/* Feedback triggers footer */}
        {isAssistant && !message.isStreaming && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] font-mono">
            <div className="flex items-center gap-3 text-zinc-500">
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  type="button"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-white transition-colors"
                type="button"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className={copied ? 'text-emerald-400' : ''}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLike(!message.liked)}
                className={`p-1 rounded transition-colors hover:bg-white/5 ${
                  message.liked ? 'text-emerald-400' : 'text-zinc-500'
                }`}
                title="Helpful response"
                type="button"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDislike(!message.disliked)}
                className={`p-1 rounded transition-colors hover:bg-white/5 ${
                  message.disliked ? 'text-red-400' : 'text-zinc-500'
                }`}
                title="Unhelpful response"
                type="button"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageBubble;

import React, { useState } from 'react';
import { MessageSquare, Send, AtSign, Users } from 'lucide-react';
import { DashboardComment } from '../../types/dashboard';

interface CommentPanelProps {
  comments: DashboardComment[];
  onAddComment: (text: string) => void;
}

export const CommentPanel: React.FC<CommentPanelProps> = ({ comments, onAddComment }) => {
  const [newTxt, setNewTxt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxt.trim()) return;
    onAddComment(newTxt.trim());
    setNewTxt('');
  };

  const insertMention = () => {
    setNewTxt((prev) => prev + '@analyst@enterprise.io ');
  };

  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs flex flex-col justify-between h-full space-y-4">
      {/* Header thread details */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">Workspace Team Chat</h4>
            <p className="text-[10px] font-mono text-zinc-500">Live multi-user collaboration</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[9px] text-zinc-400 font-semibold bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          <Users className="w-3 h-3 text-zinc-500" />
          <span>3 online</span>
        </div>
      </div>

      {/* Message thread body list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[190px] space-y-3 pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-4 text-zinc-500 italic text-[11px]">No active threads. Start typing below...</div>
        ) : (
          comments.map((cm) => (
            <div key={cm.id} className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200 text-[10px] truncate max-w-[120px]">{cm.author.split('@')[0]}</span>
                <span className="text-[9px] font-mono text-zinc-500">{cm.timestamp}</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-normal">
                {cm.text.includes('@') ? (
                  <span>
                    {cm.text.split(' ').map((word, idx) => {
                      if (word.startsWith('@')) {
                        return <span key={idx} className="text-purple-400 font-semibold mr-1 font-mono">{word}</span>;
                      }
                      return word + ' ';
                    })}
                  </span>
                ) : (
                  cm.text
                )}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Compose bottom bar */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-1.5 pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={insertMention}
          className="p-1.5 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
          title="Tag user"
        >
          <AtSign className="w-3.5 h-3.5" />
        </button>
        <input
          type="text"
          placeholder="Ask a question..."
          value={newTxt}
          onChange={(e) => setNewTxt(e.target.value)}
          className="flex-1 bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 text-[11px] focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="p-1.5 bg-purple-500 hover:bg-purple-600 rounded text-white active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
export default CommentPanel;

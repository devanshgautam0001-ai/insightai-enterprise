import React from 'react';
import { useChat } from '../../hooks/useChat';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MessageSquare, Calendar, Trash2, ArrowRight, Activity } from 'lucide-react';

interface ChatHistoryProps {
  onNavigateToChat: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ onNavigateToChat }) => {
  const { conversations, deleteConversation } = useChat();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Active Conversation Ledger</h2>
        <p className="text-sm text-zinc-400">
          Review, analyze, resume or purge historically cached workspace intelligence sessions securely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conversations.map((c) => (
          <Card
            key={c.id}
            className="border border-white/5 bg-zinc-950/20 p-5 hover:border-white/10 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-purple-500/5 text-purple-400 border border-purple-500/10">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <button
                  onClick={() => deleteConversation(c.id)}
                  className="p-1 rounded text-zinc-600 hover:text-red-400 transition-colors"
                  title="Delete Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-purple-400 transition-colors">
                  {c.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last active: {c.updatedAt}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 font-mono truncate bg-black/30 px-3 py-2 rounded-lg border border-white/[0.02]">
                {c.messages[c.messages.length - 1]?.content || 'Empty Session'}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                {c.messages.length} Messages
              </span>
              <Button size="sm" variant="secondary" onClick={() => onNavigateToChat(c.id)}>
                Resume Session
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        ))}

        {conversations.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-full inline-block text-zinc-600">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-semibold text-zinc-400">0 Cached Conversation Sessions</h4>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">
              Historical prompts persist locally. Launch a new AI workspace to trigger active intelligence memory loops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatHistory;

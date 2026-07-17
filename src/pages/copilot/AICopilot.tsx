import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useCopilot } from '../../hooks/useCopilot';
import { ChatWindow } from '../../components/copilot/ChatWindow';
import { ConversationSidebar } from '../../components/copilot/ConversationSidebar';
import { PromptLibrary } from './PromptLibrary';
import { InsightFeed } from './InsightFeed';
import { SQLGenerator } from './SQLGenerator';
import { PythonGenerator } from './PythonGenerator';
import { ReportGenerator } from './ReportGenerator';
import { ChatHistory } from './ChatHistory';
import {
  MessageSquare,
  Sparkles,
  Library,
  Terminal,
  Code,
  FileText,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AICopilot: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');

  const {
    conversations,
    activeConversation,
    isStreaming,
    contextFiles,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    addContextFile,
    removeContextFile,
    handleLikeMessage,
    handleDislikeMessage
  } = useChat();

  const { getExportData } = useCopilot();

  const tabs = [
    { id: 'chat', label: 'AI Workspace', icon: MessageSquare },
    { id: 'insights', label: 'Strategic Insights', icon: Sparkles },
    { id: 'sql', label: 'SQL Translator', icon: Terminal },
    { id: 'python', label: 'Python Engine', icon: Code },
    { id: 'prompts', label: 'Prompt Catalog', icon: Library },
    { id: 'reports', label: 'Report Composer', icon: FileText },
    { id: 'history', label: 'Session Ledger', icon: History }
  ];

  const handleNavigateToChat = (id: string) => {
    selectConversation(id);
    setActiveTab('chat');
  };

  const handleExport = (format: 'pdf' | 'pptx' | 'md' | 'html') => {
    if (!activeConversation) return;
    const report = getExportData(format, activeConversation.messages);

    // Dynamic browser file download
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enterprise_copilot_session_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[680px]">
            {/* Sidebar Context */}
            <div className="xl:col-span-1 h-full">
              <ConversationSidebar
                conversations={conversations}
                activeId={activeConversation?.id || null}
                onSelect={selectConversation}
                onDelete={deleteConversation}
                onCreate={createConversation}
                contextFiles={contextFiles}
                onAddFile={addContextFile}
                onRemoveFile={removeContextFile}
              />
            </div>

            {/* Principal Chat window */}
            <div className="xl:col-span-3 h-full">
              <ChatWindow
                conversation={activeConversation}
                isStreaming={isStreaming}
                onSendMessage={sendMessage}
                onLike={handleLikeMessage}
                onDislike={handleDislikeMessage}
                onExport={handleExport}
                onDeleteCurrent={() => activeConversation && deleteConversation(activeConversation.id)}
              />
            </div>
          </div>
        );

      case 'insights':
        return <InsightFeed />;
      case 'sql':
        return <SQLGenerator />;
      case 'python':
        return <PythonGenerator />;
      case 'prompts':
        return <PromptLibrary />;
      case 'reports':
        return <ReportGenerator />;
      case 'history':
        return <ChatHistory onNavigateToChat={handleNavigateToChat} />;
      default:
        return <InsightFeed />;
    }
  };

  return (
    <div className="space-y-6" id="ai-copilot-module-root">
      {/* Tab Navigation header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
              type="button"
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeCopilotTabUnderline"
                  className="absolute bottom-[-9px] left-4 right-4 h-[2px] bg-purple-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Primary Workspace Panel */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default AICopilot;

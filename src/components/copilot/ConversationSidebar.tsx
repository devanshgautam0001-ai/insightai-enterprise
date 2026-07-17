import React, { useRef, useState } from 'react';
import { Conversation } from '../../types/copilot';
import { Plus, MessageSquare, Trash2, UploadCloud } from 'lucide-react';
import { FileContextCard } from './FileContextCard';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  contextFiles: string[];
  onAddFile: (name: string) => void;
  onRemoveFile: (name: string) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onCreate,
  contextFiles,
  onAddFile,
  onRemoveFile
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onAddFile(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAddFile(file.name);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/20 border-r border-white/5 p-4 space-y-6 overflow-y-auto scrollbar-thin">
      {/* Workspace actions */}
      <button
        onClick={onCreate}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-medium border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all shadow-lg shadow-purple-500/5 active:scale-[0.98]"
        type="button"
      >
        <Plus className="w-4 h-4" />
        <span>New AI Workspace</span>
      </button>

      {/* Conversations history ledger */}
      <div className="space-y-2">
        <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
          Active Workspace Logs
        </label>
        <div className="space-y-1.5 max-h-[220px] overflow-y-auto scrollbar-thin">
          {conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <div
                key={c.id}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/10 border-purple-500/20 text-purple-300'
                    : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-zinc-400 hover:text-white'
                }`}
                onClick={() => onSelect(c.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                  <div className="truncate text-xs font-medium">
                    {c.title}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[9px] font-mono text-zinc-600 group-hover:hidden">
                    {c.updatedAt}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c.id);
                    }}
                    className="p-1 rounded text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Conversation"
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          {conversations.length === 0 && (
            <div className="text-center text-zinc-600 text-[11px] py-4 font-mono italic">
              No conversations logged
            </div>
          )}
        </div>
      </div>

      {/* RAG Data / Upload Files Section */}
      <div className="space-y-4 border-t border-white/5 pt-4">
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1 mb-1">
            Sandbox Context (RAG)
          </label>
          <p className="text-[10px] text-zinc-500 pl-1 leading-relaxed">
            All workspace conversations carry structural awareness of loaded datasets.
          </p>
        </div>

        {/* Current contextualized files */}
        <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
          {contextFiles.map((file) => (
            <FileContextCard key={file} fileName={file} onRemove={() => onRemoveFile(file)} />
          ))}
          {contextFiles.length === 0 && (
            <div className="text-center text-[11px] text-zinc-600 py-3 font-mono italic">
              0 files loaded. Copilot running generic LLM weights.
            </div>
          )}
        </div>

        {/* Upload files container */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-purple-500 bg-purple-500/5 text-purple-400'
              : 'border-white/10 bg-white/[0.01] hover:border-white/20 text-zinc-500 hover:text-zinc-400'
          }`}
        >
          <UploadCloud className="w-6 h-6 mx-auto mb-2 text-zinc-500 group-hover:text-zinc-400" />
          <p className="text-[10px] font-semibold">Feed CSV / JSON / Parquet</p>
          <p className="text-[9px] text-zinc-600 mt-0.5">Drag-and-drop or Browse directories</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".csv,.json,.parquet,.xlsx,.xls"
          />
        </div>
      </div>
    </div>
  );
};
export default ConversationSidebar;

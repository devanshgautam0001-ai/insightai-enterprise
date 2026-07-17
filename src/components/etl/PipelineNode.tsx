import React from 'react';
import { Database, ShieldAlert, Settings, Cpu, Play, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { PipelineNode as NodeDataType } from '../../types/pipeline';

interface PipelineNodeProps {
  node: NodeDataType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
}

export const PipelineNode: React.FC<PipelineNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onRemove,
  onDragStart,
}) => {
  const getIcon = () => {
    switch (node.type) {
      case 'source':
        return <Database className="w-5 h-5 text-blue-400" />;
      case 'clean':
        return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
      case 'transform':
        return <Settings className="w-5 h-5 text-purple-400" />;
      case 'engineer':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'sink':
        return <Play className="w-5 h-5 text-rose-400" />;
      default:
        return <Settings className="w-5 h-5 text-zinc-400" />;
    }
  };

  const statusBorderColor = {
    idle: 'border-white/5',
    running: 'border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    success: 'border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    failed: 'border-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  }[node.status];

  return (
    <div
      style={{ left: node.x, top: node.y }}
      onMouseDown={(e) => onDragStart(e, node.id)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      className={`absolute w-56 rounded-xl border bg-zinc-950/90 backdrop-blur-md p-4 flex flex-col justify-between group cursor-grab active:cursor-grabbing transition-shadow ${statusBorderColor} ${
        isSelected ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
            {getIcon()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{node.label}</h4>
            <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
              {node.type}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(node.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-3 border-t border-white/5">
        <span className="capitalize">{node.status}</span>
        {node.status === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
        {node.status === 'running' && (
          <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        )}
        {node.status === 'failed' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
        {node.status === 'idle' && <span className="w-2 h-2 rounded-full bg-zinc-700" />}
      </div>
    </div>
  );
};
export default PipelineNode;

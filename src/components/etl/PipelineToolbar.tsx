import React from 'react';
import { Database, ShieldAlert, Settings, Cpu, Play, Save, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface PipelineToolbarProps {
  onAddNode: (type: 'source' | 'clean' | 'transform' | 'engineer' | 'sink') => void;
  onRun: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  isRunning: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const PipelineToolbar: React.FC<PipelineToolbarProps> = ({
  onAddNode,
  onRun,
  onSave,
  onUndo,
  onRedo,
  isRunning,
  canUndo = true,
  canRedo = true,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-zinc-950/80 border border-white/5 rounded-2xl backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mr-2">
          Node Library
        </span>
        
        <button
          onClick={() => onAddNode('source')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-all"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Source</span>
        </button>

        <button
          onClick={() => onAddNode('clean')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Clean</span>
        </button>

        <button
          onClick={() => onAddNode('transform')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-semibold transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Transform</span>
        </button>

        <button
          onClick={() => onAddNode('engineer')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold transition-all"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Engineer</span>
        </button>

        <button
          onClick={() => onAddNode('sink')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Sink</span>
        </button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-xl p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onSave}
          className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all"
        >
          <Save className="w-4 h-4" />
        </button>

        <Button
          onClick={onRun}
          disabled={isRunning}
          isLoading={isRunning}
          variant="primary"
          className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-zinc-950 font-bold border-none flex items-center gap-1.5"
        >
          <Play className="w-4 h-4 text-zinc-950 fill-current" />
          <span>Run Pipeline</span>
        </Button>
      </div>
    </div>
  );
};
export default PipelineToolbar;

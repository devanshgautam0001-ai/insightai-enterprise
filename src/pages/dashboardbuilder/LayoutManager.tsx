import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface LayoutManagerProps {
  onApplyPreset: (preset: 'executive' | 'operations' | 'sandbox') => void;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({ onApplyPreset }) => {
  const layouts = [
    {
      id: 'executive',
      title: 'Executive Summary Ledger',
      desc: 'Optimal layout highlighting 4 high-level KPI cards, followed by double side-by-side timeseries & sector graphs.',
      tag: 'Recommended'
    },
    {
      id: 'operations',
      title: 'Physical Operations Terminal',
      desc: 'Durable structure coupling geographical terminal markers on the left, side-by-side with high-volume data ledger rows.',
      tag: 'Dense Data'
    },
    {
      id: 'sandbox',
      title: 'Blank Sandbox Grid',
      desc: 'Clears the canvas entirely so analysts can stack charts, widgets, markdown texts, or AI auditors from scratch.',
      tag: 'Flexible'
    }
  ];

  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs space-y-4">
      {/* Header logs */}
      <div className="flex items-center space-x-2 pb-3.5 border-b border-white/5">
        <LayoutGrid className="w-4 h-4 text-purple-400" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Grid Presets</h4>
          <p className="text-[10px] font-mono text-zinc-500">Apply instant layout arrangements</p>
        </div>
      </div>

      {/* Preset options item loop */}
      <div className="space-y-2.5">
        {layouts.map((ly) => (
          <div
            key={ly.id}
            onClick={() => onApplyPreset(ly.id as any)}
            className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-500/25 cursor-pointer flex justify-between items-center transition-all group"
          >
            <div className="space-y-1 truncate pr-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-zinc-100 text-[11px] group-hover:text-purple-400 transition-colors">
                  {ly.title}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-400 bg-white/5 px-1.5 py-0.2 rounded-full">
                  {ly.tag}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed whitespace-normal">
                {ly.desc}
              </p>
            </div>

            <button className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-all text-[10px] font-semibold">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LayoutManager;

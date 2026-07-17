import React from 'react';
import { RefreshCw, Clock, Sparkles } from 'lucide-react';
import { DashboardWidget } from '../../types/dashboard';

interface WidgetSettingsProps {
  widget: DashboardWidget | null;
  onUpdateProperties: (id: string, props: any) => void;
}

export const WidgetSettings: React.FC<WidgetSettingsProps> = ({ widget, onUpdateProperties }) => {
  if (!widget) return null;

  const activeInterval = widget.properties.refreshInterval || 5;

  const handleIntervalChange = (interval: number) => {
    onUpdateProperties(widget.id, { refreshInterval: interval });
  };

  return (
    <div className="p-3.5 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-md text-xs space-y-3.5">
      <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
        <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
        <span>Live Sync Intervals</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-300">Autopolling period</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/[0.01] border border-white/5 rounded-md p-0.5">
          {[2, 5, 15, 30].map((sec) => (
            <button
              key={sec}
              onClick={() => handleIntervalChange(sec)}
              className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all ${
                activeInterval === sec
                  ? 'bg-purple-500 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-1.5 bg-purple-500/10 text-purple-300 p-2.5 rounded-lg border border-purple-500/10 text-[10px] leading-relaxed">
        <Sparkles className="w-3.5 h-3.5 mr-1 shrink-0 text-purple-400" />
        <span>Auto-polling ensures telemetry variables sync under microsecond constraints.</span>
      </div>
    </div>
  );
};
export default WidgetSettings;

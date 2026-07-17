import React from 'react';
import { TrendingUp, TrendingDown, Cpu } from 'lucide-react';
import { DashboardWidget } from '../../types/dashboard';

interface KPIWidgetProps {
  widget: DashboardWidget;
  liveValue?: string;
  isWebSocketActive?: boolean;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ widget, liveValue, isWebSocketActive }) => {
  const { properties } = widget;
  const displayValue = liveValue || properties.kpiValue || '$0';
  const label = properties.kpiLabel || widget.title;
  const trend = properties.kpiTrend !== undefined ? properties.kpiTrend : 0;
  const isUp = trend >= 0;

  return (
    <div className="h-full flex flex-col justify-between p-4 relative group">
      {/* Realtime WebSocket pulse */}
      {isWebSocketActive && (
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-purple-500/10 text-purple-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-purple-500/20 animate-pulse">
          <Cpu className="w-3 h-3" />
          <span>LIVE FEED</span>
        </div>
      )}

      <div>
        <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium truncate pr-20">
          {label}
        </div>
        <div className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white mt-1.5">
          {displayValue}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
        <div className="flex items-center space-x-1">
          {isUp ? (
            <span className="flex items-center text-xs font-medium text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +{trend}%
            </span>
          ) : (
            <span className="flex items-center text-xs font-medium text-rose-400 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {trend}%
            </span>
          )}
          <span className="text-[10px] text-zinc-500 font-mono ml-1">vs yesterday</span>
        </div>

        {/* Micro visual sparkline simulation */}
        <div className="flex items-end space-x-0.5 h-5 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="w-1 bg-zinc-600 rounded-t h-2 animate-pulse"></div>
          <div className="w-1 bg-zinc-500 rounded-t h-3"></div>
          <div className="w-1 bg-zinc-400 rounded-t h-4 animate-pulse"></div>
          <div className="w-1 bg-zinc-600 rounded-t h-1"></div>
          <div className="w-1 bg-purple-500 rounded-t h-5"></div>
        </div>
      </div>
    </div>
  );
};
export default KPIWidget;

import React from 'react';
import {
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Expand,
  Minimize2,
  CheckCircle
} from 'lucide-react';
import { DashboardWidget } from '../../types/dashboard';
import { KPIWidget } from './KPIWidget';
import { ChartWidget } from './ChartWidget';
import { TableWidget } from './TableWidget';

interface WidgetCardProps {
  widget: DashboardWidget;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onLayoutChange: (id: string, x: number, y: number, w: number, h: number) => void;
  liveValues?: {
    kpiRevenue: string;
    kpiMargin: string;
    kpiLoad: string;
    timeseriesData: any[];
    scatterplotData: any[];
    heatmapData: any[];
    isWebSocketActive: boolean;
  };
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  isSelected,
  onSelect,
  onDelete,
  onLayoutChange,
  liveValues
}) => {
  const { id, type, title, layout } = widget;

  // Layout parameters adjustments inside grid canvas
  const handleMove = (direction: 'left' | 'right' | 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    let { x, y, w, h } = layout;
    if (direction === 'left') x = Math.max(0, x - 1);
    if (direction === 'right') x = Math.min(11, x + 1);
    if (direction === 'up') y = Math.max(0, y - 1);
    if (direction === 'down') y = y + 1;
    onLayoutChange(id, x, y, w, h);
  };

  const handleResize = (action: 'expand' | 'shrink' | 'heighten' | 'shorten', e: React.MouseEvent) => {
    e.stopPropagation();
    let { x, y, w, h } = layout;
    if (action === 'expand') w = Math.min(12, w + 1);
    if (action === 'shrink') w = Math.max(1, w - 1);
    if (action === 'heighten') h = h + 1;
    if (action === 'shorten') h = Math.max(1, h - 1);
    onLayoutChange(id, x, y, w, h);
  };

  // Get active value
  const getKpiLiveValue = () => {
    if (!liveValues) return undefined;
    if (id === 'wdgt-kpi-rev') return liveValues.kpiRevenue;
    if (id === 'wdgt-kpi-margin') return liveValues.kpiMargin;
    if (id === 'wdgt-kpi-sat') return '93.5'; // Static NPS
    if (id === 'wdgt-kpi-forecast') return liveValues.kpiRevenue; // Forecasted Net Volume
    return undefined;
  };

  const renderContent = () => {
    if (type === 'kpi') {
      return (
        <KPIWidget
          widget={widget}
          liveValue={getKpiLiveValue()}
          isWebSocketActive={liveValues?.isWebSocketActive}
        />
      );
    }

    if (['line', 'bar', 'area', 'pie', 'scatter', 'bubble', 'radar', 'treemap', 'heatmap', 'gauge', 'forecast'].includes(type)) {
      return (
        <ChartWidget
          widget={widget}
          liveTimeseriesData={liveValues?.timeseriesData}
          liveScatterData={liveValues?.scatterplotData}
          liveHeatmapData={liveValues?.heatmapData}
        />
      );
    }

    if (type === 'table') {
      return <TableWidget widget={widget} />;
    }

    if (type === 'markdown' || type === 'text') {
      return (
        <div className="p-4 text-zinc-300 font-sans text-xs space-y-2 h-full overflow-y-auto">
          {widget.properties.markdownContent ? (
            <div className="prose prose-invert">
              <h4 className="text-white font-semibold text-sm mb-1">{widget.title}</h4>
              <p className="leading-relaxed whitespace-pre-wrap">{widget.properties.markdownContent}</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{widget.properties.textContent || 'No static text provided. Click Settings to modify.'}</p>
          )}
        </div>
      );
    }

    if (type === 'image') {
      return (
        <div className="w-full h-full p-2 flex items-center justify-center">
          <img
            src={widget.properties.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop'}
            alt={title}
            className="max-h-full max-w-full rounded object-cover border border-white/5"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (type === 'aiInsight') {
      return (
        <div className="p-4 flex flex-col justify-between h-full bg-purple-500/5 rounded-b-xl border-t border-purple-500/20">
          <div>
            <div className="flex items-center space-x-1.5 text-purple-400 font-mono text-[10px] font-bold uppercase mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>COGNITIVE REPORT</span>
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed italic">
              "{widget.properties.aiInsightText || 'AI summary details here.'}"
            </p>
          </div>
          <div className="text-[9px] text-purple-300 font-mono text-right mt-3">
            Updated just now • AutoML Core v2.4
          </div>
        </div>
      );
    }

    if (type === 'map') {
      return (
        <div className="w-full h-full p-3 flex flex-col justify-between font-mono text-[10px]">
          <div className="rounded border border-white/5 bg-zinc-900/60 p-2 text-zinc-400 space-y-1.5 h-full overflow-y-auto">
            <span className="text-purple-400 font-bold block mb-1">🗺️ ACTIVE TERMINAL SITES:</span>
            {widget.properties.mapMarkers?.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9px] hover:text-white">
                <span>{m.label}</span>
                <span className="text-zinc-600">[{m.lat.toFixed(2)}, {m.lng.toFixed(2)}]</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="p-4 text-zinc-500 italic text-xs">Awaiting dataset synchronization...</div>;
  };

  return (
    <div
      onClick={onSelect}
      className={`h-full flex flex-col rounded-xl overflow-hidden border transition-all duration-300 relative group/card cursor-pointer ${
        isSelected
          ? 'bg-zinc-900/90 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30'
          : 'bg-zinc-950/40 border-white/5 backdrop-blur-md hover:border-white/10 hover:bg-zinc-900/50'
      }`}
    >
      {/* Mini Top Drag coordinates header */}
      <div className="px-3.5 py-2 border-b border-white/5 bg-white/[0.01] flex items-center justify-between select-none">
        <div className="flex items-center space-x-2 truncate">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-zinc-200 truncate">{title}</span>
          <span className="text-[9px] font-mono text-zinc-600 bg-zinc-900/80 px-1 py-0.2 rounded">
            Col: {layout.x} • W: {layout.w}
          </span>
        </div>

        {/* Action Header controls */}
        <div className="flex items-center space-x-1.5 opacity-45 group-hover/card:opacity-100 transition-opacity">
          {/* Quick Layout Movers */}
          <div className="flex items-center space-x-0.5 border-r border-white/5 pr-1.5 mr-0.5">
            <button
              onClick={(e) => handleMove('left', e)}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
              title="Move left"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleMove('right', e)}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
              title="Move right"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleMove('up', e)}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
              title="Move up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleMove('down', e)}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
              title="Move down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Sizers */}
          <div className="flex items-center space-x-0.5 border-r border-white/5 pr-1.5 mr-0.5">
            <button
              onClick={(e) => handleResize('expand', e)}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
              title="Expand width"
            >
              <Expand className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleResize('shrink', e)}
              className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
              title="Shrink width"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`p-1 rounded transition-colors ${
              isSelected ? 'text-purple-400 bg-purple-500/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main visual asset */}
      <div className="flex-1 relative overflow-hidden bg-white/[0.01]">
        {renderContent()}
      </div>
    </div>
  );
};
export default WidgetCard;

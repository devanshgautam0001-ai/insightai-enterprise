import React from 'react';
import { Tv, ArrowLeft, Cpu } from 'lucide-react';
import { Dashboard } from '../../types/dashboard';
import { KPIWidget } from './KPIWidget';
import { ChartWidget } from './ChartWidget';
import { TableWidget } from './TableWidget';

interface DashboardPreviewProps {
  dashboard: Dashboard;
  onClose: () => void;
  liveValues: {
    kpiRevenue: string;
    kpiMargin: string;
    kpiLoad: string;
    timeseriesData: any[];
    scatterplotData: any[];
    heatmapData: any[];
    isWebSocketActive: boolean;
  };
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  dashboard,
  onClose,
  liveValues
}) => {
  const getKpiLiveValue = (id: string) => {
    if (id === 'wdgt-kpi-rev') return liveValues.kpiRevenue;
    if (id === 'wdgt-kpi-margin') return liveValues.kpiMargin;
    if (id === 'wdgt-kpi-sat') return '93.5';
    if (id === 'wdgt-kpi-forecast') return liveValues.kpiRevenue;
    return undefined;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col overflow-y-auto custom-scrollbar p-6">
      {/* Presentation Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Presentation</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Tv className="w-4 h-4 text-purple-400" />
              <h1 className="text-sm font-bold tracking-tight text-white uppercase">{dashboard.name}</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{dashboard.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {liveValues.isWebSocketActive && (
            <div className="flex items-center space-x-1.5 bg-purple-500/10 text-purple-400 text-[10px] font-mono px-2 py-1 rounded-md border border-purple-500/20 animate-pulse">
              <Cpu className="w-3.5 h-3.5" />
              <span>LIVE AUTOMATION SYSTEM ACTIVE</span>
            </div>
          )}
          <span className="text-[10px] text-zinc-500 font-mono uppercase bg-white/5 px-2 py-1 rounded">
            Version: v{dashboard.version}
          </span>
        </div>
      </div>

      {/* Grid view canvas */}
      <div className="grid grid-cols-12 gap-4 flex-1">
        {dashboard.widgets.map((widget) => {
          const spanClass = `col-span-12 md:col-span-${widget.layout.w}`;
          let heightClass = 'min-h-[160px]';
          if (widget.layout.h === 1) heightClass = 'min-h-[110px]';
          if (widget.layout.h === 2) heightClass = 'min-h-[160px]';
          if (widget.layout.h >= 3 && widget.layout.h <= 4) heightClass = 'min-h-[290px]';
          if (widget.layout.h > 4) heightClass = 'min-h-[420px]';

          return (
            <div
              key={widget.id}
              className={`${spanClass} ${heightClass} bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden`}
              style={{
                gridRowStart: widget.layout.y + 1
              }}
            >
              {/* Header inside presentation */}
              <div className="px-4 py-2 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300 tracking-wide uppercase">{widget.title}</span>
              </div>

              {/* Contents block */}
              <div className="p-2 h-[calc(100%-35px)]">
                {widget.type === 'kpi' ? (
                  <KPIWidget
                    widget={widget}
                    liveValue={getKpiLiveValue(widget.id)}
                    isWebSocketActive={liveValues.isWebSocketActive}
                  />
                ) : ['line', 'bar', 'area', 'pie', 'scatter', 'bubble', 'radar', 'treemap', 'heatmap', 'gauge', 'forecast'].includes(widget.type) ? (
                  <ChartWidget
                    widget={widget}
                    liveTimeseriesData={liveValues.timeseriesData}
                    liveScatterData={liveValues.scatterplotData}
                    liveHeatmapData={liveValues.heatmapData}
                  />
                ) : widget.type === 'table' ? (
                  <TableWidget widget={widget} />
                ) : widget.type === 'markdown' || widget.type === 'text' ? (
                  <p className="p-3 text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{widget.properties.markdownContent || widget.properties.textContent}</p>
                ) : widget.type === 'image' ? (
                  <img src={widget.properties.imageUrl} className="max-h-full max-w-full rounded mx-auto" />
                ) : widget.type === 'aiInsight' ? (
                  <div className="p-3 text-xs italic text-purple-300">"{widget.properties.aiInsightText}"</div>
                ) : (
                  <div className="p-4 text-zinc-500 text-xs italic">Awaiting sync...</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DashboardPreview;

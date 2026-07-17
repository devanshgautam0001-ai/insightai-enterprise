import React from 'react';
import { DashboardWidget } from '../../types/dashboard';
import { WidgetCard } from './WidgetCard';

const colSpanClasses: Record<number, string> = {
  1: 'col-span-1 md:col-span-1',
  2: 'col-span-2 md:col-span-2',
  3: 'col-span-3 md:col-span-3',
  4: 'col-span-4 md:col-span-4',
  5: 'col-span-5 md:col-span-5',
  6: 'col-span-6 md:col-span-6',
  7: 'col-span-7 md:col-span-7',
  8: 'col-span-8 md:col-span-8',
  9: 'col-span-9 md:col-span-9',
  10: 'col-span-10 md:col-span-10',
  11: 'col-span-11 md:col-span-11',
  12: 'col-span-12 md:col-span-12',
};

interface GridCanvasProps {
  widgets: DashboardWidget[];
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onDeleteWidget: (id: string) => void;
  onLayoutChange: (id: string, x: number, y: number, w: number, h: number) => void;
  zoom: number;
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

export const GridCanvas: React.FC<GridCanvasProps> = ({
  widgets,
  selectedWidgetId,
  onSelectWidget,
  onDeleteWidget,
  onLayoutChange,
  zoom,
  liveValues
}) => {
  // Sort widgets to display them appropriately if using static flow, or absolute-position them
  // We can render them inside a premium CSS grid wrapper.
  // Standard CSS grid-cols-12 where widget.layout.w is the span.
  // To avoid overflowing or missing offsets, we sort widgets by y then x coordinates
  const sortedWidgets = [...widgets].sort((a, b) => {
    if (a.layout.y !== b.layout.y) return a.layout.y - b.layout.y;
    return a.layout.x - b.layout.x;
  });

  return (
    <div
      className="relative w-full h-full p-4 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-lg overflow-y-auto custom-scrollbar"
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease-in-out',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[350px] text-center p-6 border-2 border-dashed border-white/5 rounded-xl">
          <span className="text-3xl mb-3">🧱</span>
          <h4 className="text-sm font-semibold text-zinc-300">Your Canvas is Blank</h4>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Click "Add Widget" in the toolbar to drag KPIs, Line Charts, high-fidelity heatmaps or forecast modules onto your page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {sortedWidgets.map((widget) => {
            const spanClass = colSpanClasses[widget.layout.w] || 'col-span-12';
            // Map grid heights cleanly
            let heightStyle = 'min-h-[160px]';
            if (widget.layout.h === 1) heightStyle = 'min-h-[110px]';
            if (widget.layout.h === 2) heightStyle = 'min-h-[160px]';
            if (widget.layout.h >= 3 && widget.layout.h <= 4) heightStyle = 'min-h-[290px]';
            if (widget.layout.h > 4) heightStyle = 'min-h-[420px]';

            return (
              <div
                key={widget.id}
                className={`${spanClass} ${heightStyle} transition-all duration-300`}
                style={{
                  gridRowStart: widget.layout.y + 1
                }}
              >
                <WidgetCard
                  widget={widget}
                  isSelected={selectedWidgetId === widget.id}
                  onSelect={() => onSelectWidget(widget.id)}
                  onDelete={() => onDeleteWidget(widget.id)}
                  onLayoutChange={onLayoutChange}
                  liveValues={liveValues}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default GridCanvas;

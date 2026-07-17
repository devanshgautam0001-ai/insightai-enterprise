import React, { useState, useEffect } from 'react';
import { Sliders, Check } from 'lucide-react';
import { DashboardWidget } from '../../types/dashboard';

interface PropertyPanelProps {
  widget: DashboardWidget | null;
  onUpdateProperties: (id: string, props: any) => void;
  onUpdateStyle: (id: string, style: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  widget,
  onUpdateProperties,
  onUpdateStyle
}) => {
  const [title, setTitle] = useState('');
  const [kpiValue, setKpiValue] = useState('');
  const [kpiLabel, setKpiLabel] = useState('');
  const [kpiTrend, setKpiTrend] = useState(0);
  const [markdown, setMarkdown] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [aiText, setAiText] = useState('');
  const [accentColor, setAccentColor] = useState('');

  // Sync state with selected widget
  useEffect(() => {
    if (widget) {
      setTitle(widget.title || '');
      setKpiValue(String(widget.properties.kpiValue || ''));
      setKpiLabel(widget.properties.kpiLabel || '');
      setKpiTrend(widget.properties.kpiTrend || 0);
      setMarkdown(widget.properties.markdownContent || '');
      setImageUrl(widget.properties.imageUrl || '');
      setAiText(widget.properties.aiInsightText || '');
    }
  }, [widget]);

  if (!widget) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950/40 border border-white/5 rounded-2xl backdrop-blur-xl">
        <Sliders className="w-8 h-8 text-zinc-600 mb-3 animate-pulse" />
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Properties Inspector</h4>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
          Select any widget on the grid canvas to fine-tune its dataset properties, layout scales, and colors.
        </p>
      </div>
    );
  }

  const handleApplyProperties = () => {
    const nextProps: any = {};
    if (widget.type === 'kpi') {
      nextProps.kpiValue = kpiValue;
      nextProps.kpiLabel = kpiLabel;
      nextProps.kpiTrend = Number(kpiTrend);
    } else if (widget.type === 'markdown' || widget.type === 'text') {
      nextProps.markdownContent = markdown;
      nextProps.textContent = markdown;
    } else if (widget.type === 'image') {
      nextProps.imageUrl = imageUrl;
    } else if (widget.type === 'aiInsight') {
      nextProps.aiInsightText = aiText;
    }

    onUpdateProperties(widget.id, {
      ...nextProps
    });

    onUpdateStyle(widget.id, {
      borderColor: accentColor || undefined
    });
  };

  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs space-y-5 h-full overflow-y-auto custom-scrollbar">
      {/* Panel header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Sliders className="w-4 h-4 text-purple-400" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Config Settings</h4>
          <p className="text-[10px] font-mono text-zinc-500">ID: {widget.id.slice(0, 14)}...</p>
        </div>
      </div>

      {/* Title Field */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Component Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => onUpdateProperties(widget.id, {})}
          className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Smart Contextual Settings form depending on widget.type */}
      {widget.type === 'kpi' && (
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">KPI Value Metric</label>
            <input
              type="text"
              value={kpiValue}
              onChange={(e) => setKpiValue(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">KPI Subtitle Label</label>
            <input
              type="text"
              value={kpiLabel}
              onChange={(e) => setKpiLabel(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Performance Trend (%)</label>
            <input
              type="number"
              value={kpiTrend}
              onChange={(e) => setKpiTrend(Number(e.target.value))}
              className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>
      )}

      {(widget.type === 'markdown' || widget.type === 'text') && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Rich Text content</label>
          <textarea
            value={markdown}
            rows={5}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-mono text-[10px]"
          />
        </div>
      )}

      {widget.type === 'image' && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Custom Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
      )}

      {widget.type === 'aiInsight' && (
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Audit Observations</label>
          <textarea
            value={aiText}
            rows={4}
            onChange={(e) => setAiText(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
          />
        </div>
      )}

      {/* Styled Color Tints selection */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Card Style Theme Tint</label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { name: 'Default', value: '' },
            { name: 'Purple', value: 'border-purple-500/40' },
            { name: 'Cyan', value: 'border-cyan-500/40' },
            { name: 'Emerald', value: 'border-emerald-500/40' },
            { name: 'Rose', value: 'border-rose-500/40' }
          ].map((themeOpt) => (
            <button
              key={themeOpt.name}
              onClick={() => {
                setAccentColor(themeOpt.value);
                onUpdateStyle(widget.id, { borderColor: themeOpt.value || undefined });
              }}
              className={`p-1.5 rounded text-[9px] font-mono text-center font-bold border transition-colors ${
                accentColor === themeOpt.value
                  ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                  : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {themeOpt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Apply properties trigger button */}
      <button
        onClick={handleApplyProperties}
        className="w-full flex items-center justify-center space-x-1.5 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all cursor-pointer text-xs mt-3"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Save Widget Config</span>
      </button>
    </div>
  );
};
export default PropertyPanel;

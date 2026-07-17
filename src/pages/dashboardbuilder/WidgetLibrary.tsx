import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  LineChart,
  AreaChart,
  PieChart,
  LayoutGrid,
  MapPin,
  Table,
  FileCode,
  Image,
  BrainCircuit,
  Lightbulb,
  Search,
  Plus
} from 'lucide-react';
import { WidgetType } from '../../types/dashboard';

interface WidgetLibraryProps {
  onAddWidget: (type: WidgetType, title: string) => void;
}

interface CatalogItem {
  type: WidgetType;
  title: string;
  category: 'metric' | 'chart' | 'data' | 'media' | 'ai';
  description: string;
  icon: React.ReactNode;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onAddWidget }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'metric' | 'chart' | 'data' | 'ai'>('all');

  const catalog: CatalogItem[] = [
    {
      type: 'kpi',
      title: 'KPI Card',
      category: 'metric',
      description: 'Single metric numeric display with daily delta percentages.',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />
    },
    {
      type: 'line',
      title: 'Line Chart',
      category: 'chart',
      description: 'Compare multiple numerical timeseries sequences.',
      icon: <LineChart className="w-4 h-4 text-purple-400" />
    },
    {
      type: 'bar',
      title: 'Bar Chart',
      category: 'chart',
      description: 'Categorical value segments comparisons.',
      icon: <BarChart3 className="w-4 h-4 text-blue-400" />
    },
    {
      type: 'area',
      title: 'Area Chart',
      category: 'chart',
      description: 'Highlight net cumulative volumes over time.',
      icon: <AreaChart className="w-4 h-4 text-indigo-400" />
    },
    {
      type: 'pie',
      title: 'Pie Chart',
      category: 'chart',
      description: 'Ratio segment distribution of high level groups.',
      icon: <PieChart className="w-4 h-4 text-rose-400" />
    },
    {
      type: 'scatter',
      title: 'Scatter Plot',
      category: 'chart',
      description: 'Correlations between spend variables and conversions.',
      icon: <TrendingUp className="w-4 h-4 text-pink-400" />
    },
    {
      type: 'radar',
      title: 'Radar Chart',
      category: 'chart',
      description: 'Multi-variable model weight comparison nodes.',
      icon: <BrainCircuit className="w-4 h-4 text-amber-400" />
    },
    {
      type: 'treemap',
      title: 'Treemap Layout',
      category: 'chart',
      description: 'Nested rectangular sizes showing region weights.',
      icon: <LayoutGrid className="w-4 h-4 text-cyan-400" />
    },
    {
      type: 'heatmap',
      title: 'Heatmap System Load',
      category: 'chart',
      description: 'Day vs Hour network gateway load density table.',
      icon: <LayoutGrid className="w-4 h-4 text-violet-400" />
    },
    {
      type: 'gauge',
      title: 'Threshold Gauge',
      category: 'chart',
      description: 'Speedometer gauge for compliance ratios.',
      icon: <TrendingUp className="w-4 h-4 text-teal-400" />
    },
    {
      type: 'map',
      title: 'Active Nodes Map',
      category: 'data',
      description: 'Geospatial markers pinpointing operational terminals.',
      icon: <MapPin className="w-4 h-4 text-red-400" />
    },
    {
      type: 'table',
      title: 'Data Ledger Grid',
      category: 'data',
      description: 'Tabular reports with search queries and sort columns.',
      icon: <Table className="w-4 h-4 text-emerald-400" />
    },
    {
      type: 'markdown',
      title: 'Markdown Card',
      category: 'media',
      description: 'Rich-text card supporting standard header formats.',
      icon: <FileCode className="w-4 h-4 text-zinc-400" />
    },
    {
      type: 'image',
      title: 'Visual Asset',
      category: 'media',
      description: 'Static image link supporting unsplash references.',
      icon: <Image className="w-4 h-4 text-blue-400" />
    },
    {
      type: 'aiInsight',
      title: 'AI Insight Auditor',
      category: 'ai',
      description: 'Auto-synthesizes recommendations over delta anomalies.',
      icon: <Lightbulb className="w-4 h-4 text-purple-400" />
    },
    {
      type: 'forecast',
      title: 'AI Forecast Estimator',
      category: 'ai',
      description: 'Projected Q4 performance curves vs historicals.',
      icon: <LineChart className="w-4 h-4 text-amber-400" />
    }
  ];

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3.5">
        {/* Header title */}
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Widget Catalog</h4>
          <p className="text-[10px] font-mono text-zinc-500">Inject interactive assets onto your grid</p>
        </div>

        {/* Search Input bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-zinc-500">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search catalog widgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-md focus:outline-none focus:border-purple-500/50 text-[11px] text-white"
          />
        </div>

        {/* Category filtering tags */}
        <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'metric', label: 'Metrics' },
            { id: 'chart', label: 'Charts' },
            { id: 'data', label: 'Tables' },
            { id: 'ai', label: 'AI Suite' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500/25 text-purple-200 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog lists scroll block */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[300px] space-y-2 pr-1">
        {filteredCatalog.map((item) => (
          <div
            key={item.type}
            onClick={() => onAddWidget(item.type, item.title)}
            className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-500/30 flex items-start justify-between cursor-pointer group transition-all"
          >
            <div className="flex items-start space-x-2.5">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all shrink-0">
                {item.icon}
              </div>
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-zinc-100 text-[11px]">{item.title}</span>
                <p className="text-[10px] text-zinc-500 leading-normal">{item.description}</p>
              </div>
            </div>

            {/* Quick add icon */}
            <button className="p-1 rounded bg-white/5 hover:bg-purple-500 text-zinc-400 hover:text-white shrink-0 group-hover:scale-105 transition-all">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filteredCatalog.length === 0 && (
          <div className="text-center py-6 text-zinc-500 italic">No matching components found.</div>
        )}
      </div>
    </div>
  );
};
export default WidgetLibrary;

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { DashboardWidget } from '../../types/dashboard';
import { MOCK_DATA } from '../../services/dashboard.service';

interface ChartWidgetProps {
  widget: DashboardWidget;
  liveTimeseriesData?: any[];
  liveScatterData?: any[];
  liveHeatmapData?: any[];
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  widget,
  liveTimeseriesData = MOCK_DATA.timeseries,
  liveScatterData = MOCK_DATA.scatterplot,
  liveHeatmapData = MOCK_DATA.heatmap
}) => {
  const chartType = widget.type;

  // Render different chart structures depending on type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={liveTimeseriesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#c084fc" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3 }} name="Revenue ($)" />
              <Line type="monotone" dataKey="cost" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" name="Operational Cost" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA.segments} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Market Weight (%)">
                {MOCK_DATA.segments.map((_, index) => {
                  const colors = ['#c084fc', '#60a5fa', '#34d399', '#f472b6'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveTimeseriesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#c084fc" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Net Volume" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_DATA.segments}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {MOCK_DATA.segments.map((_, index) => {
                  const colors = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Pie>
              <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis type="number" dataKey="spend" name="Ad Spend" unit="$" stroke="#71717a" fontSize={11} />
              <YAxis type="number" dataKey="clicks" name="Ad Clicks" stroke="#71717a" fontSize={11} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Scatter name="Bid Campaigns" data={liveScatterData} fill="#f43f5e">
                {liveScatterData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#34d399' : '#f43f5e'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'bubble':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis type="number" dataKey="spend" name="Marketing Spend" unit="$" stroke="#71717a" fontSize={11} />
              <YAxis type="number" dataKey="clicks" name="Traffic Reach" stroke="#71717a" fontSize={11} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Scatter name="Growth Loops" data={liveScatterData} fill="#38bdf8">
                {liveScatterData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#38bdf8" radius={index * 3} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MOCK_DATA.radar}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="subject" stroke="#71717a" fontSize={10} />
              <PolarRadiusAxis stroke="#27272a" angle={30} domain={[0, 100]} fontSize={10} />
              <Radar name="Scikit Model-A" dataKey="A" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.3} />
              <Radar name="Optimized-B" dataKey="B" stroke="#34d399" fill="#34d399" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={MOCK_DATA.treemap}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#09090b"
              fill="#c084fc"
            >
              <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
            </Treemap>
          </ResponsiveContainer>
        );

      case 'heatmap':
        // Custom interactive high-fidelity CSS Grid Heatmap representing Day/Hour system load
        return (
          <div className="flex flex-col h-full justify-between p-1 font-mono text-[10px]">
            <div className="grid grid-cols-4 gap-1.5 h-full">
              {liveHeatmapData.map((cell, idx) => {
                const intensity = cell.load;
                let bgClass = 'bg-zinc-900';
                if (intensity > 85) bgClass = 'bg-purple-900 border border-purple-500/50 text-purple-200';
                else if (intensity > 65) bgClass = 'bg-indigo-900/80 text-indigo-200';
                else if (intensity > 40) bgClass = 'bg-zinc-800 text-zinc-300';

                return (
                  <div
                    key={`hm-${idx}`}
                    className={`p-2 rounded flex flex-col justify-between transition-all hover:scale-105 duration-200 ${bgClass}`}
                  >
                    <span className="text-zinc-500 font-bold">{cell.day} {cell.hour}</span>
                    <span className="text-right text-xs font-semibold">{intensity}% Load</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'gauge':
        // Dial Gauge using RadialBarChart
        const gaugeData = [{ name: 'System Usage', value: 78, fill: '#c084fc' }];
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="60%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={14}
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar background dataKey="value" cornerRadius={6} />
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" className="text-xl font-bold">
                78%
              </text>
              <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" fill="#71717a" className="text-[10px] uppercase font-mono">
                Model Threshold
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case 'forecast':
        // Merging timeseries historical elements with forecast dotted curves
        const joined = [
          ...MOCK_DATA.timeseries.map(d => ({ date: d.month, revenue: d.revenue, projected: d.revenue })),
          ...MOCK_DATA.forecast.map(f => ({ date: f.date, revenue: null, projected: f.projected }))
        ];
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={joined} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#c084fc" strokeWidth={2.5} dot={{ r: 3 }} name="Actuals" />
              <Line type="monotone" dataKey="projected" stroke="#34d399" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="AI Q4 Projection" />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-zinc-500 text-xs italic">Unsupported Visual Metric</div>;
    }
  };

  return <div className="w-full h-full p-2">{renderChart()}</div>;
};
export default ChartWidget;

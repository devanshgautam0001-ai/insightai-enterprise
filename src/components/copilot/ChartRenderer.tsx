import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: any[];
  keys: string[];
  xKey: string;
}

const COLORS = ['#c084fc', '#60a5fa', '#34d399', '#f472b6', '#fb7185', '#fbbf24'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, keys, xKey }) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
            <XAxis dataKey={xKey} stroke="#71717a" fontSize={10} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            {keys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
            <XAxis dataKey={xKey} stroke="#71717a" fontSize={10} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {keys.map((key, index) => (
                <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
            <XAxis dataKey={xKey} stroke="#71717a" fontSize={10} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            {keys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fillOpacity={1}
                fill={`url(#grad-${key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey={keys[0] || 'value'}
              nameKey={xKey}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[240px] bg-white/[0.01] border border-white/5 rounded-2xl p-4 mt-3 overflow-hidden relative">
      <div className="absolute top-2.5 left-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        Auto-Generated Analysis Chart
      </div>
      <ResponsiveContainer width="100%" height="90%" className="mt-4">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
export default ChartRenderer;

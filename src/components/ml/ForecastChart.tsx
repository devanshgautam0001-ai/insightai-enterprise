import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ForecastPoint } from '../../types/model';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';

interface ForecastChartProps {
  data: ForecastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'forecast' | 'components'>('forecast');

  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Confidence-Bounded Projections</h3>
          <p className="text-[10px] font-mono text-zinc-500 uppercase">30-60-90 Days Forecast Interval Analysis</p>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setViewMode('forecast')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'forecast'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Interval Forecast
          </button>
          <button
            onClick={() => setViewMode('components')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'components'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Trend & Seasonality
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {viewMode === 'forecast' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="boundFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="bg-zinc-950/95 border border-white/10 rounded-xl p-3.5 font-mono text-xs text-white shadow-xl backdrop-blur-md">
                        <p className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="w-4 h-4" />
                          Projection: {row.date}
                        </p>
                        <p>Forecast: <strong className="text-zinc-200">${row.forecast.toLocaleString()}</strong></p>
                        <p className="text-blue-400">95% CI Upper: <strong>${row.upperBound.toLocaleString()}</strong></p>
                        <p className="text-purple-400">95% CI Lower: <strong>${row.lowerBound.toLocaleString()}</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontFamily: 'monospace', fontSize: 10, color: '#a1a1aa' }}
              />
              {/* UpperBound & LowerBound represent Confidence Interval (Area) */}
              <Area
                name="95% Confidence Band"
                type="monotone"
                dataKey="upperBound"
                stroke="#3b82f6"
                strokeWidth={1}
                strokeDasharray="3 3"
                fill="url(#boundFill)"
                strokeOpacity={0.3}
              />
              {/* LowerBound line only to enclose the area */}
              <Area
                name="Lower Confidence Limit"
                type="monotone"
                dataKey="lowerBound"
                stroke="#3b82f6"
                strokeWidth={1}
                strokeDasharray="3 3"
                fill="none"
                strokeOpacity={0.3}
              />
              {/* Primary Forecast line */}
              <Area
                name="Optimized Forecast (Inference)"
                type="monotone"
                dataKey="forecast"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#forecastFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="seasonFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="bg-zinc-950/95 border border-white/10 rounded-xl p-3.5 font-mono text-xs text-white shadow-xl backdrop-blur-md">
                        <p className="font-semibold text-blue-400 flex items-center gap-1.5 mb-1.5">
                          <TrendingUp className="w-4 h-4" />
                          Sub-components: {row.date}
                        </p>
                        <p className="text-blue-400">Structural Trend: <strong>${row.trend.toLocaleString()}</strong></p>
                        <p className="text-purple-400">Seasonality Factor: <strong>${row.seasonality.toLocaleString()}</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontFamily: 'monospace', fontSize: 10, color: '#a1a1aa' }}
              />
              <Area
                name="Decomposed Growth Trend"
                type="monotone"
                dataKey="trend"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#trendFill)"
              />
              <Area
                name="Additive Seasonality"
                type="monotone"
                dataKey="seasonality"
                stroke="#a855f7"
                strokeWidth={1.5}
                fill="url(#seasonFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
export default ForecastChart;

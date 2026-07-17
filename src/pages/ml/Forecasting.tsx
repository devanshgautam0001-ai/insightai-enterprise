import React, { useState, useEffect } from 'react';
import mlService from '../../services/ml.service';
import { ForecastPoint } from '../../types/model';
import { ForecastChart } from '../../components/ml/ForecastChart';
import { MetricCard } from '../../components/ml/MetricCard';
import { Card } from '../../components/ui/Card';
import { TrendingUp, Sliders, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const Forecasting: React.FC = () => {
  
  const [days, setDays] = useState<30 | 60 | 90>(30);
  const [trendStrength, setTrendStrength] = useState<number>(0.5);
  const [seasonalityStrength, setSeasonalityStrength] = useState<number>(0.3);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);

  // Regenerate forecast data when parameters change
  useEffect(() => {
    const data = mlService.generateForecast(days, trendStrength, seasonalityStrength);
    setForecastData(data);
  }, [days, trendStrength, seasonalityStrength]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Time-Series Forecasting Station</h2>
        <p className="text-sm text-zinc-400">
          Decompose cyclical seasonality, calculate long-term trend lines, and map 95% confidence bounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Param Adjuster */}
        <div className="space-y-6">
          <Card className="border border-white/5 bg-zinc-950/40 p-5 space-y-5">
            <div className="flex items-center gap-2.5 mb-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Decomposition parameters</h3>
            </div>

            {/* Days Interval selection */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Forecast Horizon Interval
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([30, 60, 90] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`py-2 px-3 rounded-lg border font-mono text-xs font-semibold text-center transition-all ${
                      days === d
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-white/[0.01] text-zinc-400 border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Trend Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Long-Term Trend Factor</span>
                <span className="text-white font-bold">{Math.round(trendStrength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={trendStrength}
                onChange={(e) => setTrendStrength(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Seasonality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Cyclical Seasonality Factor</span>
                <span className="text-white font-bold">{Math.round(seasonalityStrength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={seasonalityStrength}
                onChange={(e) => setSeasonalityStrength(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </Card>

          {/* Forecast Metric Cards */}
          <MetricCard
            title="Cyclical Frequency"
            value="Additive Sine-Wave"
            subtext="Optimized on 7-day cyclical periods"
            icon={TrendingUp}
            color="emerald"
          />
        </div>

        {/* Primary Forecast Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ForecastChart data={forecastData} />
        </div>
      </div>

      {/* Numerical tabular logs */}
      <Card className="border border-white/5 bg-zinc-950/25">
        <div className="flex items-center gap-3 mb-6 p-5 border-b border-white/5">
          <div className="p-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Projected Sequence Ledger</h4>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Confidence bounded values per interval date</p>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Index</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4 text-right font-semibold">Forecast projection</th>
                <th className="py-3 px-4 text-right">95% lower bound</th>
                <th className="py-3 px-4 text-right">95% upper bound</th>
                <th className="py-3 px-4 text-right">Seasonal Offset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {forecastData.map((row, idx) => (
                <tr key={row.date} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2.5 px-4 font-mono text-zinc-500">#{idx + 1}</td>
                  <td className="py-2.5 px-4 font-mono font-bold">{row.date}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-emerald-400">
                    ${row.forecast.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right text-purple-400">
                    ${row.lowerBound.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right text-blue-400">
                    ${row.upperBound.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-zinc-500">
                    {row.seasonality > 0 ? `+$${row.seasonality.toLocaleString()}` : `-$${Math.abs(row.seasonality).toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};
export default Forecasting;

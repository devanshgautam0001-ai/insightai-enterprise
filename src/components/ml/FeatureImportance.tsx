import React from 'react';
import { Card } from '../ui/Card';
import { FeatureImportanceItem } from '../../types/model';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface FeatureImportanceProps {
  data: FeatureImportanceItem[];
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ data }) => {
  // Sort descending by importance
  const sortedData = [...data].sort((a, b) => b.importance - a.importance).slice(0, 8);

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1', '#a855f7'];

  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div>
        <h4 className="text-sm font-semibold text-white tracking-tight">Feature Importance Gini-Coefficients</h4>
        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-4">Relative predictive weight per factor</p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#71717a"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              domain={[0, 1]}
            />
            <YAxis
              dataKey="feature"
              type="category"
              stroke="#71717a"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white shadow-xl backdrop-blur-md">
                      <p className="font-semibold text-blue-400">{payload[0].payload.feature}</p>
                      <p className="mt-1">Relative Weight: {parseFloat((payload[0].value as number * 100).toFixed(2))}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default FeatureImportance;

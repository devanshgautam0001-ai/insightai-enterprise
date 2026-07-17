import React from 'react';
import { Card } from '../ui/Card';
import { RocCurvePoint } from '../../types/model';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface RocCurveProps {
  data: RocCurvePoint[];
  aucValue?: number;
}

export const RocCurve: React.FC<RocCurveProps> = ({ data, aucValue }) => {
  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-semibold text-white tracking-tight">Receiver Operating Characteristic (ROC)</h4>
          <p className="text-[10px] font-mono text-zinc-500 uppercase">True Positive Rate vs False Positive Rate</p>
        </div>
        {aucValue !== undefined && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">AUC Metric</span>
            <span className="text-base font-bold font-mono text-purple-400">{aucValue.toFixed(3)}</span>
          </div>
        )}
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} />
            <XAxis
              dataKey="fpr"
              stroke="#71717a"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              domain={[0, 1]}
              type="number"
            />
            <YAxis
              dataKey="tpr"
              stroke="#71717a"
              fontSize={10}
              fontFamily="monospace"
              tickLine={false}
              domain={[0, 1]}
              type="number"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white shadow-xl backdrop-blur-md">
                      <p className="font-semibold text-purple-400">ROC Coordinates</p>
                      <p className="mt-1">FPR (False Positive): {payload[0].value}</p>
                      <p>TPR (True Positive): {payload[1] ? payload[1].value : payload[0].payload.tpr}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Baseline random guess line */}
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 1, y: 1 },
              ]}
              stroke="#71717a"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="tpr"
              stroke="#a855f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#rocGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default RocCurve;

import React from 'react';
import { ColumnDefinition } from '../../types/dataset';
import { Card } from '../ui/Card';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart2, TrendingUp, Info } from 'lucide-react';

interface StatisticsCardProps {
  column: ColumnDefinition;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ column }) => {
  const { stats } = column;
  const isNumerical = stats.mean !== undefined;

  return (
    <Card className="p-6 space-y-6 bg-white/[0.01] border border-white/5">
      <div className="border-b border-white/5 pb-4">
        <h4 className="font-display font-bold text-base text-zinc-100 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          <span>Profile Statistics: {column.name}</span>
        </h4>
        <p className="text-xs text-zinc-500 mt-1">Detailed statistical parameters for selected column schema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core numbers */}
        <div className="space-y-4">
          <h5 className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Core Parameters
          </h5>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Null Records</span>
              <p className="text-sm font-bold text-white mt-1">{stats.nullCount.toLocaleString()}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">({stats.nullPercentage}%)</p>
            </div>
            
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Unique Values</span>
              <p className="text-sm font-bold text-white mt-1">{stats.uniqueCount.toLocaleString()}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">({stats.uniquePercentage}%)</p>
            </div>

            {isNumerical && (
              <>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Mean Avg</span>
                  <p className="text-sm font-bold text-blue-400 mt-1">{stats.mean?.toLocaleString()}</p>
                </div>
                
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Median (P50)</span>
                  <p className="text-sm font-bold text-white mt-1">{stats.median?.toLocaleString()}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Standard Dev</span>
                  <p className="text-sm font-bold text-white mt-1">{stats.stdDev?.toLocaleString()}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Range (Min/Max)</span>
                  <p className="text-xs font-bold text-white mt-1 font-mono truncate">
                    {stats.min} to {stats.max}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic distributions or category frequencies */}
        <div className="space-y-4">
          <h5 className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Distribution Frequency
          </h5>

          {stats.frequentValues.length > 0 ? (
            <div className="h-44 w-full bg-black/10 rounded-xl p-4 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.frequentValues}>
                  <XAxis dataKey="value" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Value Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 rounded-xl bg-white/[0.01] border border-white/5 text-center p-6 text-zinc-500">
              <span className="text-xs font-mono">CONTINUOUS DISTRIBUTION</span>
              <p className="text-[11px] mt-1 text-zinc-600">This column contains highly continuous unique scalar parameters. Detailed density histogram has been mapped into EDA panel views.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

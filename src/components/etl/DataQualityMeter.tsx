import React from 'react';
import { Card } from '../ui/Card';
import { DataQualityReport } from '../../types/pipeline';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface DataQualityMeterProps {
  report: DataQualityReport | null;
}

export const DataQualityMeter: React.FC<DataQualityMeterProps> = ({ report }) => {
  if (!report) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Score */}
      <Card className="p-5 flex items-center justify-between bg-white/[0.01] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-500/30 to-transparent" />
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">Aggregate Quality</span>
          <p className="font-display font-extrabold text-2xl text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {report.score}%
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </Card>

      {/* Missing cells */}
      <Card className="p-5 flex items-center justify-between bg-white/[0.01] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500/30 to-transparent" />
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">Missing Values</span>
          <p className="font-display font-extrabold text-2xl text-white group-hover:text-amber-400 transition-colors">
            {report.missingValuesCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertCircle className="w-5 h-5" />
        </div>
      </Card>

      {/* Duplicates */}
      <Card className="p-5 flex items-center justify-between bg-white/[0.01] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-blue-500/30 to-transparent" />
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">Duplicate Rows</span>
          <p className="font-display font-extrabold text-2xl text-white group-hover:text-blue-400 transition-colors">
            {report.duplicateCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </Card>

      {/* Outliers */}
      <Card className="p-5 flex items-center justify-between bg-white/[0.01] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-rose-500/30 to-transparent" />
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">Anomaly Outliers</span>
          <p className="font-display font-extrabold text-2xl text-white group-hover:text-rose-400 transition-colors">
            {report.outliersCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="w-5 h-5" />
        </div>
      </Card>
    </div>
  );
};
export default DataQualityMeter;

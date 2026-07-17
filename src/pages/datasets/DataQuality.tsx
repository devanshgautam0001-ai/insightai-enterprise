import React from 'react';
import { useDataset } from '../../hooks/useDataset';
import { QualityCard } from '../../components/dataset/QualityCard';
import { ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const DataQuality: React.FC = () => {
  const { dataset } = useDataset();

  if (!dataset) {
    return (
      <div className="text-center py-12 text-zinc-400 font-mono text-xs">
        No dataset currently ingested. Please upload a structured file first.
      </div>
    );
  }

  const totalQualityScore = Math.floor(
    dataset.columns.reduce((acc, col) => acc + col.qualityScore, 0) / dataset.columns.length
  );

  return (
    <div className="space-y-6 animate-fade-in" id="data-quality-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>Automated Data Quality Audit</span>
        </h3>
        <p className="text-xs text-zinc-400">Continuous background validations running against schema parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {dataset.qualityMetrics.map((metric, idx) => (
            <QualityCard key={idx} metric={metric} />
          ))}
        </div>

        <div className="space-y-4">
          <Card className="p-6 text-center space-y-4 bg-white/[0.01] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Aggregated Score</span>
            <div className="font-display font-extrabold text-6xl text-emerald-400">
              {totalQualityScore}%
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Your overall quality score ranks high. Feedback comments have a minor null leakage flagged below.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

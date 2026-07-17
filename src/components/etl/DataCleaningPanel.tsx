import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShieldAlert, Trash2, Cpu, CheckCircle } from 'lucide-react';
import { DataQualityReport } from '../../types/pipeline';

interface DataCleaningPanelProps {
  report: DataQualityReport | null;
  onOneClickClean: () => void;
  isCleaning: boolean;
}

export const DataCleaningPanel: React.FC<DataCleaningPanelProps> = ({
  report,
  onOneClickClean,
  isCleaning,
}) => {
  if (!report) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6 space-y-6 bg-white/[0.01] border border-white/5 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent" />
        
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm text-zinc-200">Alteryx-Style Cleaning Pipeline</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Our background ETL framework profiles the dataset looking for missing null fields, redundant row entries, and extreme statistical outliers. Triggering a One-Click optimization automatically runs clean-ups across all matched parameters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-yellow-500">Detecting Nulls & Outliers</h5>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  We found {report.missingValuesCount} sparse null fields and {report.outliersCount} extreme numeric outliers.
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-blue-500">Duplicate Check</h5>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  We matched {report.duplicateCount} redundant rows. Purging will optimize RAM footprints.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center text-[10px] font-mono text-zinc-500 bg-white/[0.02] py-1 px-3 border border-white/5 rounded-full">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Automatic Imputation System</span>
          </div>
          
          <Button
            onClick={onOneClickClean}
            disabled={isCleaning}
            isLoading={isCleaning}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 border-none text-zinc-950 font-bold text-xs px-6 py-2.5"
          >
            <Trash2 className="w-4 h-4 mr-2" /> One-Click Optimize Cache
          </Button>
        </div>
      </Card>

      {/* Aggregate Score Panel */}
      <Card className="p-6 text-center space-y-4 bg-white/[0.01] border border-white/5 relative overflow-hidden flex flex-col justify-center">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Aggregate Ingress Score</span>
        <div className="font-display font-extrabold text-6xl text-emerald-400">
          {report.score}%
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
          This scores data quality before loading to production analytical systems or feature stores.
        </p>
      </Card>
    </div>
  );
};
export default DataCleaningPanel;

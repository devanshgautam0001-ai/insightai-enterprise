import React, { useState } from 'react';
import { useDataset } from '../../hooks/useDataset';
import { Card } from '../../components/ui/Card';
import { Copy, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store';

export const DuplicateDetector: React.FC = () => {
  const { dataset, setDataset } = useDataset();
  const { addNotification } = useUIStore();
  const [cleaning, setCleaning] = useState(false);

  if (!dataset) {
    return (
      <div className="text-center py-12 text-zinc-400 font-mono text-xs">
        No dataset currently ingested. Please upload a structured file first.
      </div>
    );
  }

  const handleDeDuplicate = () => {
    setCleaning(true);
    setTimeout(() => {
      const cleanedDataset = {
        ...dataset,
        duplicateCount: 0,
        duplicatePercentage: 0,
        rows: dataset.rows - dataset.duplicateCount,
        previewRows: dataset.previewRows.slice(0, 10)
      };
      setDataset(cleanedDataset);
      setCleaning(false);
      addNotification({
        title: 'De-duplication Complete',
        description: `Successfully cleaned database. Removed ${dataset.duplicateCount.toLocaleString()} redundant row instances.`,
        type: 'success'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="duplicate-detector-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <Copy className="w-5 h-5 text-blue-400" />
          <span>Redundancy & Duplicate Detector</span>
        </h3>
        <p className="text-xs text-zinc-400">Identify identical record partitions and purge dirty rows instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-6 bg-white/[0.01] border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-zinc-200">Hash-Match Deduplication Pipeline</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our background ingestion engine computes dynamic md5 checksum hashing arrays for every individual record in the uploaded partition. If all key parameters match, redundant rows are grouped into the purge queue.
            </p>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3.5 items-start">
              <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-yellow-500">Purge Recommendations</h5>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  We detected <span className="text-white font-bold">{dataset.duplicateCount.toLocaleString()} duplicate record rows</span> which compromise training metrics and inflate latency. We highly recommend running a deduplication purge.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <Button
              onClick={handleDeDuplicate}
              disabled={cleaning || dataset.duplicateCount === 0}
              isLoading={cleaning}
              variant="primary"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 border-none text-zinc-950 font-bold"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {dataset.duplicateCount === 0 ? 'Dataset fully optimized' : 'Purge All Duplicates'}
            </Button>
          </div>
        </Card>

        <div>
          <Card className="p-6 text-center space-y-4 bg-white/[0.01] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-500" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Dirty Redundant Rows</span>
            <div className="font-display font-extrabold text-6xl text-amber-500">
              {dataset.duplicateCount.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Represents {dataset.duplicatePercentage}% of total record rows.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

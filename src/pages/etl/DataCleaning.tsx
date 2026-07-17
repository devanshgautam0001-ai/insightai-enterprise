import React from 'react';
import { useCleaning } from '../../hooks/useCleaning';
import { DataQualityMeter } from '../../components/etl/DataQualityMeter';
import { DataCleaningPanel } from '../../components/etl/DataCleaningPanel';
import { TransformationCard } from '../../components/etl/TransformationCard';
import { TransformationHistory } from '../../components/etl/TransformationHistory';
import { PreviewTable } from '../../components/etl/PreviewTable';
import { Card } from '../../components/ui/Card';

export const DataCleaning: React.FC = () => {
  const {
    data,
    columns,
    report,
    history,
    isCleaning,
    applyTransformation,
    runOneClickClean,
  } = useCleaning();

  return (
    <div className="space-y-6 animate-fade-in" id="data-cleaning-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white">Interactive Transformation Studio</h3>
        <p className="text-xs text-zinc-400">Run automatic Alteryx optimizations, check statistical missing profiles, and write transformation math.</p>
      </div>

      {/* Aggregate quality indices */}
      <DataQualityMeter report={report} />

      {/* Quick automatic clean control panel */}
      <DataCleaningPanel
        report={report}
        onOneClickClean={runOneClickClean}
        isCleaning={isCleaning}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Dynamic selector & active rows preview */}
        <div className="xl:col-span-2 space-y-6">
          <TransformationCard
            columns={columns}
            onApply={applyTransformation}
            isCleaning={isCleaning}
          />

          <Card className="p-6 bg-white/[0.01] border border-white/5">
            <PreviewTable data={data} columns={columns} />
          </Card>
        </div>

        {/* Applied rules timeline */}
        <div className="h-full">
          <TransformationHistory history={history} />
        </div>
      </div>
    </div>
  );
};
export default DataCleaning;

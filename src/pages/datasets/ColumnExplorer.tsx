import React, { useState, useEffect } from 'react';
import { useDataset } from '../../hooks/useDataset';
import { ColumnCard } from '../../components/dataset/ColumnCard';
import { StatisticsCard } from '../../components/dataset/StatisticsCard';
import { ColumnDefinition } from '../../types/dataset';
import { Layers } from 'lucide-react';

export const ColumnExplorer: React.FC = () => {
  const { dataset } = useDataset();
  const [selectedColumn, setSelectedColumn] = useState<ColumnDefinition | null>(null);

  useEffect(() => {
    if (dataset && dataset.columns && dataset.columns.length > 0) {
      setSelectedColumn(dataset.columns[1] || dataset.columns[0]);
    }
  }, [dataset]);

  if (!dataset) {
    return (
      <div className="text-center py-12 text-zinc-400 font-mono text-xs">
        No dataset currently ingested. Please upload a structured file first.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="column-explorer-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>Column Metadata Profiler</span>
        </h3>
        <p className="text-xs text-zinc-400">Click individual parameters to run statistical audit profiles and graph null values.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
          {dataset.columns.map((col) => (
            <ColumnCard
              key={col.name}
              column={col}
              isSelected={selectedColumn?.name === col.name}
              onSelect={setSelectedColumn}
            />
          ))}
        </div>

        <div className="h-full">
          {selectedColumn && <StatisticsCard column={selectedColumn} />}
        </div>
      </div>
    </div>
  );
};

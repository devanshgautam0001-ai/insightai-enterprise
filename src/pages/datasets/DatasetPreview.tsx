import React from 'react';
import { DataPreviewTable } from '../../components/dataset/DataPreviewTable';
import { useDataset } from '../../hooks/useDataset';
import { Card } from '../../components/ui/Card';
import { Table } from 'lucide-react';

export const DatasetPreview: React.FC = () => {
  const { dataset } = useDataset();

  if (!dataset) {
    return (
      <div className="text-center py-12 text-zinc-400 font-mono text-xs">
        No dataset currently ingested. Please upload a structured file first.
      </div>
    );
  }

  const columns = dataset.columns || [];
  const columnNames = columns.map((col) => col.name);

  return (
    <div className="space-y-6 animate-fade-in" id="dataset-preview-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <Table className="w-5 h-5 text-blue-400" />
          <span>Interactive Partition Records</span>
        </h3>
        <p className="text-xs text-zinc-400">Search, filter, and sort clean sample records fetched from server cache queues.</p>
      </div>

      <Card className="p-6 bg-white/[0.01] border border-white/5">
        <DataPreviewTable rows={dataset.previewRows || []} columns={columnNames} />
      </Card>
    </div>
  );
};

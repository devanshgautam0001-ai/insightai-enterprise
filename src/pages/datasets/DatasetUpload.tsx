import React from 'react';
import { UploadZone } from '../../components/dataset/UploadZone';
import { FileCard } from '../../components/dataset/FileCard';
import { useDataset } from '../../hooks/useDataset';

export const DatasetUpload: React.FC = () => {
  const { dataset } = useDataset();

  return (
    <div className="space-y-6 animate-fade-in" id="dataset-upload-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white">Ingest Grounded Data</h3>
        <p className="text-xs text-zinc-400">Stream file partitions, parse schema blueprints, and inspect general database parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <UploadZone />
        </div>
        <div>
          <FileCard dataset={dataset} />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Upload, Table, Layers, ShieldCheck, FileCode, BarChart3, Copy, AlertTriangle } from 'lucide-react';
import { DatasetUpload } from './DatasetUpload';
import { DatasetPreview } from './DatasetPreview';
import { ColumnExplorer } from './ColumnExplorer';
import { DataQuality } from './DataQuality';
import { SchemaViewer } from './SchemaViewer';
import { Statistics } from './Statistics';
import { DuplicateDetector } from './DuplicateDetector';
import { MissingValueViewer } from './MissingValueViewer';
import { useUIStore } from '../../store';

export const Datasets: React.FC = () => {
  const { datasetsTab } = useUIStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'columns' | 'quality' | 'schema' | 'stats' | 'duplicates' | 'missing'>('upload');

  React.useEffect(() => {
    if (datasetsTab) {
      setActiveTab(datasetsTab as any);
    }
  }, [datasetsTab]);

  const tabs = [
    { id: 'upload', name: 'Ingestion', icon: <Upload className="w-4 h-4" /> },
    { id: 'preview', name: 'Records Preview', icon: <Table className="w-4 h-4" /> },
    { id: 'columns', name: 'Column Profiler', icon: <Layers className="w-4 h-4" /> },
    { id: 'quality', name: 'Quality Audit', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'schema', name: 'Schema Blueprint', icon: <FileCode className="w-4 h-4" /> },
    { id: 'stats', name: 'Parameters Stats', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'duplicates', name: 'Deduplication', icon: <Copy className="w-4 h-4" /> },
    { id: 'missing', name: 'Imputation', icon: <AlertTriangle className="w-4 h-4" /> }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <DatasetUpload />;
      case 'preview':
        return <DatasetPreview />;
      case 'columns':
        return <ColumnExplorer />;
      case 'quality':
        return <DataQuality />;
      case 'schema':
        return <SchemaViewer />;
      case 'stats':
        return <Statistics />;
      case 'duplicates':
        return <DuplicateDetector />;
      case 'missing':
        return <MissingValueViewer />;
      default:
        return <DatasetUpload />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="datasets-main-container">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Grounded Data Engine</h2>
        <p className="text-zinc-400 text-sm">Upload, parse, profile, and audit dataset records for feature store analysis.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 flex gap-2 overflow-x-auto pb-px scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {renderContent()}
      </div>
    </div>
  );
};

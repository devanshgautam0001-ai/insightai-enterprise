import React from 'react';
import { SchemaTree } from '../../components/dataset/SchemaTree';
import { useDataset } from '../../hooks/useDataset';
import { Card } from '../../components/ui/Card';
import { FileCode } from 'lucide-react';

export const SchemaViewer: React.FC = () => {
  const { dataset } = useDataset();

  if (!dataset) {
    return (
      <div className="text-center py-12 text-zinc-400 font-mono text-xs">
        No dataset currently ingested. Please upload a structured file first.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="schema-viewer-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-400" />
          <span>Physical Schema Blueprint</span>
        </h3>
        <p className="text-xs text-zinc-400">Exportable table and database layout schemas compiled from uploaded headers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SchemaTree columns={dataset.columns} />
        </div>

        <div className="space-y-4">
          <Card className="p-6 space-y-4 bg-white/[0.01] border border-white/5">
            <h4 className="font-display font-bold text-sm text-zinc-200">Ingested Dialect</h4>
            <div className="space-y-3 font-mono text-[11px] text-zinc-400">
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                <span>Dialect format</span>
                <span className="text-white uppercase">{dataset.fileType}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                <span>Compression</span>
                <span className="text-white">Snappy (Apache)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                <span>Index status</span>
                <span className="text-emerald-400 font-bold uppercase">Optimized</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

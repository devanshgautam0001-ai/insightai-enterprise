import React from 'react';
import { Database, Calendar, Tag, ShieldAlert, Cpu } from 'lucide-react';
import { DataEngineDataset } from '../../types/dataset';
import { Card } from '../ui/Card';

interface FileCardProps {
  dataset: DataEngineDataset | null;
}

export const FileCard: React.FC<FileCardProps> = ({ dataset }) => {
  if (!dataset) {
    return (
      <Card className="p-6 space-y-4 bg-white/[0.01] border border-white/5 border-dashed flex flex-col items-center justify-center min-h-[220px] text-zinc-500 text-center">
        <Database className="w-8 h-8 text-zinc-600 mb-2 animate-pulse" />
        <p className="font-display font-bold text-sm text-zinc-400">No Dataset Ingested</p>
        <p className="text-xs text-zinc-500 max-w-[200px]">Drop a CSV, XLSX, JSON or Parquet file to view structural indices.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 bg-white/[0.02] border border-white/5 shadow-xl backdrop-blur-md relative overflow-hidden group">
      {/* Visual top bar glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent" />

      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-white group-hover:text-blue-400 transition-colors">
              {dataset.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 uppercase font-mono flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 border border-white/5">{dataset.fileType}</span>
              <span>•</span>
              <span>{dataset.size}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Total Rows</span>
          <p className="font-display font-extrabold text-lg text-white">{dataset.rows.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Parameters</span>
          <p className="font-display font-extrabold text-lg text-white">{dataset.cols} columns</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">RAM Footprint</span>
          <p className="font-display font-extrabold text-lg text-emerald-400 flex items-center gap-1">
            <Cpu className="w-4 h-4 text-emerald-500" />
            {dataset.memoryUsage}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Duplicates Rate</span>
          <p className="font-display font-extrabold text-lg text-amber-400 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            {dataset.duplicatePercentage}%
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-zinc-500 font-mono">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-zinc-600" />
          <span>Ingested: {dataset.uploadedAt}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-zinc-600" />
          <span>UUID: {dataset.id}</span>
        </div>
      </div>
    </Card>
  );
};

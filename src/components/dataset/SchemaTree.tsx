import React from 'react';
import { ColumnDefinition } from '../../types/dataset';
import { Card } from '../ui/Card';
import { Network, FolderOpen, Tag, Settings, Eye } from 'lucide-react';

interface SchemaTreeProps {
  columns: ColumnDefinition[];
}

export const SchemaTree: React.FC<SchemaTreeProps> = ({ columns }) => {
  return (
    <Card className="p-6 space-y-6 bg-white/[0.01] border border-white/5">
      <div className="border-b border-white/5 pb-4">
        <h4 className="font-display font-bold text-base text-zinc-100 flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          <span>Interactive Schema Tree</span>
        </h4>
        <p className="text-xs text-zinc-500 mt-1">Hierarchical tree representation of the structured metadata definition.</p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-blue-400">
          <FolderOpen className="w-4 h-4 shrink-0" />
          <span className="font-bold">root_dataset</span>
        </div>

        <div className="pl-6 border-l border-white/10 space-y-3 relative">
          {columns.map((col) => {
            return (
              <div key={col.name} className="relative pl-4 space-y-1.5">
                {/* Horizontal branch line */}
                <div className="absolute top-2 left-0 w-3 h-[1px] bg-white/10" />
                
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-zinc-200 font-bold">{col.name}</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">[{col.type}]</span>
                  {col.isPrimaryKey && (
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1 py-0.2 rounded font-bold uppercase">PK</span>
                  )}
                </div>

                {/* Nested attributes */}
                <div className="pl-5 border-l border-white/5 space-y-1 text-[10px] text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    <span>nullable: <span className="text-zinc-400">{String(col.isNullable)}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>samples: <span className="text-zinc-400">[{col.sampleValues.filter(v => v !== null).slice(0, 3).join(', ')}]</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

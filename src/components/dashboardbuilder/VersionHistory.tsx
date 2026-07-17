import React from 'react';
import { History, RotateCcw, Clock } from 'lucide-react';
import { DashboardVersion } from '../../types/dashboard';

interface VersionHistoryProps {
  versions: DashboardVersion[];
  onRestore: (ver: DashboardVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, onRestore }) => {
  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs space-y-4">
      {/* Header title */}
      <div className="flex items-center space-x-2 pb-3.5 border-b border-white/5">
        <History className="w-4 h-4 text-purple-400" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Version Releases</h4>
          <p className="text-[10px] font-mono text-zinc-500">Restore or audit frozen layouts</p>
        </div>
      </div>

      {/* Snapshots list */}
      <div className="space-y-2.5 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
        {versions.length === 0 ? (
          <div className="text-center py-4 text-zinc-500 italic">No frozen snapshots found.</div>
        ) : (
          versions.map((ver) => (
            <div
              key={ver.id}
              className="p-3 rounded-lg border border-white/5 hover:border-purple-500/20 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between transition-all group"
            >
              <div className="space-y-1 truncate pr-3">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-white font-mono bg-purple-500/10 text-purple-400 px-1 rounded text-[9px]">
                    v{ver.versionNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-200 truncate">{ver.label}</span>
                </div>
                <div className="flex items-center space-x-2 text-[9px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  <span>{ver.createdAt} • {ver.author.split('@')[0]}</span>
                </div>
              </div>

              {/* Restore action */}
              <button
                onClick={() => onRestore(ver)}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-white transition-all text-[9px] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default VersionHistory;

import React, { useState } from 'react';
import { Terminal, Copy, Check, Play } from 'lucide-react';

interface PythonPreviewProps {
  python: string;
}

export const PythonPreview: React.FC<PythonPreviewProps> = ({ python }) => {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(python);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/5 bg-zinc-950/70 rounded-2xl overflow-hidden mt-3 font-mono text-xs">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white/[0.02] px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2 text-blue-400">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] tracking-wider uppercase">Auto-Generated Pandas Script</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] text-zinc-400 hover:text-white transition-all text-[11px]"
            title="Copy python snippet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/15 hover:bg-blue-600/30 transition-all text-[11px]"
          >
            <Play className="w-3 h-3" />
            <span>{running ? 'Stop Script' : 'Execute Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 bg-zinc-950 text-zinc-300 overflow-x-auto">
        <pre className="whitespace-pre">{python}</pre>
      </div>

      {/* Terminal execution simulator */}
      {running && (
        <div className="border-t border-white/5 bg-black p-4 space-y-1.5 text-xs text-emerald-500 font-mono">
          <div>$ python -u pandas_sandbox_run.py</div>
          <div className="text-zinc-500">[INFO] Mapping active structures for transaction_ledger.csv...</div>
          <div className="text-zinc-400">[DATA] Null check segment values: 0 items detected.</div>
          <div className="text-zinc-400">[DATA] Huber Outlier thresholds: lower=1,200.0, upper=48,000.0</div>
          <div className="font-bold text-white">Cleaned dataset: 105 records remaining.</div>
          <div className="text-zinc-500">[SUCCESS] Exported memory weights successfully.</div>
        </div>
      )}
    </div>
  );
};
export default PythonPreview;

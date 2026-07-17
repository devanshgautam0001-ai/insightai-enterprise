import React, { useState } from 'react';
import { Database, Copy, Check, Play, TableProperties } from 'lucide-react';

interface SQLPreviewProps {
  sql: string;
}

export const SQLPreview: React.FC<SQLPreviewProps> = ({ sql }) => {
  const [copied, setCopied] = useState(false);
  const [executed, setExecuted] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/5 bg-zinc-950/70 rounded-2xl overflow-hidden mt-3 font-mono text-xs">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white/[0.02] px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2 text-purple-400">
          <Database className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] tracking-wider uppercase">Auto-Generated SQL Query</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] text-zinc-400 hover:text-white transition-all text-[11px]"
            title="Copy SQL string"
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
            onClick={() => setExecuted((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-600/20 text-purple-400 border border-purple-500/15 hover:bg-purple-600/30 transition-all text-[11px]"
          >
            <Play className="w-3 h-3" />
            <span>{executed ? 'Hide Output' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* SQL Code Block */}
      <div className="p-4 bg-zinc-950 text-zinc-300 overflow-x-auto">
        <pre className="whitespace-pre">{sql}</pre>
      </div>

      {/* Query Results simulator if toggled */}
      {executed && (
        <div className="border-t border-white/5 bg-zinc-950 p-4 space-y-3 font-sans">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <TableProperties className="w-3.5 h-3.5" />
            <span>Simulated Ledger Records Output</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-400 font-mono text-[10px] uppercase">
                  <th className="py-2 px-3">segment</th>
                  <th className="py-2 px-3 text-right">transaction_count</th>
                  <th className="py-2 px-3 text-right">total_revenue</th>
                  <th className="py-2 px-3 text-right">avg_margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300 font-mono text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-sans">Enterprise</td>
                  <td className="py-2 px-3 text-right">15</td>
                  <td className="py-2 px-3 text-right text-emerald-400">$63,400</td>
                  <td className="py-2 px-3 text-right text-purple-400">18.0%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Mid-Market</td>
                  <td className="py-2 px-3 text-right">32</td>
                  <td className="py-2 px-3 text-right text-emerald-400">$32,500</td>
                  <td className="py-2 px-3 text-right text-purple-400">15.0%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">SMB</td>
                  <td className="py-2 px-3 text-right">54</td>
                  <td className="py-2 px-3 text-right text-emerald-400">$14,400</td>
                  <td className="py-2 px-3 text-right text-purple-400">8.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default SQLPreview;

import React from 'react';
import { PredictionResult } from '../../types/model';
import { Card } from '../ui/Card';
import { Database, Download } from 'lucide-react';

interface PredictionTableProps {
  predictions: PredictionResult[];
  title?: string;
  subtitle?: string;
}

export const PredictionTable: React.FC<PredictionTableProps> = ({
  predictions,
  title = 'Prediction Run Ledger',
  subtitle = 'HISTORICAL MODEL INFERENCE ARCHIVE',
}) => {
  const handleExportCSV = () => {
    if (predictions.length === 0) return;

    // Get all feature names
    const featureKeys = Array.from(
      new Set(predictions.flatMap((p) => Object.keys(p.input)))
    );

    const headers = ['Prediction ID', 'Timestamp', ...featureKeys, 'Predicted Outcome', 'Confidence'];
    const rows = predictions.map((p) => {
      const featureVals = featureKeys.map((k) => p.input[k] ?? '');
      return [
        p.id,
        p.timestamp,
        ...featureVals,
        p.prediction,
        p.confidence !== undefined ? `${(p.confidence * 100).toFixed(1)}%` : 'N/A',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prediction_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">{subtitle}</p>
          </div>
        </div>

        {predictions.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-mono transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Export Ledger (.CSV)
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-zinc-950/20 scrollbar-thin scrollbar-thumb-zinc-800">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Inference ID</th>
              <th className="py-3.5 px-4 font-semibold">Timestamp</th>
              <th className="py-3.5 px-4 font-semibold">Input Features Subset</th>
              <th className="py-3.5 px-4 font-semibold text-right">Predicted Value / Class</th>
              <th className="py-3.5 px-4 font-semibold text-right">Confidence Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {predictions.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-3 px-4 font-mono text-zinc-500">{p.id}</td>
                <td className="py-3 px-4 font-mono text-zinc-500">{p.timestamp}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                    {Object.entries(p.input).map(([key, val]) => (
                      <span
                        key={key}
                        className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[10px] font-mono text-zinc-400"
                      >
                        {key}: <strong className="text-zinc-200">{val}</strong>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-semibold text-white bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                    {p.prediction}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {p.confidence !== undefined ? (
                    <span
                      className={`font-semibold ${
                        p.confidence > 0.8
                          ? 'text-emerald-400'
                          : p.confidence > 0.6
                          ? 'text-purple-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {(p.confidence * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic">Continuous R-Score</span>
                  )}
                </td>
              </tr>
            ))}
            {predictions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-zinc-500 font-mono italic">
                  No predictions recorded in session. Trigger single/batch prediction above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default PredictionTable;

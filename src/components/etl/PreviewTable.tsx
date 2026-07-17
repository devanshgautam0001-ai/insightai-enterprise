import React from 'react';
import { RowData } from '../../utils/dataCleaning';

interface PreviewTableProps {
  data: RowData[];
  columns: string[];
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ data, columns }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-xs text-zinc-400 uppercase tracking-wider">
          Active In-Memory Data Frame (Top 10 Rows)
        </h4>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">
          {data.length} Total Rows • {columns.length} Active Columns
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/25">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-3 text-[10px] font-mono font-bold text-zinc-500 tracking-wider uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.slice(0, 10).map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/[0.01] transition-colors">
                {columns.map((col) => {
                  const cellVal = row[col];
                  const isNull = cellVal === null || cellVal === undefined || cellVal === '';
                  return (
                    <td key={col} className="p-3 text-xs font-mono">
                      {isNull ? (
                        <span className="text-[10px] text-red-400/80 bg-red-500/5 px-1.5 py-0.5 rounded font-bold uppercase">
                          NULL
                        </span>
                      ) : typeof cellVal === 'boolean' ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cellVal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {cellVal ? 'TRUE' : 'FALSE'}
                        </span>
                      ) : typeof cellVal === 'number' ? (
                        <span className="text-blue-300 font-bold">{cellVal.toLocaleString()}</span>
                      ) : (
                        <span className="text-zinc-300 max-w-xs truncate block">{String(cellVal)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PreviewTable;

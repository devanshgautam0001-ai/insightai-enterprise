import React, { useState } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardWidget } from '../../types/dashboard';

interface TableWidgetProps {
  widget: DashboardWidget;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ widget }) => {
  const { properties } = widget;
  const columns = properties.tableColumns || ['segment', 'tier', 'revenue', 'margin', 'satisfaction'];
  const data = properties.tableData || [];

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Filters + sorting
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-3 font-sans text-xs">
      <div>
        {/* Table Search bar */}
        <div className="relative mb-3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-zinc-500">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search segment log entries..."
            className="w-full pl-8 pr-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-md focus:outline-none focus:border-purple-500/50 text-[11px] text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Scrollable grid container */}
        <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar border border-white/5 rounded-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => toggleSort(col)}
                    className="p-2 text-[10px] uppercase font-mono text-zinc-400 font-semibold cursor-pointer hover:bg-white/[0.03] select-none transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col}</span>
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-50" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col} className="p-2 text-zinc-300 font-medium">
                        {col === 'satisfaction' ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">
                            {row[col]}
                          </span>
                        ) : col === 'revenue' ? (
                          <span className="font-mono font-bold text-purple-300">{row[col]}</span>
                        ) : (
                          row[col]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-zinc-500 italic">
                    No matching rows found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Pagination row */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
        <span className="text-[10px] text-zinc-500 font-mono">
          Showing {sortedData.length} of {data.length} records
        </span>
        <div className="flex items-center space-x-1.5">
          <button className="p-1 hover:bg-white/5 rounded border border-white/5 text-zinc-400 hover:text-white disabled:opacity-30" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-white/5 rounded border border-white/5 text-zinc-400 hover:text-white disabled:opacity-30" disabled>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default TableWidget;

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Eye } from 'lucide-react';

interface DataPreviewTableProps {
  rows: Record<string, any>[];
  columns: string[];
}

export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({ rows, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Search filter
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sorting
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-zinc-400" />
          <h4 className="font-display font-semibold text-sm text-zinc-200">Interactive Row Preview</h4>
        </div>
        
        {/* Search inside preview */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search preview rows..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/10">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="p-3.5 text-[11px] font-mono font-semibold text-zinc-400 tracking-wider uppercase cursor-pointer hover:bg-white/[0.02] hover:text-white select-none transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    {col}
                    {sortColumn === col ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                      )
                    ) : (
                      <span className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.01] transition-colors">
                  {columns.map((col) => {
                    const cellVal = row[col];
                    const isNull = cellVal === null || cellVal === undefined;
                    return (
                      <td key={col} className="p-3.5 text-xs">
                        {isNull ? (
                          <span className="text-[10px] font-mono text-zinc-600 italic uppercase">NULL</span>
                        ) : typeof cellVal === 'boolean' ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            cellVal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {cellVal ? 'TRUE' : 'FALSE'}
                          </span>
                        ) : typeof cellVal === 'number' ? (
                          <span className="font-mono text-blue-300">{cellVal.toLocaleString()}</span>
                        ) : (
                          <span className="text-zinc-300 max-w-xs truncate block">{String(cellVal)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-zinc-500 text-xs font-mono">
                  No matching row results found in current partition query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Showing Page {currentPage} of {totalPages} ({filteredRows.length} filtered records)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-xs font-semibold text-zinc-400 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] text-xs font-semibold text-zinc-400 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

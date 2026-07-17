import React, { useState } from 'react';
import { useDataset } from '../../hooks/useDataset';
import { DatasetTable } from '../../components/dataset/DatasetTable';
import { SearchBar } from '../../components/dataset/SearchBar';
import { BarChart3 } from 'lucide-react';

export const Statistics: React.FC = () => {
  const { dataset } = useDataset();
  const [search, setSearch] = useState('');

  if (!dataset) {
    return (
      <div className="text-center py-12 text-zinc-400 font-mono text-xs">
        No dataset currently ingested. Please upload a structured file first.
      </div>
    );
  }

  const columns = dataset.columns || [];

  const filteredColumns = columns.filter((col) =>
    col.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in" id="statistics-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <span>Detailed Parameter Metadata</span>
        </h3>
        <p className="text-xs text-zinc-400">Search and explore continuous variance, unique index flags, null frequencies, and metadata quality score ratios.</p>
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Filter columns by parameter name..." />
        <DatasetTable columns={filteredColumns} />
      </div>
    </div>
  );
};

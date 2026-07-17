import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search parameters, categories, metrics...',
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      <div className="relative flex-grow w-full">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-blue-500/50 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        )}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Automated Filtering</span>
        </div>
      </div>
    </div>
  );
};

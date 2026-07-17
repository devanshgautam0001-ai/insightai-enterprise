import React, { useState } from 'react';
import { Filter, Calendar, Users, Layers } from 'lucide-react';
import { DashboardFilter } from '../../types/dashboard';

interface FilterPanelProps {
  filters: DashboardFilter[];
  onApplyFilter: (id: string, value: any) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onApplyFilter }) => {
  const [activeSegment, setActiveSegment] = useState('All Segments');
  const [activeDate, setActiveDate] = useState('Q3-2026');

  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setActiveSegment(val);
    const filter = filters.find((f) => f.column === 'segment');
    if (filter) onApplyFilter(filter.id, val);
  };

  const handleDateRange = (quarter: string) => {
    setActiveDate(quarter);
    const filter = filters.find((f) => f.type === 'dateRange');
    if (filter) onApplyFilter(filter.id, quarter);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl gap-4">
      {/* Header section */}
      <div className="flex items-center space-x-2.5">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Filter className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Global Cross-Filtering</h4>
          <p className="text-[10px] text-zinc-500 font-mono">Binds metrics & datasets collectively</p>
        </div>
      </div>

      {/* Filters controllers */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Quarters buttons */}
        <div className="flex items-center space-x-1 bg-white/[0.02] border border-white/5 rounded-lg p-1">
          <span className="p-1.5 text-zinc-400" title="Fiscal Calendar">
            <Calendar className="w-3.5 h-3.5" />
          </span>
          {['Q1-2026', 'Q2-2026', 'Q3-2026'].map((quarter) => (
            <button
              key={quarter}
              onClick={() => handleDateRange(quarter)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold font-mono transition-colors ${
                activeDate === quarter
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {quarter}
            </button>
          ))}
        </div>

        {/* Segment dropdown select */}
        <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1">
          <Users className="w-3.5 h-3.5 text-zinc-400 mr-2" />
          <select
            value={activeSegment}
            onChange={handleSegmentChange}
            className="bg-transparent text-zinc-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="All Segments">All Segments</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="SMB">SMB</option>
          </select>
        </div>

        {/* Quick Relative Date slider */}
        <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] text-zinc-300 font-mono font-medium">Relative: Last 30 Days</span>
        </div>
      </div>
    </div>
  );
};
export default FilterPanel;

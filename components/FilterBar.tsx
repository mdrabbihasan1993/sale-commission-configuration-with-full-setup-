
import React from 'react';
import { FilterType, DateRange } from '../types';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (type: FilterType) => void;
  customRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  activeFilter, 
  onFilterChange, 
  customRange, 
  onRangeChange 
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[
            { label: 'Daily', value: FilterType.DAILY },
            { label: 'Weekly', value: FilterType.WEEKLY },
            { label: 'Monthly', value: FilterType.MONTHLY },
            { label: 'Custom', value: FilterType.CUSTOM },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === option.value 
                  ? 'bg-white text-brand-blue shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilter === FilterType.CUSTOM && (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">From</label>
            <input 
              type="date" 
              value={customRange.from}
              onChange={(e) => onRangeChange({ ...customRange, from: e.target.value })}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">To</label>
            <input 
              type="date" 
              value={customRange.to}
              onChange={(e) => onRangeChange({ ...customRange, to: e.target.value })}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {activeFilter === FilterType.CUSTOM ? 'Range Selected' : `Snapshot: ${activeFilter}`}
        </span>
      </div>
    </div>
  );
};

export default FilterBar;

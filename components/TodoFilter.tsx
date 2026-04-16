'use client';

import { FilterType } from '@/app/page';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'completed' },
];

export default function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  return (
    <div className="flex items-center gap-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
            filter === f.value
              ? 'bg-purple-500 text-white font-medium shadow-md'
              : 'text-white/50 hover:text-white hover:bg-white/10'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

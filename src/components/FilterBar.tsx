import clsx from 'clsx'
import { Filter } from '@/types/task'
import { STATUS_CONFIG } from '@/lib/statusConfig'

interface FilterBarProps {
  activeFilter: Filter
  onChange: (filter: Filter) => void
  counts: Record<Filter, number>
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: STATUS_CONFIG.pending.label },
  { value: 'in_progress', label: STATUS_CONFIG.in_progress.label },
  { value: 'completed', label: STATUS_CONFIG.completed.label },
]

export function FilterBar({ activeFilter, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const countClass =
          filter.value === 'all'
            ? 'bg-gray-100 text-gray-600'
            : STATUS_CONFIG[filter.value].count

        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeFilter === filter.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            )}
          >
            {filter.label}
            <span
              className={clsx(
                'text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center',
                activeFilter === filter.value ? 'bg-white/20 text-white' : countClass
              )}
            >
              {counts[filter.value]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

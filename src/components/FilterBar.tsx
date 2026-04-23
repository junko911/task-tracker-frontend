import clsx from 'clsx'
import { Task, TaskStatus } from '@/types/task'

type Filter = TaskStatus | 'all'

interface FilterBarProps {
  activeFilter: Filter
  onChange: (filter: Filter) => void
  tasks: Task[]
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const COUNT_CLASSES: Record<Filter, string> = {
  all: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

export function FilterBar({ activeFilter, onChange, tasks }: FilterBarProps) {
  const counts: Record<Filter, number> = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
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
              activeFilter === filter.value
                ? 'bg-white/20 text-white'
                : COUNT_CLASSES[filter.value]
            )}
          >
            {counts[filter.value]}
          </span>
        </button>
      ))}
    </div>
  )
}

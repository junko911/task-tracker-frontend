import { TaskStatus } from '@/types/task'
import clsx from 'clsx'

const STATUS_CONFIG: Record<TaskStatus, { label: string; classes: string }> = {
  pending: {
    label: 'Pending',
    classes: 'bg-amber-100 text-amber-800 ring-amber-200',
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-blue-100 text-blue-800 ring-blue-200',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1',
        config.classes
      )}
    >
      {config.label}
    </span>
  )
}

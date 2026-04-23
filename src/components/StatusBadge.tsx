import { TaskStatus } from '@/types/task'
import { STATUS_CONFIG } from '@/lib/statusConfig'
import clsx from 'clsx'

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, badge } = STATUS_CONFIG[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1',
        badge
      )}
    >
      {label}
    </span>
  )
}

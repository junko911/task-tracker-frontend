import { Clock, CircleDot, CheckCircle2 } from 'lucide-react'
import type { TaskStatus } from '@/types/task'

export const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string
    icon: typeof Clock
    border: string
    badge: string
    count: string
    selected: string
  }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    border: 'border-l-amber-400',
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    count: 'bg-amber-100 text-amber-700',
    selected: 'bg-amber-100 border-amber-300 text-amber-800',
  },
  in_progress: {
    label: 'In Progress',
    icon: CircleDot,
    border: 'border-l-blue-400',
    badge: 'bg-blue-100 text-blue-800 ring-blue-200',
    count: 'bg-blue-100 text-blue-700',
    selected: 'bg-blue-100 border-blue-300 text-blue-800',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    border: 'border-l-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    count: 'bg-emerald-100 text-emerald-700',
    selected: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  },
}

import { Task } from '@/types/task'
import { StatusBadge } from './StatusBadge'
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { useMutation } from '@apollo/client'
import { DELETE_TASK, UPDATE_TASK } from '@/lib/graphql/mutations'
import { ALL_TASKS_QUERY } from '@/lib/graphql/queries'
import { STATUS_CONFIG } from '@/lib/statusConfig'
import clsx from 'clsx'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { icon: Icon, border } = STATUS_CONFIG[task.status]

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK, {
    variables: { id: task.id },
    update(cache) {
      cache.modify({
        fields: {
          tasks(existingTasks = [], { readField }) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return existingTasks.filter((ref: any) => readField('id', ref) !== task.id)
          },
        },
      })
    },
  })

  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [ALL_TASKS_QUERY],
  })

  const handleQuickStatus = async () => {
    const nextStatus =
      task.status === 'pending'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'pending'
    await updateTask({ variables: { id: task.id, status: nextStatus } })
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"?`)) return
    await deleteTask()
  }

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 p-5 flex flex-col gap-3',
        'hover:shadow-md transition-shadow duration-200',
        border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={clsx(
            'font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1',
            task.status === 'completed' && 'line-through text-gray-400'
          )}
        >
          {task.title}
        </h3>
        <StatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Icon className="w-3.5 h-3.5" />
          {formattedDate}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleQuickStatus}
            title="Advance status"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete task"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

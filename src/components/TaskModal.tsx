import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Task, TaskStatus } from '@/types/task'
import { CREATE_TASK, UPDATE_TASK } from '@/lib/graphql/mutations'
import { GET_TASKS } from '@/lib/graphql/queries'
import { X, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface TaskModalProps {
  task?: Task | null
  onClose: () => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const ALL_TASKS_QUERY = { query: GET_TASKS, variables: { status: null } }

export function TaskModal({ task, onClose }: TaskModalProps) {
  const isEditing = !!task
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pending')
  const [errors, setErrors] = useState<string[]>([])
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const refetchQueries = [ALL_TASKS_QUERY]

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    refetchQueries,
    onCompleted(data) {
      if (data.createTask.errors.length > 0) {
        setErrors(data.createTask.errors)
      } else {
        onClose()
      }
    },
  })

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    refetchQueries,
    onCompleted(data) {
      if (data.updateTask.errors.length > 0) {
        setErrors(data.updateTask.errors)
      } else {
        onClose()
      }
    },
  })

  const loading = creating || updating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!title.trim()) {
      setErrors(['Title is required'])
      return
    }

    if (isEditing && task) {
      await updateTask({
        variables: {
          id: task.id,
          title: title.trim(),
          description: description.trim(),
          status,
        },
      })
    } else {
      await createTask({
        variables: {
          title: title.trim(),
          description: description.trim() || null,
          status,
        },
      })
    }
  }

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          <div>
            <label className="label" htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="input-field"
              maxLength={200}
            />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details (optional)"
              rows={3}
              className="input-field resize-none"
              maxLength={1000}
            />
          </div>

          <div>
            <label className="label">Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={clsx(
                    'flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors',
                    status === opt.value
                      ? opt.value === 'pending'
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : opt.value === 'in_progress'
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

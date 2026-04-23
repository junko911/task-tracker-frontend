import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_TASKS } from '@/lib/graphql/queries'
import { Task, TaskStatus, TasksData } from '@/types/task'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'
import { FilterBar } from './FilterBar'
import { Plus, ClipboardList, Loader2, RefreshCw, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Filter = TaskStatus | 'all'

export function TaskBoard() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { logout } = useAuth()

  const { data, loading, error, refetch } = useQuery<TasksData>(GET_TASKS, {
    variables: { status: null },
  })

  const allTasks = useMemo(() => data?.tasks ?? [], [data])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return allTasks
    return allTasks.filter((t) => t.status === activeFilter)
  }, [allTasks, activeFilter])

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Task Tracker</h1>
              <p className="text-xs text-gray-500">Personal task management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setEditingTask(null); setShowModal(true) }}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: allTasks.length, color: 'text-gray-900', bg: 'bg-white' },
            {
              label: 'Pending',
              value: allTasks.filter((t) => t.status === 'pending').length,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
            {
              label: 'In Progress',
              value: allTasks.filter((t) => t.status === 'in_progress').length,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Completed',
              value: allTasks.filter((t) => t.status === 'completed').length,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-4 border border-gray-100 shadow-sm`}
            >
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} tasks={allTasks} />

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">Failed to load tasks</p>
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
            <button onClick={() => refetch()} className="btn-secondary mt-4">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    {activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter.replace('_', ' ')} tasks`}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {activeFilter === 'all'
                      ? 'Create your first task to get started'
                      : 'Try a different filter or create a new task'}
                  </p>
                </div>
                {activeFilter === 'all' && (
                  <button
                    onClick={() => { setEditingTask(null); setShowModal(true) }}
                    className="btn-primary mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

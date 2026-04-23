import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { TaskBoard } from '@/components/TaskBoard'
import { LoginPage } from '@/components/LoginPage'

function AppContent() {
  const { token } = useAuth()
  return token ? <TaskBoard /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

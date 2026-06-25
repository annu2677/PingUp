import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { SocialProvider } from './SocialContext'
import AuthPage from './AuthPage'
import Dashboard from './Dashboard'

function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocialProvider>
          <Routes>
            <Route path="/login" element={<AuthPage />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </SocialProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
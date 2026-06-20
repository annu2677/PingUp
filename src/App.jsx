import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { SocialProvider } from './SocialContext'
import AuthPage from './AuthPage'
import Dashboard from './Dashboard'
import Messages from './Messages'
import Explore from './Explore'
import Profile from './Profile'
import Notifications from './Notifications'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  console.log('ProtectedRoute: user is', user)
  if (!user) {
    console.log('ProtectedRoute: redirecting to login')
    return <Navigate to="/login" replace />
  }
  console.log('ProtectedRoute: rendering protected content')
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
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocialProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

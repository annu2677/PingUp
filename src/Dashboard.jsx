import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, LogOut, User } from 'lucide-react'
import { useAuth } from './AuthContext'
import Sidebar from './Sidebar'
import Feed from './Feed'
import RightPanel from './RightPanel'
import CreatePostModal from './CreatePostModal'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showCreatePost, setShowCreatePost] = useState(false)

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1)

  const renderCurrentPage = () => {
    if (location.pathname === '/') {
      return (
        <main className="relative z-10 flex-1 px-3 py-4 pb-24 sm:px-5 lg:px-6">
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,640px)_320px] xl:items-start">
            <Feed />

            <aside className="hidden xl:block sticky top-6">
              <RightPanel user={user} />
            </aside>
          </div>
        </main>
      )
    }

    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-slate-100 flex"
    >
      <Sidebar
        user={user}
        onLogout={logout}
        currentPage={currentPage}
      />

      <div className="min-w-0 flex-1">
        {renderCurrentPage()}
      </div>

      {location.pathname === '/' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white px-4 py-3 shadow-lg xl:hidden">
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-xs font-medium text-slate-700"
          >
            <User size={22} />
            Profile
          </button>

          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 text-xs font-medium text-red-600"
          >
            <LogOut size={22} />
            Logout
          </button>
        </div>
      )}

      {location.pathname === '/' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl transition hover:bg-slate-800"
        >
          <Plus size={24} />
        </motion.button>
      )}

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </motion.div>
  )
}
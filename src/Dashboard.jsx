import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
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
        <main className="relative z-10 flex-1 px-3 py-4 sm:px-5 lg:px-6">
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
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl transition hover:bg-slate-800 sm:bottom-7 sm:right-7"
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
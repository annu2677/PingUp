import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAuth } from './AuthContext'
import Sidebar from './Sidebar'
import Feed from './Feed'
import RightPanel from './RightPanel'
import CreatePostModal from './CreatePostModal'
import DebugPosts from './DebugPosts'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showCreatePost, setShowCreatePost] = useState(false)

  const currentPage = location.pathname === '/' ? 'home' :
                     location.pathname.slice(1) // Remove leading slash

  const handlePageChange = (page) => {
    if (page === 'home') {
      navigate('/')
    } else {
      navigate(`/${page}`)
    }
  }

  const renderCurrentPage = () => {
    if (location.pathname === '/') {
      return (
        <main className="flex-1 flex flex-col xl:flex-row gap-6 px-6 py-6">
          <div className="flex-1 min-w-0">
            <Feed />
          </div>
          <div className="hidden xl:block xl:w-[320px]">
            <RightPanel user={user} />
          </div>
        </main>
      )
    }
    return null // Other pages are handled by separate routes
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex transition-all duration-500"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute right-8 top-44 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-80 w-80 -translate-x-1/2 rounded-full bg-pink-300/20 blur-3xl" />
      </div>

      <Sidebar
        user={user}
        onLogout={logout}
        currentPage={currentPage}
      />

      <div className="flex-1 flex flex-col">
        {renderCurrentPage()}
      </div>

      {/* Floating Action Button for Create Post */}
      {location.pathname === '/' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow z-40"
        >
          <Plus size={24} />
        </motion.button>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
      <DebugPosts />
    </motion.div>
  )
}

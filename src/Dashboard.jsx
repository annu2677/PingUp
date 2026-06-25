import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus,Home,Search,Bell,MessageCircle,User,LogOut,} from 'lucide-react'
import { useAuth } from './AuthContext'
import Sidebar from './Sidebar'
import Feed from './Feed'
import RightPanel from './RightPanel'
import CreatePostModal from './CreatePostModal'
import Explore from './Explore'
import Messages from './Messages'
import Notifications from './Notifications'
import Profile from './Profile'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showCreatePost, setShowCreatePost] = useState(false)

  const currentPage =
    location.pathname === '/' ? 'home' : location.pathname.split('/')[1]

  const mobileNavItems = [
    { icon: <Home size={21} />, label: 'Home', path: '/', page: 'home' },
    { icon: <Search size={21} />, label: 'Search', path: '/explore', page: 'explore' },
    { icon: <Bell size={21} />, label: 'Alerts', path: '/notifications', page: 'notifications' },
    { icon: <MessageCircle size={21} />, label: 'Chats', path: '/messages', page: 'messages' },
    { icon: <User size={21} />, label: 'Profile', path: '/profile', page: 'profile' },
    { icon: <LogOut size={21} />, label: 'Logout', action: logout, page: 'logout' },
  ]

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

    if (location.pathname.startsWith('/explore')) {
      return <Explore />
    }

    if (location.pathname.startsWith('/messages')) {
      return <Messages />
    }

    if (location.pathname.startsWith('/notifications')) {
      return <Notifications />
    }

    if (location.pathname.startsWith('/profile')) {
      return <Profile />
    }

    return (
      <main className="relative z-10 flex-1 px-3 py-4 pb-24 sm:px-5 lg:px-6">
        <Feed />
      </main>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-slate-100 flex"
    >
      <Sidebar user={user} onLogout={logout} currentPage={currentPage} />

      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        {renderCurrentPage()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white px-1 py-2 shadow-lg md:hidden">
        {mobileNavItems.map((item) => {
          const active = currentPage === item.page

          return (
            <button
              key={item.page}
              type="button"
              onClick={() => {
                if (item.action) {
                  item.action()
                } else {
                  navigate(item.path)
                }
              }}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1 text-[10px] font-medium transition ${
                item.page === 'logout'
                  ? 'text-red-600'
                  : active
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {location.pathname === '/' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl transition hover:bg-slate-800 md:bottom-8"
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
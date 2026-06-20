import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, Search, MessageCircle, User, LogOut, Bell } from 'lucide-react'
import NavItem from './NavItem.jsx'

function Sidebar({ user, onLogout, currentPage }) {
  const navigate = useNavigate()

  const navItems = [
    { icon: <Home />, label: 'Home', page: 'home', path: '/' },
    { icon: <Search />, label: 'Explore', page: 'explore', path: '/explore' },
    { icon: <MessageCircle />, label: 'Messages', page: 'messages', path: '/messages' },
    { icon: <Bell />, label: 'Notifications', page: 'notifications', path: '/notifications' },
    { icon: <User />, label: 'Profile', page: 'profile', path: '/profile' }
  ]

  const handlePageChange = (path) => {
    navigate(path)
  }

  return (
    <aside className="w-72 p-5 hidden md:flex flex-col gap-6 sticky top-0 h-screen">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="glass-card rounded-[32px] border border-white/70 p-5"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xl shadow-lg shadow-violet-500/20">
            P
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-violet-600/90">Social</p>
            <h1 className="text-2xl font-semibold text-slate-900">PingUp</h1>
          </div>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <div key={item.page} onClick={() => handlePageChange(item.path)}>
              <NavItem
                icon={item.icon}
                label={item.label}
                active={currentPage === item.page}
              />
            </div>
          ))}
        </div>

        {user && (
          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="mb-4 rounded-2xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Logged in as</p>
              <p className="font-semibold text-slate-900">{user.name}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-500/20 transition"
            >
              <LogOut size={18} /> Sign Out
            </motion.button>
          </div>
        )}
      </motion.div>
    </aside>
  )
}

export default Sidebar
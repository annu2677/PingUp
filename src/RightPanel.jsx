import { motion } from 'framer-motion'
import { TrendingUp, Users, Hash, Flame } from 'lucide-react'
import { useSocial } from './SocialContext'

function RightPanel({ user }) {
  const { users } = useSocial()

  // Get suggested users (excluding current user)
  const suggestedUsers = users.slice(3, 8)

  const trendingTopics = [
    { tag: 'photography', posts: 12543, trending: true },
    { tag: 'travel', posts: 8921, trending: true },
    { tag: 'food', posts: 15678, trending: false },
    { tag: 'fitness', posts: 9876, trending: true },
    { tag: 'art', posts: 5432, trending: false }
  ]

  const SuggestedUser = ({ user: suggestedUser, index }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 6, scale: 1.02 }}
      className="flex items-center justify-between gap-4 rounded-2xl bg-white/90 p-4 shadow-sm border border-white/50 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
            <img
              src={`https://images.unsplash.com/photo-${150000 + suggestedUser.id * 100000}?w=48&h=48&fit=crop&crop=face`}
              alt={suggestedUser.username}
              className="w-full h-full object-cover"
            />
          </div>
          {suggestedUser.verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {suggestedUser.username.replace('_', ' ')}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {suggestedUser.followers.toLocaleString()} followers
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-xs font-semibold text-white hover:shadow-lg transition-all"
      >
        Follow
      </motion.button>
    </motion.div>
  )

  const TrendingTopic = ({ topic, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400">
          <Hash size={14} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            #{topic.tag}
          </p>
          <p className="text-xs text-slate-500">
            {topic.posts.toLocaleString()} posts
          </p>
        </div>
      </div>
      {topic.trending && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame size={16} className="text-orange-500" />
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <aside className="w-80 p-6 hidden lg:block space-y-6">
      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-card rounded-3xl p-6 border border-white/70 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face`}
                alt={user?.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm uppercase tracking-wider text-slate-500 font-medium">Welcome back</p>
            <h3 className="text-lg font-bold text-slate-900 truncate">{user?.name || 'Creative User'}</h3>
            <p className="text-sm text-slate-600">Ready to create something amazing?</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-xs text-slate-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">1.2k</p>
            <p className="text-xs text-slate-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">89</p>
            <p className="text-xs text-slate-500">Following</p>
          </div>
        </div>
      </motion.div>

      {/* Suggested Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl p-6 border border-white/70 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            <h2 className="font-bold text-slate-900">Suggested for you</h2>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Updated</span>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((suggestedUser, index) => (
            <SuggestedUser key={suggestedUser.id} user={suggestedUser} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-3xl p-6 border border-white/70 shadow-xl"
      >
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" />
          <h2 className="font-bold text-slate-900">Trending Topics</h2>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <TrendingTopic key={topic.tag} topic={topic} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-slate-500 space-y-2"
      >
        <p>© 2024 PingUp - Connect & Create</p>
        <div className="flex justify-center gap-4">
          <span className="hover:text-slate-700 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-slate-700 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-slate-700 cursor-pointer transition-colors">Help</span>
        </div>
      </motion.div>
    </aside>
  )
}

export default RightPanel
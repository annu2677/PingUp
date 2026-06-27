import { motion } from 'framer-motion'
import { TrendingUp, Users, Hash, Flame } from 'lucide-react'
import { useSocial } from './SocialContext'

function RightPanel({ user }) {
  const { users } = useSocial()

  const suggestedUsers = users.slice(0, 5)

  const trendingTopics = [
    { tag: 'photography', posts: 12543, trending: true },
    { tag: 'travel', posts: 8921, trending: true },
    { tag: 'food', posts: 15678, trending: false },
    { tag: 'fitness', posts: 9876, trending: true },
    { tag: 'art', posts: 5432, trending: false },
  ]

  const SuggestedUser = ({ user: suggestedUser, index }) => {
    const username =
      suggestedUser?.username ||
      suggestedUser?.name ||
      'Unknown'

    const profilePicture = suggestedUser?.profilePicture || ''

    const followers = Number(suggestedUser?.followers || 0)

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ x: 3, scale: 1.01 }}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                username.charAt(0).toUpperCase()
              )}
            </div>

            {suggestedUser?.verified && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-blue-500">
                <span className="text-xs text-white">✓</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">
              {username.replace('_', ' ')}
            </p>

            <p className="truncate text-xs text-slate-500">
              {followers.toLocaleString()} followers
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg"
        >
          Follow
        </motion.button>
      </motion.div>
    )
  }

  const TrendingTopic = ({ topic, index }) => {
    const posts = Number(topic?.posts || 0)

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="group flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors hover:bg-white/50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-pink-400">
            <Hash size={14} className="text-white" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
              #{topic.tag}
            </p>

            <p className="text-xs text-slate-500">
              {posts.toLocaleString()} posts
            </p>
          </div>
        </div>

        {topic.trending && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="shrink-0"
          >
            <Flame size={16} className="text-orange-500" />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <aside className="hidden w-80 space-y-6 p-6 lg:block">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-card rounded-3xl border border-white/70 p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold text-white">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.username || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.username || user?.name || 'U').charAt(0).toUpperCase()
              )}
            </div>

            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-3 border-white bg-green-500">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
              Welcome back
            </p>

            <h3 className="truncate text-lg font-bold text-slate-900">
              {user?.username || user?.name || 'Creative User'}
            </h3>

            <p className="text-sm text-slate-600">
              Ready to create something amazing?
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-xs text-slate-500">Posts</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-xs text-slate-500">Followers</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">0</p>
            <p className="text-xs text-slate-500">Following</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl border border-white/70 p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Users size={20} className="shrink-0 text-blue-500" />
            <h2 className="font-bold text-slate-900">
              Suggested for you
            </h2>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
            Updated
          </span>
        </div>

        <div className="space-y-3">
          {suggestedUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No suggestions yet</p>
          ) : (
            suggestedUsers.map((suggestedUser, index) => (
              <SuggestedUser
                key={suggestedUser.id || suggestedUser._id || index}
                user={suggestedUser}
                index={index}
              />
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-3xl border border-white/70 p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" />
          <h2 className="font-bold text-slate-900">
            Trending Topics
          </h2>
        </div>

        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <TrendingTopic key={topic.tag} topic={topic} index={index} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-2 text-center text-xs text-slate-500"
      >
        <p>© 2024 PingUp - Connect & Create</p>

        <div className="flex justify-center gap-4">
          <span className="cursor-pointer transition-colors hover:text-slate-700">
            Privacy
          </span>

          <span className="cursor-pointer transition-colors hover:text-slate-700">
            Terms
          </span>

          <span className="cursor-pointer transition-colors hover:text-slate-700">
            Help
          </span>
        </div>
      </motion.div>
    </aside>
  )
}

export default RightPanel
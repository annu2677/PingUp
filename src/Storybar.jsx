import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useSocial } from './SocialContext'

function Storybar() {
  const { users, currentUser } = useSocial()

  // Get a subset of users for stories (excluding current user)
  const storyUsers = users.slice(0, 6)

  const StoryItem = ({ user, index, isAddStory = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className={`relative ${isAddStory ? 'w-16 h-16' : 'w-16 h-16'} rounded-full p-[3px] ${
        isAddStory
          ? 'bg-gradient-to-tr from-gray-400 to-gray-600'
          : 'bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500'
      } shadow-lg group-hover:shadow-xl transition-shadow`}>
        {isAddStory ? (
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <Plus size={24} className="text-gray-600" />
          </div>
        ) : (
          <div className="w-full h-full rounded-full bg-white overflow-hidden">
            <img
              src={`https://images.unsplash.com/photo-${150000 + index * 100000}?w=64&h=64&fit=crop&crop=face`}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Story Ring Indicator */}
        {!isAddStory && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      <span className="text-xs text-gray-600 font-medium truncate max-w-16 text-center">
        {isAddStory ? 'Your story' : user.username.split('_').join(' ')}
      </span>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative flex gap-6 mb-10 overflow-x-auto pb-2 px-4 scrollbar-hide"
    >
      {/* Add Story */}
      <StoryItem isAddStory={true} index={0} />

      {/* User Stories */}
      {storyUsers.map((user, index) => (
        <StoryItem key={user.id} user={user} index={index + 1} />
      ))}

      {/* Gradient fade on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </motion.div>
  )
}

export default Storybar
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useSocial } from './SocialContext'

function Storybar() {
  const { users, currentUser } = useSocial()

  const storyUsers = users?.slice(0, 8) || []

  const StoryItem = ({ user, index, isAddStory = false }) => {
    const username = isAddStory
      ? 'Your story'
      : user?.username || user?.name || 'user'

    const avatarLetter = username.charAt(0).toUpperCase()

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        whileTap={{ scale: 0.94 }}
        className="flex w-[72px] shrink-0 cursor-pointer flex-col items-center gap-2"
      >
        <div className="rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400 p-[2px]">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-lg font-bold text-slate-700">
            {isAddStory ? (
              <Plus size={24} />
            ) : user?.avatar || user?.profilePicture ? (
              <img
                src={user.avatar || user.profilePicture}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              avatarLetter
            )}
          </div>
        </div>

        <span className="w-full truncate text-center text-xs font-medium text-slate-600">
          {isAddStory ? 'Your story' : username}
        </span>
      </motion.div>
    )
  }

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        <StoryItem isAddStory index={0} user={currentUser} />

        {storyUsers.map((user, index) => (
          <StoryItem key={user.id || index} user={user} index={index + 1} />
        ))}
      </div>
    </div>
  )
}

export default Storybar
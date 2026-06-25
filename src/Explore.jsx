import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, User, Hash, Heart, MessageCircle } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function Explore() {
  const { posts, users } = useSocial()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [filteredPosts, setFilteredPosts] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim()

    if (query === '') {
      setFilteredPosts(posts.slice(0, 20))
      setFilteredUsers(users.slice(0, 10))
    } else {
      const postResults = posts.filter((post) => {
        const caption = post.caption || ''
        const hashtags = post.hashtags || []

        return (
          caption.toLowerCase().includes(query) ||
          hashtags.some((tag) => tag.toLowerCase().includes(query))
        )
      })

      setFilteredPosts(postResults)

      const userResults = users.filter((user) => {
        const username = user.username || ''
        const name = user.name || ''

        return (
          username.toLowerCase().includes(query) ||
          name.toLowerCase().includes(query)
        )
      })

      setFilteredUsers(userResults)
    }
  }, [searchQuery, posts, users])

  const goToProfile = (userId) => {
    if (!userId) return
    navigate(`/profile/${userId}`)
  }

  const PostCard = ({ post }) => {
    const username = post.user?.username || post.username || 'User'

    const profilePicture =
      post.user?.profilePicture ||
      post.profilePicture ||
      post.userProfilePicture ||
      ''

    const fallbackInitial = username.charAt(0).toUpperCase()

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      >
        <div className="relative aspect-square bg-gray-200">
          {post.image ? (
            <img
              src={post.image}
              alt={post.caption || 'Post'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-gray-600">
              {post.caption || 'No image'}
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors hover:bg-black/20 hover:opacity-100">
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Heart size={20} />
                <span className="font-semibold">{post.likes || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="font-semibold">{post.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => goToProfile(post.user?.id || post.userId)}
            className="mb-2 flex items-center gap-2 text-left"
          >
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-xs font-semibold text-white">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                fallbackInitial
              )}
            </div>

            <span className="text-sm font-semibold hover:underline">
              {username}
            </span>
          </button>

          <p className="line-clamp-2 text-sm text-gray-800">
            {post.caption}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {(post.hashtags || []).slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-blue-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const UserCard = ({ user }) => {
    const username = user.username || user.name || 'User'

    const profilePicture =
      user.profilePicture ||
      user.userProfilePicture ||
      user.avatarUrl ||
      ''

    const fallbackInitial = username.charAt(0).toUpperCase()

    return (
      <motion.button
        type="button"
        onClick={() => goToProfile(user.id || user._id)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={username}
              className="h-full w-full object-cover"
            />
          ) : (
            fallbackInitial
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">
              {username}
            </span>

            {user.verified && (
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <span className="text-xs text-white">✓</span>
              </div>
            )}
          </div>

          <p className="truncate text-sm text-gray-600">
            {user.name || username}
          </p>

          <p className="text-xs text-gray-500">
            {user.followers || 0} followers
          </p>
        </div>

        <span className="rounded-lg bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
          View
        </span>
      </motion.button>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-4 pb-24">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">Explore</h1>

        <div className="relative max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search posts, users, or hashtags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6 flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'posts'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Posts
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search size={24} className="text-gray-400" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-600">
                No posts found
              </h3>

              <p className="text-gray-500">
                Try searching for something else
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <User size={24} className="text-gray-400" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-600">
                No users found
              </h3>

              <p className="text-gray-500">
                Try searching for a different username
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <UserCard key={user.id || user._id} user={user} />
            ))
          )}
        </div>
      )}

      {searchQuery.trim() === '' && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Trending Hashtags</h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              'photography',
              'travel',
              'food',
              'fitness',
              'art',
              'music',
              'nature',
              'fashion',
            ].map((tag) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery(tag)}
                className="cursor-pointer rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-4 text-white"
              >
                <Hash size={24} className="mb-2" />
                <h3 className="font-semibold capitalize">#{tag}</h3>
                <p className="text-sm opacity-90">Trending now</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
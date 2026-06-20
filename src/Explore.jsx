import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, User, Hash, Heart, MessageCircle, Share } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function Explore() {
  const { posts, users } = useSocial()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('posts') // 'posts' or 'users'
  const [filteredPosts, setFilteredPosts] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts.slice(0, 20)) // Show recent posts
      setFilteredUsers(users.slice(0, 10)) // Show some users
    } else {
      // Filter posts by caption or hashtags
      const postResults = posts.filter(post =>
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredPosts(postResults)

      // Filter users by username or name
      const userResults = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(userResults)
    }
  }, [searchQuery, posts, users])

  const PostCard = ({ post }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
    >
      {/* Post Image */}
      <div className="aspect-square bg-gray-200 relative">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Heart size={20} />
              <span className="font-semibold">{post.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="font-semibold">{post.comments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {post.user.avatar}
          </div>
          <span className="text-sm font-semibold">{post.user.username}</span>
        </div>
        <p className="text-sm text-gray-800 line-clamp-2">{post.caption}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {post.hashtags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs text-blue-500">#{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const UserCard = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
        {user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">{user.username}</span>
          {user.verified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">{user.name}</p>
        <p className="text-xs text-gray-500">{user.followers} followers</p>
      </div>
      <button className="px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors">
        Follow
      </button>
    </motion.div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts, users, or hashtags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'posts'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'users'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Users
        </button>
      </div>

      {/* Content */}
      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts found</h3>
              <p className="text-gray-500">Try searching for something else</p>
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
              <p className="text-gray-500">Try searching for a different username</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          )}
        </div>
      )}

      {/* Trending Hashtags */}
      {searchQuery.trim() === '' && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Trending Hashtags</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['photography', 'travel', 'food', 'fitness', 'art', 'music', 'nature', 'fashion'].map((tag) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery(tag)}
                className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-4 text-white cursor-pointer"
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

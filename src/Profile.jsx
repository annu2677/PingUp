import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Grid, Bookmark, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function Profile({ userId }) {
  const { posts, users, currentUser, followUser, unfollowUser } = useSocial()
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  // For demo purposes, if no userId is provided, show current user profile
  const profileUser = userId ? users.find(u => u.id === userId) : currentUser
  const userPosts = posts.filter(post => post.user.id === profileUser.id)
  const isOwnProfile = profileUser.id === currentUser.id

  useEffect(() => {
    // Check if current user is following this profile
    if (!isOwnProfile) {
      setIsFollowing(currentUser.following?.includes(profileUser.id) || false)
    }
  }, [profileUser.id, currentUser.following, isOwnProfile])

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(profileUser.id)
      setIsFollowing(false)
    } else {
      followUser(profileUser.id)
      setIsFollowing(true)
    }
  }

  const PostGrid = ({ posts }) => (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square bg-gray-200 relative group cursor-pointer"
        >
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Heart size={18} />
                <span className="font-semibold text-sm">{post.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-semibold text-sm">{post.comments}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const TaggedPosts = () => (
    <div className="grid grid-cols-3 gap-1">
      {/* Mock tagged posts - in a real app, this would come from the API */}
      {Array.from({ length: 9 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="aspect-square bg-gradient-to-br from-pink-400 to-purple-500 relative group cursor-pointer"
        >
          <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
            Tagged
          </div>
        </motion.div>
      ))}
    </div>
  )

  const SavedPosts = () => (
    <div className="grid grid-cols-3 gap-1">
      {/* Mock saved posts - in a real app, this would come from the API */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="aspect-square bg-gradient-to-br from-blue-400 to-green-500 relative group cursor-pointer"
        >
          <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
            Saved
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold"
          >
            {profileUser.avatar}
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl font-light">{profileUser.username}</h1>
              {isOwnProfile ? (
                <div className="flex gap-2">
                  <button className="px-4 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Edit profile
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-1 font-semibold rounded-lg transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="px-4 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Message
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 mb-4">
              <div className="text-center">
                <span className="font-semibold">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{profileUser.followers}</span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{profileUser.following}</span>
                <span className="text-gray-600 ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="font-semibold mb-1">{profileUser.name}</h2>
              <p className="text-gray-700 whitespace-pre-line">{profileUser.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-12 py-4 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'text-black border-t-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid size={16} />
            POSTS
          </button>
          {isOwnProfile && (
            <>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-12 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'saved'
                    ? 'text-black border-t-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bookmark size={16} />
                SAVED
              </button>
              <button
                onClick={() => setActiveTab('tagged')}
                className={`px-12 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'tagged'
                    ? 'text-black border-t-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg">@</span>
                TAGGED
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'posts' && <PostGrid posts={userPosts} />}
        {activeTab === 'saved' && isOwnProfile && <SavedPosts />}
        {activeTab === 'tagged' && isOwnProfile && <TaggedPosts />}

        {userPosts.length === 0 && activeTab === 'posts' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
            <p className="text-gray-500">Share your first photo or video</p>
          </div>
        )}
      </div>
    </div>
  )
}

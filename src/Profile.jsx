import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Grid } from 'lucide-react'
import { useSocial } from './SocialContext'
import { useAuth } from './AuthContext'
import { getUserById } from './api/userApi'

export default function Profile() {
  const { posts } = useSocial()
  const { user: currentUser } = useAuth()

  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!currentUser?.id) return

        const data = await getUserById(currentUser.id)
        setProfileUser(data)
      } catch (error) {
        console.error('Profile loading error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [currentUser?.id])

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>
  }

  if (!profileUser) {
    return <div className="p-10 text-center">Profile not found</div>
  }

  const userPosts = posts.filter(
    (post) => String(post.user?.id) === String(profileUser.id)
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden text-white text-5xl font-bold"
          >
            {profileUser.profilePicture ? (
              <img
                src={profileUser.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              profileUser.username?.charAt(0).toUpperCase() || 'U'
            )}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl font-light">
                {profileUser.username}
              </h1>

              <div className="flex gap-2 justify-center md:justify-start">
                <button className="px-4 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  Edit profile
                </button>

                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-4">
              <div>
                <span className="font-semibold">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>

              <div>
                <span className="font-semibold">0</span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>

              <div>
                <span className="font-semibold">0</span>
                <span className="text-gray-600 ml-1">following</span>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-1">{profileUser.username}</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {profileUser.bio || 'No bio yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <button className="px-12 py-4 font-semibold text-black border-t-2 border-black flex items-center gap-2">
            <Grid size={16} />
            POSTS
          </button>
        </div>
      </div>

      <div className="p-4">
        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">Share your first photo or video</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square bg-gray-200 relative overflow-hidden"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.caption || 'Post'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-3 text-center text-sm">
                    {post.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
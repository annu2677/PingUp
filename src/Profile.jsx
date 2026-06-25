import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Grid, X } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useSocial } from './SocialContext'
import { useAuth } from './AuthContext'
import { getUserById, updateUserProfile } from './api/userApi'
import {toggleFollow,getFollowersCount,getFollowingCount,isFollowingUser,} from './api/followApi'

export default function Profile() {
  const { posts } = useSocial()
  const { user: currentUser } = useAuth()
  const { userId } = useParams()

  const profileId = userId || currentUser?.id
  const isOwnProfile = String(profileId) === String(currentUser?.id)

  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editProfilePicture, setEditProfilePicture] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [profileId, currentUser?.id])

  const loadProfile = async () => {
    try {
      setLoading(true)

      if (!profileId) return

      const data = await getUserById(profileId)
      setProfileUser(data)

      const followersCount = await getFollowersCount(profileId)
      const followingCount = await getFollowingCount(profileId)

      setFollowers(followersCount)
      setFollowing(followingCount)

      if (currentUser?.id && !isOwnProfile) {
        const status = await isFollowingUser(currentUser.id, profileId)
        setIsFollowing(status)
      }
    } catch (error) {
      console.error('Profile loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!currentUser?.id) {
      alert('Please login first')
      return
    }

    if (isOwnProfile) return

    try {
      setFollowLoading(true)

      const result = await toggleFollow(currentUser.id, profileId)

      setIsFollowing(result.following)

      setFollowers((prev) =>
        result.following ? prev + 1 : Math.max(0, prev - 1)
      )
    } catch (error) {
      console.error('Follow error:', error)
      alert(error.message || 'Follow action failed')
    } finally {
      setFollowLoading(false)
    }
  }

  const openEditModal = () => {
    setEditUsername(profileUser.username || '')
    setEditBio(profileUser.bio || '')
    setEditProfilePicture(profileUser.profilePicture || '')
    setShowEditModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      setEditProfilePicture(reader.result)
    }

    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      const updatedUser = await updateUserProfile(profileUser.id, {
        username: editUsername,
        bio: editBio,
        profilePicture: editProfilePicture,
      })

      setProfileUser(updatedUser)

      const oldUser = JSON.parse(localStorage.getItem('currentUser'))

      const newLocalUser = {
        ...oldUser,
        username: updatedUser.username,
        profilePicture: updatedUser.profilePicture,
      }

      localStorage.setItem('currentUser', JSON.stringify(newLocalUser))

      setShowEditModal(false)
    } catch (error) {
      console.error('Update profile error:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

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
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={openEditModal}
                      className="px-4 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit profile
                    </button>

                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-5 py-1 font-semibold rounded-lg transition-colors disabled:opacity-60 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {followLoading
                      ? 'Loading...'
                      : isFollowing
                      ? 'Following'
                      : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-4">
              <div>
                <span className="font-semibold">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>

              <div>
                <span className="font-semibold">{followers}</span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>

              <div>
                <span className="font-semibold">{following}</span>
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

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Edit profile</h2>

              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden flex items-center justify-center text-white text-3xl font-bold mb-3">
                {editProfilePicture ? (
                  <img
                    src={editProfilePicture}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  editUsername?.charAt(0).toUpperCase() || 'U'
                )}
              </div>

              <label className="cursor-pointer text-sm font-semibold text-blue-600">
                Change profile photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Username
              </label>

              <input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">
                Bio
              </label>

              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows="3"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write something about yourself..."
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full rounded-lg bg-slate-950 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
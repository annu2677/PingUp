import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image, Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function CreatePostModal({ isOpen, onClose }) {
  const [image, setImage] = useState('')
  const [caption, setCaption] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { createPost, currentUser } = useSocial()

  const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  const username =
    currentUser?.username ||
    currentUser?.name ||
    savedUser?.username ||
    savedUser?.name ||
    'user'

  const profilePicture =
    currentUser?.profilePicture ||
    savedUser?.profilePicture ||
    ''

  const avatarLetter = username.charAt(0).toUpperCase()

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!image || !caption.trim()) return

    setIsLoading(true)

    try {
      await createPost(image, caption)
      setImage('')
      setCaption('')
      onClose()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Unable to create the post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-semibold text-lg">Create Post</h2>

              <button
                onClick={handleSubmit}
                disabled={!image || !caption.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                {isLoading ? 'Posting...' : 'Share'}
              </button>
            </div>

            <div className="p-4">
              {!image ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <Image size={48} className="mx-auto text-gray-400 mb-4" />

                    <p className="text-gray-600 mb-4">
                      Select a photo to share
                    </p>

                    <label className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl"
                    />

                    <button
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />

                  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 overflow-hidden bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt={username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          avatarLetter
                        )}
                      </div>

                      <span className="font-semibold">{username}</span>
                    </div>

                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl mb-3"
                    />

                    <div className="flex items-center gap-4 text-gray-600">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart size={16} />
                        <span className="text-sm">0</span>
                      </button>

                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle size={16} />
                        <span className="text-sm">0</span>
                      </button>

                      <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                        <Send size={16} />
                      </button>

                      <button className="ml-auto hover:text-yellow-500 transition-colors">
                        <Bookmark size={16} />
                      </button>
                    </div>

                    {caption && (
                      <p className="text-sm text-gray-800 mt-2">
                        <span className="font-semibold">{username}</span>{' '}
                        {caption}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
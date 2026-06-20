import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Send, MoreHorizontal } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function CommentsModal({ isOpen, onClose, post }) {
  const [comment, setComment] = useState('')
  const { addComment, likePost } = useSocial()

  const handleSubmitComment = () => {
    if (comment.trim()) {
      addComment(post.id, comment)
      setComment('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
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
            className="relative w-full max-w-lg mx-4 bg-white rounded-3xl overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Comments</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Post Preview */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {post.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{post.user.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 break-words">{post.caption}</p>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {post.commentsList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No comments yet.</p>
                  <p className="text-sm">Be the first to comment!</p>
                </div>
              ) : (
                post.commentsList.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {comment.user.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.user.username}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 break-words">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                          Like
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  J
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!comment.trim()}
                    className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

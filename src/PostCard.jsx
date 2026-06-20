import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { useSocial } from './SocialContext'
import CommentsModal from './CommentsModal'

function PostCard({ post, index }) {
  const [showComments, setShowComments] = useState(false)
  const { likePost, currentUser } = useSocial()

  const handleLike = async () => {
    if (!currentUser?.id) {
      alert('Please login first')
      return
    }

    await likePost(post.id)
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
        whileHover={{ y: -6 }}
        className="glass-card card-border rounded-[32px] p-5 shadow-xl border border-white/70"
      >
        {/* Post Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow-lg text-sm font-semibold"
            >
              {post.user.avatar}
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{post.user.username}</p>
              <p className="text-xs text-slate-500">
                {new Date(post.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Post Image */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative mb-4 overflow-hidden rounded-[28px] bg-gray-200 h-64"
        >
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Post Caption */}
        <p className="mb-4 text-slate-700">{post.caption}</p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="text-sm text-blue-500">#{tag}</span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-slate-700">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            animate={post.liked ? { scale: [1, 1.1, 1] } : {}}
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
              post.liked ? 'bg-rose-100 text-rose-600' : 'bg-white/90 text-slate-800 shadow-sm'
            }`}
          >
            <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
            {post.liked ? 'Liked' : 'Like'} ({post.likes})
          </motion.button>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
            >
              <MessageCircle size={18} /> Comment ({post.comments})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
            >
              <Share2 size={18} /> Share
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />
    </>
  )
}

export default PostCard
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react'
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

  const username =
    post.user?.username ||
    post.user?.name ||
    post.username ||
    'unknown'

  const profilePicture =
    post.user?.profilePicture ||
    post.userProfilePicture ||
    post.profilePicture ||
    ''

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          ease: 'easeOut',
          delay: index * 0.04,
        }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-bold text-white">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">
                {username}
              </p>

              <p className="text-xs text-slate-500">
                {post.timestamp
                  ? new Date(post.timestamp).toLocaleDateString()
                  : ''}
              </p>
            </div>
          </div>

          <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {post.image && (
          <div className="w-full bg-slate-100">
            <img
              src={post.image}
              alt={post.caption || 'Post'}
              className="aspect-square w-full object-cover"
            />
          </div>
        )}

        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`transition ${
                  post.liked
                    ? 'text-red-500'
                    : 'text-slate-900 hover:text-red-500'
                }`}
              >
                <Heart
                  size={25}
                  fill={post.liked ? 'currentColor' : 'none'}
                />
              </button>

              <button
                onClick={() => setShowComments(true)}
                className="text-slate-900 transition hover:text-blue-500"
              >
                <MessageCircle size={25} />
              </button>

              <button className="text-slate-900 transition hover:text-green-500">
                <Send size={24} />
              </button>
            </div>

            <button className="text-slate-900 transition hover:text-yellow-500">
              <Bookmark size={24} />
            </button>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-950">
            {post.likes || 0} {(post.likes || 0) === 1 ? 'like' : 'likes'}
          </p>

          {post.caption && (
            <p className="mt-2 text-sm leading-relaxed text-slate-800">
              <span className="font-semibold text-slate-950">
                {username}
              </span>{' '}
              {post.caption}
            </p>
          )}

          <button
            onClick={() => setShowComments(true)}
            className="mt-2 text-sm text-slate-500 hover:text-slate-800"
          >
            View {post.comments || 0} comments
          </button>
        </div>
      </motion.article>

      {showComments && (
        <CommentsModal
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          post={post}
        />
      )}
    </>
  )
}

export default PostCard
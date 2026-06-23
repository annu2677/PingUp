import { useEffect, useState } from 'react'
import { X, Send } from 'lucide-react'
import { getComments, addComment as saveComment } from './api/commentApi.js'
import { useAuth } from './AuthContext'
import { useSocial } from './SocialContext'

function CommentsModal({ post, onClose }) {
  const { user } = useAuth()
  const { addComment } = useSocial()

  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)

  const loadComments = async () => {
    if (!post?.id) return

    try {
      setLoading(true)

      const data = await getComments(post.id)

      setComments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [post?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) return

    if (!user?.id) {
      alert('Please login to comment')
      return
    }

    try {
      setPosting(true)

      const newComment = {
        postId: post.id,
        userId: user.id,
        userName: user.name || user.username || 'User',
        userAvatar: user.avatar || '',
        text: text.trim(),
      }

      const savedComment = await saveComment(newComment)

      setComments((prev) => [savedComment, ...prev])

      addComment(post.id, savedComment)

      setText('')
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Comment failed. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">Comments</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[400px] space-y-4 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-center text-slate-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-slate-500">
              No comments yet. Be the first one.
            </p>
          ) : (
            comments.map((comment) => {
              const commentName =
                comment.userName || comment.username || comment.name || 'User'

              const commentAvatar =
                comment.userAvatar ||
                comment.avatar ||
                commentName.charAt(0).toUpperCase()

              return (
                <div key={comment.id || comment._id} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-bold text-white">
                    {comment.userAvatar || comment.avatar ? (
                      <img
                        src={comment.userAvatar || comment.avatar}
                        alt={commentName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      commentAvatar
                    )}
                  </div>

                  <div className="flex-1 rounded-xl bg-slate-100 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-950">
                      {commentName}
                    </p>

                    <p className="text-sm text-slate-700">
                      {comment.text}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-slate-200 px-5 py-4"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-slate-950 outline-none"
          />

          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="rounded-full bg-blue-600 p-2 text-white disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default CommentsModal
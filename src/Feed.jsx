import { motion } from 'framer-motion'
import { useSocial } from './SocialContext'
import Storybar from './Storybar.jsx'
import PostCard from './PostCard.jsx'

function Feed() {
  const { posts } = useSocial()

  return (
    <section className="mx-auto w-full max-w-[640px]">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
          Home
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          See what people are sharing today.
        </p>
      </div>

      <Storybar />

      <div className="space-y-5">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            You're all caught up.
          </p>
        </div>
      )}

      {posts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="h-7 w-7 rounded-full border-2 border-slate-900 border-t-transparent"
            />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No posts yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Create your first post to start your feed.
          </p>
        </div>
      )}
    </section>
  )
}

export default Feed
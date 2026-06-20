import { motion } from 'framer-motion'
import { useSocial } from './SocialContext'
import Storybar from './Storybar.jsx'
import PostCard from './PostCard.jsx'

function Feed() {
  const { posts } = useSocial()

  return (
    <main className="flex-1 min-h-screen p-6 w-full">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Good morning, designer</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Your creative feed</h2>
          </div>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="action-button rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-300/20 border border-slate-200"
          >
            Discover trends
          </motion.button>
        </div>
      </div>

      <Storybar />

      <section className="space-y-5">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </section>

      {posts.length > 0 && (
        <div className="mt-10 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">End of the feed</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">You're all caught up</h3>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Explore trending topics, follow new creators, or tap the new post button to share something fresh with your community.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Create new post
            </button>
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Browse suggestions
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
          <p className="text-gray-500">Create your first post to start your feed!</p>
        </div>
      )}
    </main>
  );
}

export default Feed
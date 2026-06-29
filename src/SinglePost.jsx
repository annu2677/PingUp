import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PostCard from "./PostCard";
import { getPostById } from "./api/postApi";

function SinglePost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(postId);

        setPost({
          id: data.id,
          userId: data.userId,
          username: data.username,
          profilePicture: data.profilePicture,
          caption: data.content,
          image: data.imageUrl,
          timestamp: data.createdAt,
          likes: 0,
          comments: 0,
          liked: false,
        });
      } catch (error) {
        console.error("Error loading single post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5">
      <section className="mx-auto w-full max-w-[640px]">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-800">Loading post...</p>
          </div>
        )}

        {!loading && !post && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-red-600">Post not found</p>
            <p className="mt-2 text-xs text-slate-500">Post ID: {postId}</p>
          </div>
        )}

        {!loading && post && <PostCard post={post} index={0} />}
      </section>
    </main>
  );
}

export default SinglePost;
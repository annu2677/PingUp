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
  const [errorText, setErrorText] = useState("");

  const loadPost = async () => {
    try {
      console.log("OPENING POST ID FROM URL:", postId);

      const data = await getPostById(postId);

      console.log("POST DATA FROM BACKEND:", data);

      const formattedPost = {
        id: data.id || data._id,
        userId: data.userId,
        username: data.username,
        profilePicture: data.profilePicture,
        caption: data.content,
        image: data.imageUrl,
        timestamp: data.createdAt,
        likes: data.likes || 0,
        comments: data.comments || 0,
        liked: data.liked || false,
      };

      setPost(formattedPost);
    } catch (error) {
      console.error("Error loading single post:", error);
      setErrorText(error.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadPost();
    }
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

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-800">Loading post...</p>
          </div>
        ) : !post ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-red-600">Post not found</p>
            <p className="mt-2 text-xs text-slate-500">Post ID: {postId}</p>
            <p className="mt-1 text-xs text-slate-500">{errorText}</p>
          </div>
        ) : (
          <PostCard post={post} index={0} />
        )}
      </section>
    </main>
  );
}

export default SinglePost;
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PostCard from "./PostCard";
import { getPostById } from "./api/postApi";
import { getLikeCount, isPostLikedByUser } from "./api/likeApi";
import { getCommentCount } from "./api/commentApi";
import { useSocial } from "./SocialContext";

function SinglePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSocial();

  const postId = location.pathname.split("/post/")[1];

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const extractCount = (data) => {
    if (typeof data === "number") return data;
    if (typeof data === "string") return Number(data) || 0;
    if (typeof data === "object" && data !== null) {
      return Number(data.count || data.likes || data.comments || data.data || 0);
    }
    return 0;
  };

  const extractLiked = (data) => {
    if (typeof data === "boolean") return data;
    if (typeof data === "object" && data !== null) {
      return Boolean(data.liked || data.isLiked || data.data);
    }
    return false;
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        if (!postId) return;

        const data = await getPostById(postId);

        const [likeData, commentData, likedData] = await Promise.all([
          getLikeCount(postId),
          getCommentCount(postId),
          currentUser?.id ? isPostLikedByUser(postId, currentUser.id) : false,
        ]);

        console.log("LIKE DATA:", likeData);
        console.log("COMMENT DATA:", commentData);
        console.log("LIKED DATA:", likedData);

        setPost({
          id: data.id || data._id,
          userId: data.userId,
          username: data.username,
          profilePicture: data.profilePicture,
          caption: data.content,
          image: data.imageUrl,
          timestamp: data.createdAt,
          likes: extractCount(likeData),
          comments: extractCount(commentData),
          liked: extractLiked(likedData),
        });
      } catch (error) {
        console.error("Error loading single post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, currentUser?.id]);

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
          </div>
        ) : (
          <PostCard post={post} index={0} />
        )}
      </section>
    </main>
  );
}

export default SinglePost;
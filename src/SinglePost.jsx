import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSocial } from "./SocialContext";
import PostCard from "./PostCard";

function SinglePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts } = useSocial();

  const post = posts.find((p) => p.id === postId);

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

        {!post ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-800">Post not found</p>
          </div>
        ) : (
          <PostCard post={post} index={0} />
        )}
      </section>
    </main>
  );
}

export default SinglePost;
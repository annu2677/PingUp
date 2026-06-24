import { X, Send } from "lucide-react";

function StoryPreviewModal({ previewUrl, selectedFile, loading, onCancel, onPost }) {
  if (!previewUrl || !selectedFile) return null;

  const isVideo = selectedFile.type.startsWith("video");

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-[100000] flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60"
        >
          <X size={28} />
        </button>

        <p className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold">
          Preview Story
        </p>

        <div className="h-11 w-11" />
      </div>

      <div className="h-screen w-screen overflow-hidden">
        {isVideo ? (
          <video
            src={previewUrl}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt="story preview"
            className="h-full w-full object-contain"
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[100000] bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-6 pt-10">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-12 rounded-full bg-white/20 px-6 text-sm font-semibold text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onPost}
            disabled={loading}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black"
          >
            {loading ? "Posting..." : "Post Story"}
            {!loading && <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryPreviewModal;
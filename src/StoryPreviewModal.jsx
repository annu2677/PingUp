import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";

function StoryPreviewModal({
  previewUrl,
  selectedFile,
  loading,
  onCancel,
  onPost,
}) {
  if (!previewUrl || !selectedFile) return null;

  const isVideo = selectedFile.type.startsWith("video");

  return createPortal(
    <div className="fixed inset-0 z-[999999] h-[100dvh] w-screen overflow-hidden bg-black text-white">
      <div className="fixed left-0 right-0 top-0 z-[1000000] flex items-center justify-between bg-black px-5 py-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="text-white disabled:opacity-60"
        >
          <X size={34} />
        </button>

        <p className="text-base font-bold text-white">Preview Story</p>

        <div className="w-9" />
      </div>

      <div className="flex h-[100dvh] w-screen items-center justify-center px-0 pb-24 pt-20">
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

      <div className="fixed bottom-0 left-0 right-0 z-[1000000] bg-gradient-to-t from-black via-black/95 to-transparent px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-12 rounded-full bg-white/20 px-6 text-sm font-semibold text-white disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onPost}
            disabled={loading}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Story"}
            {!loading && <Send size={18} />}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default StoryPreviewModal;
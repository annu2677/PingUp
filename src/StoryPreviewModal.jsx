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

  return (
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-hidden bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
        >
          <X size={28} />
        </button>

        <p className="rounded-full bg-black/40 px-4 py-2 text-sm font-semibold backdrop-blur">
          Preview
        </p>

        <div className="h-11 w-11" />
      </div>

      <div className="flex h-full w-full items-center justify-center px-2 pb-24 pt-20">
        {isVideo ? (
          <video
            src={previewUrl}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="max-h-full max-w-full rounded-2xl object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt="story preview"
            className="max-h-full max-w-full rounded-2xl object-contain"
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/80 px-4 pb-5 pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-[640px] items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-12 rounded-full bg-white/15 px-6 text-sm font-semibold text-white disabled:opacity-60"
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
    </div>
  );
}

export default StoryPreviewModal;
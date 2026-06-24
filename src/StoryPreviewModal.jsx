import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={onCancel} className="text-white">
          <X size={30} />
        </button>

        <p className="text-sm font-semibold text-white">Preview Story</p>

        <div className="w-8" />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-3">
        {isVideo ? (
          <video
            src={previewUrl}
            controls
            autoPlay
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt="story preview"
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-5">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-full bg-slate-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          onClick={onPost}
          disabled={loading}
          className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post Story"}
        </button>
      </div>
    </div>
  );
}

export default StoryPreviewModal;
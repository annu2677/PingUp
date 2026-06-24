import { useEffect, useRef, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { deleteStory } from "./api/storyApi";

function StoryViewer({ activeUserStories, onClose, onStoryDeleted }) {
  const { user } = useAuth();

  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const videoRef = useRef(null);

  const stories = activeUserStories?.stories || [];
  const currentStory = stories[storyIndex];

  const currentUserId = user?.id || user?._id;
  const isOwnStory = currentStory?.userId === currentUserId;

  const markStoryAsSeen = (storyId) => {
    const seen = JSON.parse(localStorage.getItem("seenStories") || "[]");

    if (!seen.includes(storyId)) {
      localStorage.setItem("seenStories", JSON.stringify([...seen, storyId]));
    }
  };

  const closeViewer = () => {
    setStoryIndex(0);
    setProgress(0);
    onClose();
  };

  const nextStory = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      closeViewer();
    }
  };

  const previousStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleDeleteStory = async () => {
    if (!currentStory?.id) return;

    const confirmDelete = window.confirm("Delete this story?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);

      await deleteStory(currentStory.id);

      if (onStoryDeleted) {
        await onStoryDeleted();
      }

      if (stories.length === 1) {
        closeViewer();
      } else if (storyIndex === stories.length - 1) {
        setStoryIndex((prev) => prev - 1);
      } else {
        setStoryIndex((prev) => prev);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Story could not be deleted");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    setStoryIndex(0);
    setProgress(0);
  }, [activeUserStories]);

  useEffect(() => {
    if (currentStory?.id) {
      markStoryAsSeen(currentStory.id);
    }
  }, [currentStory?.id]);

  useEffect(() => {
    if (!currentStory) return;

    setProgress(0);

    if (currentStory.mediaType === "video") return;

    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          nextStory();
          return 100;
        }

        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [storyIndex, currentStory?.id]);

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    setProgress((video.currentTime / video.duration) * 100);
  };

  if (!activeUserStories || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-30 px-3 pt-4">
        <div className="mb-4 flex gap-1">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    index < storyIndex
                      ? "100%"
                      : index === storyIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                activeUserStories.userAvatar ||
                `https://ui-avatars.com/api/?name=${
                  activeUserStories.username || "User"
                }`
              }
              alt={activeUserStories.username}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-semibold">
                {activeUserStories.username}
              </p>
              <p className="text-xs text-white/70">
                {storyIndex + 1} / {stories.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwnStory && (
              <button
                onClick={handleDeleteStory}
                disabled={deleting}
                className="rounded-full bg-white/15 p-2 text-white disabled:opacity-60"
              >
                <Trash2 size={21} />
              </button>
            )}

            <button onClick={closeViewer}>
              <X size={30} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-center">
        {currentStory.mediaType === "video" ? (
          <video
            ref={videoRef}
            key={currentStory.id}
            src={currentStory.mediaUrl}
            autoPlay
            playsInline
            controls={false}
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={nextStory}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <img
            key={currentStory.id}
            src={currentStory.mediaUrl}
            alt="story"
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      <button
        onClick={previousStory}
        className="absolute left-0 top-0 h-full w-1/2"
      />

      <button
        onClick={nextStory}
        className="absolute right-0 top-0 h-full w-1/2"
      />
    </div>
  );
}

export default StoryViewer;
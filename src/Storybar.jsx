import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "./AuthContext";
import { getStories, createStory } from "./api/storyApi";

function StoryBar() {
  const { user } = useAuth();

  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading stories:", error);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleAddStory = async () => {
    const mediaUrl = prompt("Paste image/video URL for your story:");

    if (!mediaUrl) return;

    if (!user) {
      alert("Please login first");
      return;
    }

    const newStory = {
      userId: user.id || user._id,
      username: user.name || user.username || "User",
      userAvatar:
        user.profilePic ||
        user.avatar ||
        "https://ui-avatars.com/api/?name=User",
      mediaUrl,
      mediaType: mediaUrl.includes(".mp4") ? "video" : "image",
    };

    try {
      setLoading(true);
      await createStory(newStory);
      await loadStories();
    } catch (error) {
      console.error("Error creating story:", error);
      alert("Story could not be added");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
        <div className="flex gap-4">

          <div
            onClick={handleAddStory}
            className="flex flex-col items-center cursor-pointer min-w-[70px]"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
              <Plus size={26} />
            </div>
            <p className="text-xs mt-1">
              {loading ? "Adding..." : "Your Story"}
            </p>
          </div>

          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center cursor-pointer min-w-[70px]"
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <img
                  src={story.userAvatar}
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="text-xs mt-1 max-w-[70px] truncate">
                {story.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedStory && (
        <div
          onClick={() => setSelectedStory(null)}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="relative w-full max-w-md h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-5 right-5 text-white text-3xl z-50"
            >
              ×
            </button>

            <div className="absolute top-5 left-5 flex items-center gap-3 z-50">
              <img
                src={selectedStory.userAvatar}
                alt={selectedStory.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white font-semibold">
                {selectedStory.username}
              </span>
            </div>

            {selectedStory.mediaType === "video" ? (
              <video
                src={selectedStory.mediaUrl}
                controls
                autoPlay
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={selectedStory.mediaUrl}
                alt="story"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default StoryBar;
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useAuth } from "./AuthContext";
import { getStories, createStory } from "./api/storyApi";

function StoryBar() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStories = async () => {
    try {
      const data = await getStories();
      console.log("STORIES FROM BACKEND:", data);
      setStories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading stories:", error);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleChooseFile = () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("userId", user.id || user._id);
    formData.append("username", user.name || user.username || "User");
    formData.append(
      "userAvatar",
      user.profilePic ||
        user.avatar ||
        `https://ui-avatars.com/api/?name=${user.name || "User"}`
    );

    try {
      setLoading(true);
      await createStory(formData);
      await loadStories();
      alert("Story added successfully");
    } catch (error) {
      console.error("Error uploading story:", error);
      alert("Story upload failed");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };
  console.log("CURRENT STORIES:", stories);
  return (
    <>
      <div className="w-full overflow-x-auto bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
        <div className="flex gap-4">
          <div
            onClick={handleChooseFile}
            className="flex flex-col items-center cursor-pointer min-w-[70px]"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
              <Plus size={26} />
            </div>

            <p className="text-xs mt-1">
              {loading ? "Uploading..." : "Your Story"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                       console.log("CLICKED STORY:", story);
                        setSelectedStory(story);
                     }}
              className="flex flex-col items-center cursor-pointer min-w-[70px]"
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <img
                  src={
                    story.userAvatar ||
                    `https://ui-avatars.com/api/?name=${story.username || "User"}`
                  }
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
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedStory(null)}
            className="absolute top-5 right-5 text-white z-50"
          >
            <X size={32} />
          </button>

          <div className="absolute top-5 left-5 flex items-center gap-3 z-50">
            <img
              src={
                selectedStory.userAvatar ||
                `https://ui-avatars.com/api/?name=${selectedStory.username || "User"}`
              }
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
              autoPlay
              controls
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <img
              src={selectedStory.mediaUrl}
              alt="story"
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      )}
    </>
  );
}

export default StoryBar;
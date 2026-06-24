import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "./AuthContext";
import { getStories, createStory } from "./api/storyApi";
import StoryPreviewModal from "./StoryPreviewModal";
import StoryViewer from "./StoryViewer";

function Storybar() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [stories, setStories] = useState([]);
  const [activeUserStories, setActiveUserStories] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const groupedStories = useMemo(() => {
    const map = new Map();

    stories.forEach((story) => {
      const key = story.userId || story.username;

      const profilePicture =
        story.profilePicture ||
        story.userProfilePicture ||
        story.userAvatar ||
        story.avatar ||
        "";

      if (!map.has(key)) {
        map.set(key, {
          userId: story.userId,
          username: story.username || "User",
          userAvatar: profilePicture,
          stories: [],
        });
      }

      map.get(key).stories.push({
        ...story,
        userAvatar: profilePicture,
      });
    });

    return Array.from(map.values()).map((group) => ({
      ...group,
      stories: group.stories.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ),
    }));
  }, [stories]);

  const handleChooseFile = () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    event.target.value = "";
  };

  const cancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const uploadStory = async () => {
    if (!selectedFile || !user) return;

    const username = user.username || user.name || "User";

    const profilePicture =
      user.profilePicture ||
      user.profilePic ||
      user.avatar ||
      "";

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("userId", user.id || user._id);
    formData.append("username", username);
    formData.append("userAvatar", profilePicture);
    formData.append("profilePicture", profilePicture);
    formData.append("userProfilePicture", profilePicture);

    try {
      setLoading(true);

      await createStory(formData);
      await loadStories();

      cancelPreview();
    } catch (error) {
      console.error("Error uploading story:", error);
      alert("Story upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex gap-4">
          <div
            onClick={handleChooseFile}
            className="flex min-w-[74px] cursor-pointer flex-col items-center"
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-400 bg-slate-50">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Plus size={26} />
              )}
            </div>

            <p className="mt-1 max-w-[74px] truncate text-xs font-medium text-slate-700">
              {loading ? "Posting..." : "Your Story"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {groupedStories.map((group) => {
            const currentUserId = user?.id || user?._id;
            const seenKey = `seenStories_${currentUserId}`;
            const seenStories = JSON.parse(
              localStorage.getItem(seenKey) || "[]"
            );

            const hasUnseenStory = group.stories.some(
              (story) => !seenStories.includes(story.id)
            );

            const fallbackInitial =
              group.username?.charAt(0).toUpperCase() || "U";

            return (
              <div
                key={group.userId || group.username}
                onClick={() => setActiveUserStories(group)}
                className="flex min-w-[74px] cursor-pointer flex-col items-center"
              >
                <div
                  className={`h-16 w-16 rounded-full p-[2px] ${
                    hasUnseenStory
                      ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                      : "bg-slate-300"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-900 text-white font-bold">
                    {group.userAvatar ? (
                      <img
                        src={group.userAvatar}
                        alt={group.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      fallbackInitial
                    )}
                  </div>
                </div>

                <p className="mt-1 max-w-[74px] truncate text-xs font-medium text-slate-700">
                  {group.username}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <StoryPreviewModal
        previewUrl={previewUrl}
        selectedFile={selectedFile}
        loading={loading}
        onCancel={cancelPreview}
        onPost={uploadStory}
      />

      <StoryViewer
        activeUserStories={activeUserStories}
        onClose={() => {
          setActiveUserStories(null);
          loadStories();
        }}
        onStoryDeleted={loadStories}
      />
    </>
  );
}

export default Storybar;
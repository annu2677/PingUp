const API_URL = import.meta.env.VITE_API_URL;

export const getStories = async () => {
  const response = await fetch(`${API_URL}/stories`);

  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }

  return response.json();
};

export const createStory = async (storyData) => {
  const response = await fetch(`${API_URL}/stories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storyData),
  });

  if (!response.ok) {
    throw new Error("Failed to create story");
  }

  return response.json();
};

export const deleteStory = async (storyId) => {
  const response = await fetch(`${API_URL}/stories/${storyId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete story");
  }
};
const API_URL = `${import.meta.env.VITE_API_URL}/comments`;

export const addComment = async (commentData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commentData)
  });

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }

  return response.json();
};

export const getComments = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
};

export const getCommentCount = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}/count`);

  if (!response.ok) {
    throw new Error("Failed to fetch comment count");
  }

  return response.json();
};
const API_URL = "http://localhost:9999/api/likes";

export const toggleLike = async (postId, userId) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });

  return response.json();
};

export const getLikeCount = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}/count`);
  return response.json();
};

export const isPostLikedByUser = async (postId, userId) => {
  const response = await fetch(`${API_URL}/${postId}/liked/${userId}`);
  return response.json();
};

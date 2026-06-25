const API_URL = import.meta.env.VITE_API_URL + "/follows";

export const toggleFollow = async (followerId, followingId) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followerId,
      followingId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to follow/unfollow");
  }

  return data;
};

export const getFollowersCount = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}/followers/count`);
  const data = await response.json();
  return data.count || 0;
};

export const getFollowingCount = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}/following/count`);
  const data = await response.json();
  return data.count || 0;
};

export const isFollowingUser = async (followerId, followingId) => {
  const response = await fetch(
    `${API_URL}/status?followerId=${followerId}&followingId=${followingId}`
  );

  const data = await response.json();
  return data.following || false;
};
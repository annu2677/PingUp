export const getPosts = async () => {
  const response = await fetch(`/api/posts`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return Array.isArray(data)
    ? data
    : data.posts || data.data || [];
};

export const createPost = async (postData) => {
  const response = await fetch(`/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }

  return data;
};

export const getPosts = async () => {
  const response = await fetch(`/api/posts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  console.log("POSTS FROM BACKEND:", data);

  return Array.isArray(data) ? data : data.posts || [];
};

export const createPostAPI = async (postData) => {
  try {
    const response = await fetch(`/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Backwards-compatible alias
export const createPost = createPostAPI;
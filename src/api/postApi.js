const API_URL = "https://pingup-backend-u6df.onrender.com/api";
export const getPosts = async () => {
  console.log("POST API URL =", `${API_URL}/posts`);
  const response = await fetch(`${API_URL}/posts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return Array.isArray(data) ? data : data.posts || data.data || [];
};

export const createPost = async (postData) => {
  const response = await fetch(`${API_URL}/posts`, {
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

export const createPostAPI = createPost;
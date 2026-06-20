const API_URL = "http://localhost:9999/api/posts";

export const getPosts = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });
  return response.json();
};

const API_URL = import.meta.env.VITE_API_URL;

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const getConversations = async (userId) => {
  const response = await fetch(`${API_URL}/conversations/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return response.json();
};

export const getOrCreateConversation = async (userId1, userId2) => {
  const response = await fetch(`${API_URL}/conversations/between/${userId1}/${userId2}`);

  if (!response.ok) {
    throw new Error("Failed to get conversation");
  }

  return response.json();
};

export const getMessages = async (conversationId) => {
  const response = await fetch(`${API_URL}/messages/${conversationId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
};

export const sendMessage = async ({ senderId, receiverId, text }) => {
  console.log("SENDING MESSAGE:", { senderId, receiverId, text });

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderId, receiverId, text }),
  });

  const responseText = await response.text();

  console.log("MESSAGE RESPONSE STATUS:", response.status);
  console.log("MESSAGE RESPONSE TEXT:", responseText);

  if (!response.ok) {
    throw new Error(responseText || "Failed to send message");
  }

  return responseText ? JSON.parse(responseText) : null;
};

export const markMessagesAsRead = async (conversationId, receiverId) => {
  const response = await fetch(`${API_URL}/messages/${conversationId}/read/${receiverId}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark messages as read");
  }
};
const API_URL = import.meta.env.VITE_API_URL;

export const getNotifications = async (userId) => {
  const response = await fetch(`${API_URL}/notifications/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
};

export const getUnreadNotificationCount = async (userId) => {
  const response = await fetch(`${API_URL}/notifications/${userId}/unread-count`);

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
};
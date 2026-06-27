import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
} from "./api/notificationApi";

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      const data = await getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const handleRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getIcon = (type) => {
    if (type === "LIKE") return <Heart size={20} />;
    if (type === "COMMENT") return <MessageCircle size={20} />;
    if (type === "FOLLOW") return <UserPlus size={20} />;
    return <Bell size={20} />;
  };

  if (loading) {
    return <div className="p-6 text-white">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleRead(notification.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer ${
                notification.read ? "bg-zinc-900" : "bg-zinc-800"
              }`}
            >
              {notification.senderProfilePicture ? (
                <img
                  src={notification.senderProfilePicture}
                  alt={notification.senderUsername}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                  {notification.senderUsername?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="flex-1">
                <p>{notification.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-gray-300">{getIcon(notification.type)}</div>

              {!notification.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
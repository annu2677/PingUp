import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
} from "./api/notificationApi";

function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      );

      if (notification.type === "LIKE" || notification.type === "COMMENT") {
        navigate(`/post/${notification.postId}`);
      } else if (notification.type === "FOLLOW") {
        navigate(`/profile/${notification.senderUserId}`);
      }
    } catch (error) {
      console.error("Error opening notification:", error);
    }
  };

  const getIcon = (type) => {
    if (type === "LIKE") return <Heart size={20} />;
    if (type === "COMMENT") return <MessageCircle size={20} />;
    if (type === "FOLLOW") return <UserPlus size={20} />;
    return <Bell size={20} />;
  };

  if (loading) {
    return <div className="p-6 text-slate-700">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-slate-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-sm transition hover:bg-white ${
                notification.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              {notification.senderProfilePicture ? (
                <img
                  src={notification.senderProfilePicture}
                  alt={notification.senderUsername}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                  {notification.senderUsername?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-slate-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-slate-500">{getIcon(notification.type)}</div>

              {!notification.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
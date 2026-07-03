import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Send, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthContext";
import {getAllUsers, getConversations, getOrCreateConversation, getMessages, sendMessage, markMessagesAsRead, } from "./api/messageApi.js";

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUserId = user?.id;

  const formatTime = (date) => {
  if (!date) return "";

  const d = new Date(date.endsWith("Z") ? date : `${date}Z`);
  const now = new Date();
  const diff = (now - d) / 1000;

  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return "Yesterday";

  return d.toLocaleDateString("en-IN");
  };

  const formatMessageTime = (date) => {
  if (!date) return "";

  const fixedDate = date.endsWith("Z") ? date : `${date}Z`;

  return new Date(fixedDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    });
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();

      const usersArray = Array.isArray(data)
        ? data
        : data.users || data.data || data.content || [];

      setAllUsers(
        usersArray.filter((item) => (item.id || item._id) !== currentUserId)
      );
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadConversations = async () => {
    if (!currentUserId) return;

    try {
      const data = await getConversations(currentUserId);
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadConversations();
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allUsers.filter((item) =>
      (item.username || item.name || item.email || "")
        .toLowerCase()
        .includes(q)
    );
  }, [allUsers, searchQuery]);

  const getOtherUserId = (conversation) => {
    return conversation.participantIds?.find((id) => id !== currentUserId);
  };

  const findUserById = (userId) => {
    return allUsers.find((item) => (item.id || item._id) === userId);
  };

  const conversationUsers = conversations.map((conversation) => {
      const otherUserId = getOtherUserId(conversation);
      const otherUser = findUserById(otherUserId);

      return {
        conversation,
        otherUserId,
        otherUser,
      };
    })
    .filter((item) => item.otherUser);

  const openChat = async (otherUser) => {
    const otherUserId = otherUser.id || otherUser._id;
    if (!currentUserId || !otherUserId) return;

    try {
      setSelectedUser(otherUser);
      setLoadingMessages(true);

      const conversation = await getOrCreateConversation(
        currentUserId,
        otherUserId
      );

      setSelectedConversation(conversation);

      const messages = await getMessages(conversation.id);
      setChatMessages(Array.isArray(messages) ? messages : []);

      await markMessagesAsRead(conversation.id, currentUserId);

      const updatedMessages = await getMessages(conversation.id);
      setChatMessages(Array.isArray(updatedMessages) ? updatedMessages : []);

      await loadConversations();
    } catch (error) {
      console.error("Error opening chat:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
     if (!selectedConversation?.id) return;

       const interval = setInterval(async () => {
         try {
           const updatedMessages = await getMessages(selectedConversation.id);
           setChatMessages(Array.isArray(updatedMessages) ? updatedMessages : []);
         } catch (error) {
         console.error("Error refreshing messages:", error);
       } 
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    try {
      const savedMessage = await sendMessage({
        senderId: currentUserId,
        receiverId: selectedUser.id || selectedUser._id,
        text: newMessage.trim(),
      });

      setChatMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");

      await loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Message failed. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[100vh] bg-white">
      <div
        className={`w-full border-r border-slate-200 md:w-[360px] ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
        <div className="border-b border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-full p-2 hover:bg-slate-100 md:hidden"
            >
              <ArrowLeft size={20} />
            </button>

            <h1 className="text-xl font-bold text-slate-950">Messages</h1>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="h-[calc(100vh-104px)] overflow-y-auto">
          {searchQuery.trim() ? (
            filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No users found.
              </div>
            ) : (
              filteredUsers.map((chatUser) => (
                <button
                  key={chatUser.id || chatUser._id}
                  onClick={() => openChat(chatUser)}
                  className="flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50"
                >
                  <Avatar user={chatUser} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {chatUser.username || chatUser.name || "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {chatUser.email}
                    </p>
                  </div>
                </button>
              ))
            )
          ) : conversationUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Search a user to start chatting.
            </div>
          ) : (
            conversationUsers.map(({ conversation, otherUser }) => (
              <button
                key={conversation.id}
                onClick={() => openChat(otherUser)}
                className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <Avatar user={otherUser} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {otherUser.username || otherUser.name || "User"}
                    </p>

                    <p className="shrink-0 text-[11px] text-slate-400">
                      {formatTime(conversation.lastMessageAt)}
                    </p>
                  </div>

                  <p className="truncate text-xs text-slate-500">
                    {conversation.lastMessage || "Start chatting"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col ${selectedUser ? "flex" : "hidden md:flex"}`}
      >
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-full p-2 hover:bg-slate-100 md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>

                <Avatar user={selectedUser} />

                <div>
                  <h3 className="font-semibold text-slate-950">
                    {selectedUser.username || selectedUser.name || "User"}
                  </h3>
                  <p className="text-xs text-slate-500">PingUp user</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
              {loadingMessages ? (
                <p className="text-center text-sm text-slate-500">
                  Loading messages...
                </p>
              ) : chatMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                      👋
                    </div>
                    <p className="font-semibold text-slate-800">
                      No messages yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Send the first message and start your conversation.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((message) => {
                    const mine = message.senderId === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            mine
                              ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white"
                              : "bg-white text-slate-800 shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>

                          <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-blue-100" : "text-slate-400"}`}
>
                          <span>{formatMessageTime(message.createdAt)}</span>

                          {mine && (
                          <span>
                          {message.read ? "✓✓ Seen" : "✓ Sent"}
                          </span>
                          )}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-full bg-blue-600 p-3 text-white transition hover:bg-blue-700 active:scale-95 disabled:bg-slate-300"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-slate-50">
            <div className="text-center text-slate-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Send size={24} />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-800">
                Your Messages
              </h3>
              <p className="text-sm">Search a user and start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ user }) {
  const image = user?.profilePicture || user?.avatar || "";
  const name = user?.username || user?.name || "User";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-bold text-white">
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}
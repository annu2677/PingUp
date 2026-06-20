import { getPosts, createPost as savePost } from "./api/postApi";
import { toggleLike, getLikeCount, isPostLikedByUser } from "./api/likeApi";
import { useAuth } from "./AuthContext";
import { createContext, useState, useContext, useEffect } from 'react'

const SocialContext = createContext()

export function SocialProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])

  const { user } = useAuth();

  // Load posts when user changes
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      loadPosts();
    }
  }, [user]);

  // Fetch posts from backend
  const loadPosts = async () => {
    try {
      const data = await getPosts();

      const formattedPosts = await Promise.all(data.map(async (post) => {
        const likes = await getLikeCount(post.id);
        const liked = currentUser
          ? await isPostLikedByUser(post.id, currentUser.id)
          : false;

        return {
          id: post.id,
          user: {
            id: post.userId || 1,
            username: post.username,
            name: post.username,
            avatar: post.username?.charAt(0).toUpperCase()
          },
          image: post.imageUrl,
          caption: post.content,
          likes: likes,
          comments: 0,
          timestamp: post.createdAt ? new Date(post.createdAt) : new Date(),
          liked: liked,
          hashtags: [],
          commentsList: []
        };
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  // Create new post
  const createPost = async (image, caption) => {
    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    try {
      const backendPost = {
        username: currentUser.username,
        content: caption,
        imageUrl: image
      };

      const savedPost = await savePost(backendPost);

      const newPost = {
        id: savedPost.id,
        user: currentUser,
        image: savedPost.imageUrl,
        caption: savedPost.content,
        likes: 0,
        comments: 0,
        timestamp: new Date(savedPost.createdAt),
        liked: false,
        hashtags: [],
        commentsList: []
      };

      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Like/unlike a post
  const likePost = async (postId) => {
  if (!currentUser) return

  const totalLikes = await toggleLike(postId, currentUser.id)

  setPosts(prev =>
    prev.map(post =>
      post.id === postId
        ? {
            ...post,
            likes: totalLikes,
            liked: totalLikes > post.likes
          }
        : post
    )
  )
}
  // Add comment to post
  const addComment = (postId, text) => {
    const newComment = {
      id: Date.now(),
      user: currentUser,
      text,
      timestamp: new Date()
    }

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [...post.commentsList, newComment]
        }
      }
      return post
    }))
  };

  // Send message to user
  const sendMessage = (userId, text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: currentUser,
      receiver: users.find(user => user.id === Number(userId)) || null,
      timestamp: new Date(),
      read: true
    }

    setMessages(prev => ({
      ...prev,
      [userId]: prev[userId] ? [...prev[userId], newMessage] : [newMessage]
    }))
  };

  // Follow user
  const followUser = (userId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, followers: user.followers + 1 }
      }
      return user
    }))

    setCurrentUser(prev => ({ ...prev, following: prev.following + 1 }))
  };

  // Search users
  const searchUsers = (query) => {
    return users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase())
    )
  };

  // Get posts by user
  const getUserPosts = (userId) => {
    return posts.filter(post => post.user.id === userId)
  };

  return (
    <SocialContext.Provider value={{
      posts,
      users,
      messages,
      currentUser,
      notifications,
      createPost,
      likePost,
      addComment,
      sendMessage,
      followUser,
      searchUsers,
      getUserPosts
    }}>
      {children}
    </SocialContext.Provider>
  )
}

export function useSocial() {
  const context = useContext(SocialContext)
  if (!context) {
    throw new Error('useSocial must be used within SocialProvider')
  }
  return context
}

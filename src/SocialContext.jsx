import { getPosts, createPost as savePost } from './api/postApi.js'
import { toggleLike, getLikeCount, isPostLikedByUser } from './api/likeApi.js'
import { getCommentCount } from './api/commentApi.js'
import { useAuth } from './AuthContext'
import { createContext, useState, useContext, useEffect, useCallback } from 'react'

const SocialContext = createContext()

export function SocialProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState({})
  const [notifications, _setNotifications] = useState([])

  const { user } = useAuth()

  const loadPosts = useCallback(async () => {
    console.log('LOAD POSTS CALLED')

    try {
      const rawResponse = await getPosts()

      const data = Array.isArray(rawResponse)
        ? rawResponse
        : rawResponse?.posts || rawResponse?.data || []

      console.log('RAW POSTS FROM BACKEND:', data)

      const formattedPosts = await Promise.all(
        data.map(async (post) => {
          const postId = post.id || post._id

          const postUser = post.user || {
            id: post.userId || post.user?._id || post._id || 1,
            username: post.username || post.user?.username || 'Unknown',
            name: post.name || post.user?.name || post.username || 'Unknown',
            avatar: post.avatar || post.user?.avatar || '',
          }

          let likes = 0
          let liked = false
          let commentCount = 0

          try {
            likes = await getLikeCount(postId)
          } catch (err) {
            console.error('Like count failed for post:', postId, err)
          }

          try {
            liked = user ? await isPostLikedByUser(postId, user.id) : false
          } catch (err) {
            console.error('Liked status failed for post:', postId, err)
          }

          try {
            commentCount = await getCommentCount(postId)
          } catch (err) {
            console.error('Comment count failed for post:', postId, err)
          }

          const caption = post.content || post.caption || post.body || ''
          const image = post.imageUrl || post.image || ''
          const timestampValue =
            post.createdAt || post.timestamp || post.date || new Date()

          return {
            id: postId,
            user: {
              id: postUser.id,
              username: postUser.username || postUser.name || 'Unknown',
              name: postUser.name || postUser.username || 'Unknown',
              avatar:
                postUser.avatar ||
                postUser.username?.charAt(0).toUpperCase() ||
                postUser.name?.charAt(0).toUpperCase() ||
                'U',
            },
            image,
            caption,
            likes,
            comments: Number(commentCount) || 0,
            timestamp: timestampValue ? new Date(timestampValue) : new Date(),
            liked,
            hashtags: [],
            commentsList: [],
          }
        })
      )

      console.log('FORMATTED POSTS:', formattedPosts)
      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }, [user])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const createPost = async (image, caption) => {
    if (!user) {
      console.error('No current user found')
      return
    }

    try {
      const backendPost = {
        userId: user.id,
        username: user.username,
        content: caption,
        imageUrl: image,
      }

      const savedPost = await savePost(backendPost)

      const newPost = {
        id: savedPost.id || savedPost._id,
        user: {
          id: user.id,
          username: user.username,
          name: user.name || user.username,
          avatar:
            user.avatar ||
            user.username?.charAt(0).toUpperCase() ||
            user.name?.charAt(0).toUpperCase() ||
            'U',
        },
        image: savedPost.imageUrl,
        caption: savedPost.content,
        likes: 0,
        comments: 0,
        timestamp: savedPost.createdAt
          ? new Date(savedPost.createdAt)
          : new Date(),
        liked: false,
        hashtags: [],
        commentsList: [],
      }

      setPosts((prev) => [newPost, ...prev])
      return newPost
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const likePost = async (postId) => {
    if (!user) return

    let previousState = null

    try {
      console.log('likePost called for', postId, 'by user', user?.id)

      setPosts((prev) =>
        prev.map((post) => {
          if (String(post.id) === String(postId)) {
            previousState = { ...post }

            const newLiked = !post.liked
            const newLikes = newLiked
              ? post.likes + 1
              : Math.max(0, post.likes - 1)

            return {
              ...post,
              liked: newLiked,
              likes: newLikes,
            }
          }

          return post
        })
      )

      console.log('attempting toggleLike API call for', postId)

      let totalLikes = await toggleLike(postId, user.id)

      console.log('toggleLike response for', postId, totalLikes)

      if (typeof totalLikes === 'object' && totalLikes !== null) {
        totalLikes =
          totalLikes.count ??
          totalLikes.Count ??
          totalLikes.total ??
          totalLikes.likes ??
          0
      }

      totalLikes = Number(totalLikes) || 0

      const finalLiked = await isPostLikedByUser(postId, user.id)

      setPosts((prev) =>
        prev.map((post) =>
          String(post.id) === String(postId)
            ? {
                ...post,
                likes: totalLikes,
                liked: Boolean(finalLiked),
              }
            : post
        )
      )
    } catch (err) {
      console.error('Error toggling like for', postId, err)

      try {
        await new Promise((res) => setTimeout(res, 350))

        console.log('Retrying toggleLike for', postId)

        let totalLikesRetry = await toggleLike(postId, user.id)

        if (typeof totalLikesRetry === 'object' && totalLikesRetry !== null) {
          totalLikesRetry =
            totalLikesRetry.count ??
            totalLikesRetry.Count ??
            totalLikesRetry.total ??
            totalLikesRetry.likes ??
            0
        }

        totalLikesRetry = Number(totalLikesRetry) || 0

        const finalLikedRetry = await isPostLikedByUser(postId, user.id)

        setPosts((prev) =>
          prev.map((post) =>
            String(post.id) === String(postId)
              ? {
                  ...post,
                  likes: totalLikesRetry,
                  liked: Boolean(finalLikedRetry),
                }
              : post
          )
        )

        return
      } catch (err2) {
        console.error('Retry failed for toggleLike', postId, err2)
      }

      setPosts((prev) =>
        prev.map((post) =>
          String(post.id) === String(postId) && previousState
            ? previousState
            : post
        )
      )
    }
  }

  const addComment = (postId, savedComment) => {
    if (!user) return

    setPosts((prev) =>
      prev.map((post) => {
        if (String(post.id) === String(postId)) {
          return {
            ...post,
            comments: Number(post.comments || 0) + 1,
            commentsList: savedComment
              ? [...post.commentsList, savedComment]
              : post.commentsList,
          }
        }

        return post
      })
    )
  }

  const sendMessage = (userId, text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: user,
      receiver: users.find((user) => user.id === Number(userId)) || null,
      timestamp: new Date(),
      read: true,
    }

    setMessages((prev) => ({
      ...prev,
      [userId]: prev[userId] ? [...prev[userId], newMessage] : [newMessage],
    }))
  }

  const followUser = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, followers: user.followers + 1 }
          : user
      )
    )
  }

  const unfollowUser = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, followers: user.followers - 1 }
          : user
      )
    )
  }

  const searchUsers = (query) => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  const getUserPosts = (userId) => {
    return posts.filter((post) => String(post.user.id) === String(userId))
  }

  return (
    <SocialContext.Provider
      value={{
        posts,
        users,
        messages,
        currentUser: user,
        notifications,
        createPost,
        likePost,
        addComment,
        sendMessage,
        followUser,
        unfollowUser,
        searchUsers,
        getUserPosts,
      }}
    >
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
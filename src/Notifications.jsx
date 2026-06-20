import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, AtSign, Settings } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function Notifications() {
  const { notifications } = useSocial()
  const [filter, setFilter] = useState('all') // 'all', 'likes', 'comments', 'follows', 'mentions'

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />
      case 'comment':
        return <MessageCircle size={20} className="text-blue-500" />
      case 'follow':
        return <UserPlus size={20} className="text-green-500" />
      case 'mention':
        return <AtSign size={20} className="text-purple-500" />
      default:
        return <Heart size={20} className="text-gray-500" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    return notification.type === filter
  })

  const NotificationItem = ({ notification }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {notification.user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getNotificationIcon(notification.type)}
            <span className="font-semibold text-sm">{notification.user.username}</span>
            <span className="text-sm text-gray-600">{notification.message}</span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(notification.timestamp).toLocaleDateString()} at{' '}
            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {notification.post && (
            <div className="mt-2 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={notification.post.image}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'likes', label: 'Likes', count: notifications.filter(n => n.type === 'like').length },
            { key: 'comments', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
            { key: 'follows', label: 'Follows', count: notifications.filter(n => n.type === 'follow').length },
            { key: 'mentions', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p>When someone likes or comments on your posts, you'll see it here.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>

      {/* Today's Activity Summary */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Today's Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {notifications.filter(n => n.type === 'like' && new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
              </div>
              <div className="text-xs text-gray-500">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {notifications.filter(n => n.type === 'comment' && new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
              </div>
              <div className="text-xs text-gray-500">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {notifications.filter(n => n.type === 'follow' && new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
              </div>
              <div className="text-xs text-gray-500">New Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {notifications.filter(n => n.type === 'mention' && new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
              </div>
              <div className="text-xs text-gray-500">Mentions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

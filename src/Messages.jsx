import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Send, Phone, Video, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { useSocial } from './SocialContext'

export default function Messages() {
  const navigate = useNavigate()
  const { messages, sendMessage, currentUser } = useSocial()
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Get unique conversations
  const conversations = Object.keys(messages).map(userId => {
    const userMessages = messages[userId]
    const lastMessage = userMessages[userMessages.length - 1]
    return {
      userId,
      user: lastMessage?.sender || lastMessage?.receiver,
      lastMessage: lastMessage?.text || '',
      timestamp: lastMessage?.timestamp || Date.now(),
      unreadCount: userMessages.filter(msg => !msg.read && msg.receiver.id === currentUser.id).length
    }
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      sendMessage(selectedChat, newMessage)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full bg-white">
      {/* Conversations List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 ${selectedChat ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No conversations yet.</p>
              <p className="text-sm">Start chatting with friends!</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <motion.div
                key={conv.userId}
                onClick={() => setSelectedChat(conv.userId)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === conv.userId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {conv.user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm truncate">{conv.user.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(conv.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className={`flex-1 flex flex-col ${selectedChat ? 'block' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {messages[selectedChat][0]?.sender?.avatar || messages[selectedChat][0]?.receiver?.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {messages[selectedChat][0]?.sender?.username || messages[selectedChat][0]?.receiver?.username}
                  </h3>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages[selectedChat].map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender.id === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender.id === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
              <p>Send private messages to your friends</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

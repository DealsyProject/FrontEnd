import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  MessageCircle, 
  Bell,
  Search,
  UserCircle,
  Calendar,
  X,
  Send,
  Phone,
  Video
} from 'lucide-react';

function Helpcenter() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatFilter, setChatFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      title: 'New Customer Inquiry',
      description: 'Customer Alex has sent a message about Order #12345',
      time: '2 hours ago',
      type: 'message',
      read: false
    },
    {
      id: 2,
      title: 'Vendor Issue Resolved',
      description: 'Vendor payment issue for Tech Store has been resolved.',
      time: '5 hours ago',
      type: 'success',
      read: true
    },
    {
      id: 3,
      title: 'Urgent: Customer Complaint',
      description: 'High priority complaint from customer Sarah about product quality.',
      time: '1 day ago',
      type: 'security',
      read: true
    },
    {
      id: 4,
      title: 'Vendor Account Verified',
      description: 'New vendor Home Decor account has been successfully verified.',
      time: '2 days ago',
      type: 'success',
      read: true
    }
  ];

  const activeChats = [
    { 
      id: 1, 
      name: 'Alex', 
      status: 'online', 
      type: 'customer',
      issue: 'Order #12345 - Inquiry',
      lastMessage: 'Sure, it\'s #12345.',
      time: '10:34 AM',
      unread: 2,
      avatar: 'A'
    },
    {
      id: 2, 
      name: 'Tech Store', 
      status: 'online', 
      type: 'vendor',
      issue: 'Payment Processing Issue',
      lastMessage: 'We need help with payment gateway',
      time: '10:20 AM',
      unread: 1,
      avatar: 'T'
    },
    { 
      id: 3, 
      name: 'Sarah', 
      status: 'away', 
      type: 'customer',
      issue: 'Product Return Request',
      lastMessage: 'I want to return a product.',
      time: '09:15 AM',
      unread: 0,
      avatar: 'S'
    },
    {
      id: 4,
      name: 'Home Decor',
      status: 'online',
      type: 'vendor',
      issue: 'Inventory Management',
      lastMessage: 'How do I update stock levels?',
      time: '08:45 AM',
      unread: 0,
      avatar: 'H'
    },
    {
      id: 5,
      name: 'Mike',
      status: 'online',
      type: 'customer',
      issue: 'Shipping Delay',
      lastMessage: 'My order is delayed.',
      time: '08:00 AM',
      unread: 1,
      avatar: 'M'
    }
  ];

  // Different initial messages based on user type
  const getInitialMessages = (user) => {
    if (user.type === 'customer') {
      return [
        { 
          id: 1, 
          text: 'Hi, I have a question about my order.', 
          sender: 'customer', 
          time: '10:30 AM',
          avatar: user.avatar
        },
        { 
          id: 2, 
          text: `Hello ${user.name}! I\'m here to help with your ${user.issue.toLowerCase()}. Can you provide more details?`, 
          sender: 'support', 
          time: '10:33 AM',
          avatar: 'S'
        },
        { 
          id: 3, 
          text: user.lastMessage, 
          sender: 'customer', 
          time: user.time,
          avatar: user.avatar
        }
      ];
    } else if (user.type === 'vendor') {
      return [
        { 
          id: 1, 
          text: `Hello, I need assistance with ${user.issue.toLowerCase()}.`, 
          sender: 'vendor', 
          time: '10:30 AM',
          avatar: user.avatar
        },
        { 
          id: 2, 
          text: `Hi ${user.name}! I\'m here to help with your vendor account. What specific issue are you facing?`, 
          sender: 'support', 
          time: '10:33 AM',
          avatar: 'S'
        },
        { 
          id: 3, 
          text: user.lastMessage, 
          sender: 'vendor', 
          time: user.time,
          avatar: user.avatar
        }
      ];
    }
    return [];
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'S'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startChat = (user) => {
    setSelectedUser(user);
    const initialMessages = getInitialMessages(user);
    setMessages(initialMessages);
  };

  const closeChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Proper search and filter functionality
  const filteredChats = useMemo(() => {
    let filtered = activeChats;

    // First apply type filter
    if (chatFilter !== 'all') {
      filtered = filtered.filter(chat => chat.type === chatFilter);
    }

    // Then apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(query) ||
        chat.issue.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeChats, chatFilter, searchQuery]);

  // Get appropriate chat header based on user type
  const getChatHeader = (user) => {
    if (user.type === 'customer') {
      return `Customer Support - ${user.name}`;
    } else if (user.type === 'vendor') {
      return `Vendor Support - ${user.name}`;
    }
    return `Chat with ${user.name}`;
  };

  // Get appropriate placeholder based on user type
  const getInputPlaceholder = (user) => {
    if (user.type === 'customer') {
      return 'Type a response to customer...';
    } else if (user.type === 'vendor') {
      return 'Type a response to vendor...';
    }
    return 'Type a message...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-[#586330]" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Support Team Dashboard</h1>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-[#586330] text-white border border-[#586330]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-white text-[#586330] text-xs rounded-full px-2 py-1 min-w-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'chats'
                      ? 'bg-[#586330] text-white border border-[#586330]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Active Chats
                  {selectedUser && (
                    <span className="ml-auto bg-green-600 text-white text-xs rounded-full px-2 py-1">
                      Live
                    </span>
                  )}
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Active Chats</p>
                    <p className="text-2xl font-bold text-blue-600">{activeChats.length}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Resolved Today</p>
                    <p className="text-2xl font-bold text-green-600">12</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
                  <p className="text-gray-600 mt-1">Stay updated with customer and vendor activities</p>
                </div>
                
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'security' ? 'bg-red-100' :
                            notification.type === 'message' ? 'bg-blue-100' :
                            notification.type === 'success' ? 'bg-green-100' : 'bg-purple-100'
                          }`}>
                            <Mail className={`h-5 w-5 ${
                              notification.type === 'security' ? 'text-red-600' :
                              notification.type === 'message' ? 'text-blue-600' :
                              notification.type === 'success' ? 'text-green-600' : 'text-purple-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <p className="text-gray-600 mt-1">{notification.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {notification.time}
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#586330] text-white">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chats Tab */}
            {activeTab === 'chats' && (
              <div className="h-[600px] flex rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
                {/* Left Sidebar */}
                <div className="w-96 bg-gray-100 border-r border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, issue, or message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#586330]/40"
                      />
                    </div>

                    <div className="flex gap-2">
                      {['all', 'customer', 'vendor'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setChatFilter(filter)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            chatFilter === filter
                              ? 'bg-[#586330] text-white'
                              : 'text-gray-600 hover:bg-[#586330] hover:text-white'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {filteredChats.length > 0 ? (
                      filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => startChat(chat)}
                          className={`p-4 border-b border-gray-200 cursor-pointer transition ${
                            selectedUser?.id === chat.id ? 'bg-[#586330]/20' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                              chat.type === 'customer' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {chat.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-800 truncate">{chat.name}</h3>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    chat.type === 'customer'
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-green-100 text-green-600'
                                  }`}>
                                    {chat.type}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">{chat.time}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-700 mb-1">{chat.issue}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {chat.lastMessage}
                              </p>
                            </div>
                            {chat.unread > 0 && (
                              <span className="bg-[#586330] text-white text-xs rounded-full px-2 py-1 min-w-6 flex items-center justify-center">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No chats found matching your search</p>
                        <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Chat Area */}
                {selectedUser ? (
                  <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <div>
                        <h2 className="text-lg font-semibold text-[#586330]">
                          {getChatHeader(selectedUser)}
                        </h2>
                        <p className="text-sm text-gray-600">{selectedUser.issue}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          selectedUser.type === 'customer'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {selectedUser.type.toUpperCase()}
                        </span>
                        
                        <button 
                          onClick={closeChat}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-2 ${
                          selectedUser.type === 'customer'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {selectedUser.avatar}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start gap-3 ${
                            message.sender === 'support' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              message.sender === 'support'
                                ? 'bg-[#586330] text-white'
                                : selectedUser.type === 'customer'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {message.avatar}
                          </div>
                          <div
                            className={`flex flex-col ${
                              message.sender === 'support' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`max-w-md px-4 py-3 rounded-2xl ${
                                message.sender === 'support'
                                  ? 'bg-[#586330]/80 text-white rounded-tr-none'
                                  : selectedUser.type === 'customer'
                                  ? 'bg-blue-100 text-blue-900 rounded-tl-none'
                                  : 'bg-green-100 text-green-900 rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                              {message.sender === 'support' 
                                ? 'You' 
                                : `${selectedUser.name} (${selectedUser.type})`} • {message.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder={selectedUser ? getInputPlaceholder(selectedUser) : 'Type a message...'}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#586330]/40"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="p-3 bg-[#586330]/80 hover:bg-[#586330] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-white">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
                      <p className="text-gray-500">Select a conversation from the sidebar to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Helpcenter;
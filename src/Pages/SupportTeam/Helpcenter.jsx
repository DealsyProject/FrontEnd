import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  CalendarIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

function Helpcenter() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: 'support', time: '10:00 AM' },
    { id: 2, text: "I'm having issues with my account login", sender: 'user', time: '10:02 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Password Reset Successful',
      description: 'Your password has been successfully reset.',
      time: '2 hours ago',
      type: 'security',
      read: false
    },
    {
      id: 2,
      title: 'New Message from Support Team',
      description: 'You have a new response from our support team.',
      time: '5 hours ago',
      type: 'message',
      read: true
    },
    {
      id: 3,
      title: 'Account Verification Complete',
      description: 'Your account has been successfully verified.',
      time: '1 day ago',
      type: 'success',
      read: true
    },
    {
      id: 4,
      title: 'Payment Received',
      description: 'Your recent payment has been processed successfully.',
      time: '2 days ago',
      type: 'payment',
      read: true
    }
  ];

  const supportAgents = [
    { 
      id: 1, 
      name: 'Abin Prashanth', 
      status: 'online', 
      department: 'Customer Support',
      description: 'Specialized in account and customer issues',
      responseTime: 'Usually responds in 5 minutes'
    },
    {
      id: 2, 
      name: 'Majdha', 
      status: 'online', 
      department: 'Vendor Support',
      description: 'Expert in billing and payment related queries',
      responseTime: 'Usually responds in 3 minutes'
    },
    { 
      id: 3, 
      name: 'Emily Davis', 
      status: 'away', 
      department: 'General Support',
      description: 'Helps with general product questions',
      responseTime: 'Usually responds in 15 minutes'
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Simulate auto-reply after 2 seconds
      setTimeout(() => {
        const autoReply = {
          id: messages.length + 2,
          text: "Thanks for your message. I'll look into this and get back to you shortly.",
          sender: 'support',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startChat = (agent) => {
    setSelectedAgent(agent);
    setMessages([
      { 
        id: 1, 
        text: `Hello! I'm ${agent.name} from ${agent.department}. How can I help you today?`, 
        sender: 'support', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  };

  const closeChat = () => {
    setSelectedAgent(null);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#586330]" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Help Center</h1>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search help articles..."
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
                  <BellIcon className="h-5 w-5 mr-3" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-white text-[#586330] text-xs rounded-full px-2 py-1 min-w-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'team'
                      ? 'bg-[#586330] text-white border border-[#586330]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Support Team
                  {selectedAgent && (
                    <span className="ml-auto bg-green-600 text-white text-xs rounded-full px-2 py-1">
                      Live
                    </span>
                  )}
                </button>
              </nav>

              {/* Support Team Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Support</h3>
                <div className="space-y-3">
                  {supportAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                          agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.department}</p>
                        <p className="text-xs text-gray-400 mt-1">{agent.responseTime}</p>
                      </div>
                      <button
                        onClick={() => startChat(agent)}
                        disabled={agent.status !== 'online'}
                        className={`ml-2 px-3 py-1 text-xs rounded-lg transition-colors ${
                          agent.status === 'online'
                            ? 'bg-[#586330] text-white hover:bg-[#4a5428]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Chat
                      </button>
                    </div>
                  ))}
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
                  <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
                  <p className="text-gray-600 mt-1">Manage your notification preferences</p>
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
                            <EnvelopeIcon className={`h-5 w-5 ${
                              notification.type === 'security' ? 'text-red-600' :
                              notification.type === 'message' ? 'text-blue-600' :
                              notification.type === 'success' ? 'text-green-600' : 'text-purple-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <p className="text-gray-600 mt-1">{notification.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4 mr-1" />
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

            {/* Support Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                {/* Support Team Overview */}
                {!selectedAgent && (
                  <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold text-gray-900">Our Support Team</h2>
                      <p className="text-gray-600 mt-1">Get help from our dedicated support specialists</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {supportAgents.map((agent) => (
                          <div key={agent.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="relative">
                                <UserCircleIcon className="h-16 w-16 text-gray-400" />
                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                                  agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                }`} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{agent.name}</h3>
                                <p className="text-sm text-gray-600">{agent.department}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                  agent.status === 'online' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {agent.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
                            <p className="text-gray-500 text-xs mb-4">{agent.responseTime}</p>
                            <button
                              onClick={() => startChat(agent)}
                              disabled={agent.status !== 'online'}
                              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                                agent.status === 'online'
                                  ? 'bg-[#586330] text-white hover:bg-[#4a5428]'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <ChatBubbleLeftRightIcon className="h-5 w-5" />
                              <span>Start Chat</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Chat */}
                {selectedAgent && (
                  <div className="bg-white rounded-xl shadow-sm border h-[600px] flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <UserCircleIcon className="h-12 w-12 text-[#586330]" />
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{selectedAgent.name}</h3>
                            <p className="text-sm text-green-600">Online • {selectedAgent.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <PhoneIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <VideoCameraIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={closeChat}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                message.sender === 'user'
                                  ? 'bg-[#586330] text-white rounded-br-none'
                                  : 'bg-white text-gray-900 border rounded-bl-none shadow-sm'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'user' ? 'text-[#e8eed0]' : 'text-gray-500'
                              }`}>
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t bg-white">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330]"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-[#586330] text-white px-6 py-3 rounded-lg hover:bg-[#4a5428] focus:outline-none focus:ring-2 focus:ring-[#586330] focus:ring-offset-2 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                          <span>Send</span>
                        </button>
                      </div>
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
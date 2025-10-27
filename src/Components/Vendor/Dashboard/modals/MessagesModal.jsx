import React, { useState, useEffect, useRef } from 'react';

const MessagesModal = ({ 
  setShowMessages, 
  messageThreads: initialThreads 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [messageThreads, setMessageThreads] = useState(initialThreads || []);
  const [activeThread, setActiveThread] = useState(initialThreads?.[0]?.id || null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [sentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessageWithUpdate = () => {
    if (newMessage.trim()) {
      // Create new message object
      const newMessageObj = {
        id: Date.now(),
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSupport: false,
        status: 'sent'
      };

      // Add to sent messages
      setSentMessages(prev => [...prev, newMessageObj]);
      
      // Update the active thread's preview and time
      if (activeThread) {
        setMessageThreads(prev => prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                preview: newMessage,
                time: 'Just now',
                unread: false
              }
            : thread
        ));
      }
      
      // Clear input
      setNewMessage('');
      
      // Simulate message delivery and read status
      setTimeout(() => {
        setSentMessages(prev => prev.map(msg => 
          msg.id === newMessageObj.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);

      setTimeout(() => {
        setSentMessages(prev => prev.map(msg => 
          msg.id === newMessageObj.id ? { ...msg, status: 'read' } : msg
        ));
      }, 2000);

      // Simulate response after sending a message
      setTimeout(() => {
        const autoResponse = {
          id: Date.now() + 1,
          sender: 'Support Team',
          message: 'Thank you for your message. We will get back to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSupport: true
        };
        setSentMessages(prev => [...prev, autoResponse]);
        
        // Update thread preview for support response
        if (activeThread) {
          setMessageThreads(prev => prev.map(thread => 
            thread.id === activeThread 
              ? {
                  ...thread,
                  preview: 'Support Team: Thank you for your message...',
                  time: 'Just now',
                  unread: true
                }
              : thread
          ));
        }
      }, 3000);
    }
  };

  const handleThreadClick = (threadId) => {
    setActiveThread(threadId);
    // Mark thread as read when clicked
    setMessageThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, unread: false }
        : thread
    ));
  };

  // Combine original messages and sent messages
  const allMessages = [...sentMessages].sort((a, b) => a.id - b.id);

  // Get active thread data
  const activeThreadData = messageThreads.find(thread => thread.id === activeThread);

  // WhatsApp message status icon
  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
        );
      case 'read':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* WhatsApp-style Sidebar */}
        <div className="w-96 bg-[#f0f2f5] border-r border-gray-300 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 bg-[#f0f2f5] border-b border-gray-300 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-800">Chats</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </button>
              <button 
                onClick={() => setShowMessages(false)}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 bg-[#f0f2f5]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {messageThreads.map((thread) => (
              <div 
                key={thread.id}
                onClick={() => handleThreadClick(thread.id)}
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  activeThread === thread.id ? 'bg-[#f0f2f5]' : 'hover:bg-gray-50'
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {thread.title.charAt(0)}
                </div>
                
                {/* Chat Info */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{thread.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{thread.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-600 truncate flex-1">{thread.preview}</p>
                    {thread.unread && (
                      <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp-style Chat Area */}
        <div className="flex-1 flex flex-col bg-[#efeae2]">
          {/* Chat Header */}
          {activeThreadData ? (
            <div className="p-3 bg-[#f0f2f5] border-b border-gray-300 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {activeThreadData.title.charAt(0)}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{activeThreadData.title}</h2>
                  <p className="text-xs text-gray-600">online</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#f0f2f5] border-b border-gray-300 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-800">Select a chat</span>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2]">
            {activeThread ? (
              <div className="space-y-2">
                {allMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.isSupport 
                        ? 'bg-white rounded-tl-none' 
                        : 'bg-[#d9fdd3] rounded-tr-none'
                    } shadow-sm`}>
                      <p className="text-gray-800 text-sm">{msg.message}</p>
                      <div className={`flex justify-end items-center space-x-1 mt-1 ${
                        msg.isSupport ? 'justify-start' : 'justify-end'
                      }`}>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                        {!msg.isSupport && msg.status && (
                          <span className="ml-1">
                            {renderMessageStatus(msg.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Empty element for auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">WhatsApp Web</h3>
                  <p className="text-gray-500 max-w-sm">
                    Send and receive messages without keeping your phone online.
                    Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Message Input - WhatsApp Style */}
          {activeThread && (
            <div className="p-3 bg-[#f0f2f5]">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                </button>
                <div className="flex-1 bg-white rounded-full border border-gray-300">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="w-full px-4 py-2 bg-transparent text-gray-900 focus:outline-none text-sm rounded-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessageWithUpdate()}
                  />
                </div>
                {newMessage.trim() ? (
                  <button
                    onClick={handleSendMessageWithUpdate}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                ) : (
                  <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
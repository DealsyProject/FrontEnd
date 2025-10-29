import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, 
  FaPlus, 
  FaTimes, 
  FaSearch, 
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimesCircle,
  FaImage,
  FaFile,
  FaVideo,
  FaPaperPlane
} from 'react-icons/fa';
import { 
  IoMdCheckmark, 
  IoMdCheckmarkCircle,
  IoIosSend,
  IoIosAttach
} from 'react-icons/io';
import { 
  BsThreeDotsVertical,
  BsCameraVideo,
  BsTelephone
} from 'react-icons/bs';
import { 
  RiChatSmileLine,
  RiMessage2Fill
} from 'react-icons/ri';
import { 
  MdEmojiEmotions
} from 'react-icons/md';

const MessagesModal = ({ 
  setShowMessages, 
  messageThreads: initialThreads 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messageThreads, setMessageThreads] = useState(() => {
    // Initialize threads with their own message histories
    const threadsWithHistory = initialThreads?.map(thread => ({
      ...thread,
      messages: thread.messages || [], // Each thread has its own messages array
      unread: thread.unread || false
    })) || [];
    return threadsWithHistory;
  });
  
  const [activeThread, setActiveThread] = useState(initialThreads?.[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredThreads, setFilteredThreads] = useState(initialThreads || []);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const messageOptionsRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageOptionsRef.current && !messageOptionsRef.current.contains(event.target)) {
        setSelectedMessageId(null);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get messages for active thread
  const getActiveThreadMessages = () => {
    if (!activeThread) return [];
    const thread = messageThreads.find(t => t.id === activeThread);
    return thread?.messages || [];
  };

  // Filter threads based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredThreads(messageThreads);
    } else {
      const filtered = messageThreads.filter(thread =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredThreads(filtered);
    }
  }, [searchQuery, messageThreads]);

  // Auto-scroll to bottom when messages are added
  useEffect(() => {
    scrollToBottom();
  }, [getActiveThreadMessages()]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get different auto-response messages based on the thread
  const getAutoResponseMessage = (threadTitle) => {
    const responses = {
      'John Doe': 'Hey! Thanks for your message. I\'ll get back to you soon!',
      'Sarah Smith': 'Hi there! I\'m currently away from my desk but will respond shortly.',
      'Mike Johnson': 'Got your message! I\'ll review it and get back to you.',
      'Support Team': 'Thank you for contacting support. We will assist you shortly.',
      'Emily Davis': 'Thanks for reaching out! I\'ll respond as soon as possible.',
      'Alex Wilson': 'Message received! I\'ll get back to you in a bit.'
    };
    
    return responses[threadTitle] || 'Thank you for your message. We will get back to you shortly.';
  };

  // Attachment functions
  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate image message
        const imageMessage = {
          id: Date.now(),
          sender: 'You',
          message: `📷 Image: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSupport: false,
          status: 'sent',
          type: 'image'
        };
        sendMessageToThread(imageMessage);
      }
    };
    input.click();
    setShowAttachmentMenu(false);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate file message
        const fileMessage = {
          id: Date.now(),
          sender: 'You',
          message: `📎 File: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSupport: false,
          status: 'sent',
          type: 'file'
        };
        sendMessageToThread(fileMessage);
      }
    };
    input.click();
    setShowAttachmentMenu(false);
  };

  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate video message
        const videoMessage = {
          id: Date.now(),
          sender: 'You',
          message: `🎥 Video: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSupport: false,
          status: 'sent',
          type: 'video'
        };
        sendMessageToThread(videoMessage);
      }
    };
    input.click();
    setShowAttachmentMenu(false);
  };

  // Emoji functions
  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachmentMenu(false);
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Common function to send messages to thread
  const sendMessageToThread = (messageObj) => {
    if (activeThread) {
      const activeThreadData = messageThreads.find(thread => thread.id === activeThread);

      // Update the thread with new message
      setMessageThreads(prev => prev.map(thread => 
        thread.id === activeThread 
          ? {
              ...thread,
              messages: [...thread.messages, messageObj],
              preview: messageObj.message,
              time: 'Just now',
              unread: false
            }
          : thread
      ));

      // Simulate message delivery and read status
      setTimeout(() => {
        setMessageThreads(prev => prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                messages: thread.messages.map(msg => 
                  msg.id === messageObj.id ? { ...msg, status: 'delivered' } : msg
                )
              }
            : thread
        ));
      }, 1000);

      setTimeout(() => {
        setMessageThreads(prev => prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                messages: thread.messages.map(msg => 
                  msg.id === messageObj.id ? { ...msg, status: 'read' } : msg
                )
              }
            : thread
        ));
      }, 2000);

      // Simulate response after sending a message
      setTimeout(() => {
        const autoResponse = {
          id: Date.now() + 1,
          sender: activeThreadData?.title || 'Support Team',
          message: getAutoResponseMessage(activeThreadData?.title),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSupport: true
        };

        setMessageThreads(prev => prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                messages: [...thread.messages, autoResponse],
                preview: `${autoResponse.sender}: ${autoResponse.message.substring(0, 30)}...`,
                time: 'Just now',
                unread: true
              }
            : thread
        ));
      }, 3000);
    }
  };

  const handleSendMessageWithUpdate = () => {
    if (newMessage.trim() && activeThread) {
      // Create new message object
      const newMessageObj = {
        id: Date.now(),
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSupport: false,
        status: 'sent'
      };

      sendMessageToThread(newMessageObj);
      setNewMessage('');
    }
  };

  const handleThreadClick = (threadId) => {
    setActiveThread(threadId);
    setSelectedMessageId(null); // Close any open message options
    setEditingMessageId(null); // Cancel any editing
    setShowAttachmentMenu(false); // Close attachment menu
    setShowEmojiPicker(false); // Close emoji picker
    // Mark thread as read when clicked
    setMessageThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, unread: false }
        : thread
    ));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Message actions
  const handleMessageClick = (messageId) => {
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditMessageText(message.message);
    setSelectedMessageId(null);
  };

  const handleSaveEdit = () => {
    if (editMessageText.trim() && activeThread) {
      setMessageThreads(prev => prev.map(thread => 
        thread.id === activeThread 
          ? {
              ...thread,
              messages: thread.messages.map(msg => 
                msg.id === editingMessageId 
                  ? { 
                      ...msg, 
                      message: editMessageText,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      edited: true 
                    }
                  : msg
              ),
              preview: editMessageText,
              time: 'Just now'
            }
          : thread
      ));
      setEditingMessageId(null);
      setEditMessageText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageText('');
  };

  const handleDeleteMessage = (messageId) => {
    if (activeThread) {
      setMessageThreads(prev => prev.map(thread => 
        thread.id === activeThread 
          ? {
              ...thread,
              messages: thread.messages.filter(msg => msg.id !== messageId),
              preview: thread.messages.length > 1 ? thread.messages[thread.messages.length - 2]?.message : 'No messages',
              time: 'Just now'
            }
          : thread
      ));
      setSelectedMessageId(null);
    }
  };

  // Get active thread data
  const activeThreadData = messageThreads.find(thread => thread.id === activeThread);
  const threadMessages = getActiveThreadMessages();

  // WhatsApp message status icon
  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <IoMdCheckmark className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <IoMdCheckmark className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <IoMdCheckmarkCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Common emojis for quick selection
  const commonEmojis = ['😀', '😂', '🥰', '😎', '👍', '❤️', '🔥', '🎉', '🙏', '💯'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* WhatsApp-style Sidebar */}
        <div className="w-96 bg-[#f0f2f5] border-r border-gray-300 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 bg-[#f0f2f5] border-b border-gray-300 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-lg font-semibold text-gray-800">Chats</span>
            </div>
            <div className="flex items-center space-x-4">
              
              <button 
                onClick={() => setShowMessages(false)}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 bg-[#f0f2f5]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                </button>
              )}
            </div>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
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
                          {thread.unreadCount || 1}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <FaSearch className="w-6 h-6 mb-2" />
                <p className="text-sm">No chats found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
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
            </div>
          ) : (
            <div className="p-3 bg-[#f0f2f5] border-b border-gray-300 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <RiMessage2Fill className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-800">Select a chat</span>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2]">
            {activeThread ? (
              <div className="space-y-2">
                {threadMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'} relative`}
                  >
                    {editingMessageId === msg.id ? (
                      // Edit mode
                      <div className="max-w-xs lg:max-w-md w-full">
                        <div className="bg-white rounded-2xl p-2 shadow-sm border border-green-300">
                          <input
                            type="text"
                            value={editMessageText}
                            onChange={(e) => setEditMessageText(e.target.value)}
                            className="w-full px-3 py-2 text-gray-800 text-sm focus:outline-none"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <FaTimesCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 text-green-500 hover:text-green-700 transition-colors"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Normal message
                      <div 
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative cursor-pointer ${
                          msg.isSupport 
                            ? 'bg-white rounded-tl-none' 
                            : 'bg-[#d9fdd3] rounded-tr-none'
                        } shadow-sm hover:opacity-95 transition-opacity ${
                          selectedMessageId === msg.id ? 'ring-2 ring-green-400' : ''
                        }`}
                        onClick={() => !msg.isSupport && handleMessageClick(msg.id)}
                      >
                        <p className="text-gray-800 text-sm">{msg.message}</p>
                        <div className={`flex justify-end items-center space-x-1 mt-1 ${
                          msg.isSupport ? 'justify-start' : 'justify-end'
                        }`}>
                          <span className="text-xs text-gray-500 flex items-center">
                            {msg.time}
                            {msg.edited && (
                              <span className="ml-1 text-xs text-gray-400">(edited)</span>
                            )}
                          </span>
                          {!msg.isSupport && msg.status && (
                            <span className="ml-1">
                              {renderMessageStatus(msg.status)}
                            </span>
                          )}
                        </div>

                        {/* Message Options Menu */}
                        {!msg.isSupport && selectedMessageId === msg.id && (
                          <div 
                            ref={messageOptionsRef}
                            className="absolute top-0 right-0 mt-8 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-32"
                          >
                            <button
                              onClick={() => handleEditMessage(msg)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                            >
                              <FaEdit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                            >
                              <FaTrash className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {/* Empty element for auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RiChatSmileLine className="w-8 h-8 text-gray-400" />
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
                {/* Attachment Button with Menu */}
                <div className="relative" ref={attachmentMenuRef}>
                  <button 
                    onClick={handleAttachmentClick}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <IoIosAttach className="w-5 h-5" />
                  </button>
                  
                  {/* Attachment Menu */}
                  {showAttachmentMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-48">
                      <button
                        onClick={handleImageUpload}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors border-b border-gray-100"
                      >
                        <FaImage className="w-4 h-4 text-green-500" />
                        <span>Photo & Video</span>
                      </button>
                      <button
                        onClick={handleFileUpload}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors border-b border-gray-100"
                      >
                        <FaFile className="w-4 h-4 text-blue-500" />
                        <span>Document</span>
                      </button>
                      <button
                        onClick={handleVideoUpload}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                      >
                        <FaVideo className="w-4 h-4 text-purple-500" />
                        <span>Camera</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Input */}
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

                {/* Emoji Button with Picker */}
                <div className="relative" ref={emojiPickerRef}>
                  <button 
                    onClick={handleEmojiClick}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <MdEmojiEmotions className="w-5 h-5" />
                  </button>
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-300 z-20 p-4 w-64">
                      <div className="grid grid-cols-8 gap-1">
                        {commonEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => addEmoji(emoji)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all duration-200 text-lg hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessageWithUpdate}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-full transition-colors ${
                    newMessage.trim() 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <IoIosSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
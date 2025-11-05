import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, 
  FaTimes, 
  FaSearch, 
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimesCircle
} from 'react-icons/fa';
import { 
  IoMdCheckmark, 
  IoMdCheckmarkCircle,
  IoIosSend
} from 'react-icons/io';
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
    const threadsWithHistory = initialThreads?.map(thread => ({
      ...thread,
      messages: thread.messages || [], 
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const messagesEndRef = useRef(null);
  const messageOptionsRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageOptionsRef.current && !messageOptionsRef.current.contains(event.target)) {
        setSelectedMessageId(null);
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

  const getActiveThreadMessages = () => {
    if (!activeThread) return [];
    const thread = messageThreads.find(t => t.id === activeThread);
    return thread?.messages || [];
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [getActiveThreadMessages()]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const sendMessageToThread = (messageObj) => {
    if (activeThread) {
      const activeThreadData = messageThreads.find(thread => thread.id === activeThread);

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
    setSelectedMessageId(null);
    setEditingMessageId(null);
    setShowEmojiPicker(false);
    
    setMessageThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, unread: false }
        : thread
    ));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const activeThreadData = messageThreads.find(thread => thread.id === activeThread);
  const threadMessages = getActiveThreadMessages();

  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <IoMdCheckmark className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <IoMdCheckmark className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <IoMdCheckmarkCircle className="w-4 h-4 text-[#586330]" />;
      default:
        return null;
    }
  };

  const commonEmojis = ['😀', '😂', '🥰', '😎', '👍', '❤️', '🔥', '🎉', '🙏', '💯'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-lg border border-gray-200">
        {/* Left Sidebar */}
        <div className="w-96 bg-gray-100 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
              <button 
                onClick={() => setShowMessages(false)}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search chats"
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#586330]/40 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {['all', 'active', 'closed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-[#586330] text-white"
                      : "text-gray-600 hover:bg-[#586330] hover:text-white"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <div 
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition ${
                    activeThread === thread.id ? "bg-[#586330]/20" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#586330]/10 text-[#586330] flex items-center justify-center font-medium">
                      {thread.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800 truncate">{thread.title}</h3>
                        <span className="text-xs text-gray-400">{thread.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {thread.preview}
                      </p>
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

        {/* Right Panel - Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          {activeThreadData ? (
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#586330]/10 text-[#586330] flex items-center justify-center font-medium">
                  {activeThreadData.title.charAt(0)}
                </div>
                <div>
                  <h2 className="font-semibold text-[#586330]">{activeThreadData.title}</h2>
                  <p className="text-xs text-gray-600">online</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <RiMessage2Fill className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-800">Select a chat</span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {activeThread ? (
              threadMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 ${
                    msg.isSupport ? "" : "flex-row-reverse"
                  }`}
                >
                  {editingMessageId === msg.id ? (
                    <div className="max-w-md w-full">
                      <div className="bg-white rounded-2xl p-2 shadow-sm border border-[#586330]">
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
                            className="p-1 text-[#586330] hover:text-[#586330]/80 transition-colors"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`max-w-md px-4 py-3 rounded-2xl relative cursor-pointer ${
                        msg.isSupport 
                          ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' 
                          : 'bg-[#586330]/80 text-white rounded-tr-none'
                      } shadow-sm hover:opacity-95 transition-opacity ${
                        selectedMessageId === msg.id ? 'ring-2 ring-[#586330]' : ''
                      }`}
                      onClick={() => !msg.isSupport && handleMessageClick(msg.id)}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className={`flex justify-end items-center space-x-1 mt-1 ${
                        msg.isSupport ? 'justify-start' : 'justify-end'
                      }`}>
                        <span className="text-xs opacity-80 flex items-center">
                          {msg.time}
                          {msg.edited && (
                            <span className="ml-1 text-xs opacity-60">(edited)</span>
                          )}
                        </span>
                        {!msg.isSupport && msg.status && (
                          <span className="ml-1">
                            {renderMessageStatus(msg.status)}
                          </span>
                        )}
                      </div>

                      {/* Message Options */}
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
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RiChatSmileLine className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Messages</h3>
                  <p className="text-gray-500 max-w-sm">
                    Select a chat to start messaging. Your conversations will appear here.
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {activeThread && (
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                {/* Message Input */}
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-transparent text-gray-900 focus:outline-none text-sm rounded-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessageWithUpdate()}
                  />
                </div>

                {/* Emoji Picker */}
                <div className="relative" ref={emojiPickerRef}>
                  <button 
                    onClick={handleEmojiClick}
                    className="p-3 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MdEmojiEmotions className="w-5 h-5" />
                  </button>
                  
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
                  className={`p-3 rounded-lg transition ${
                    newMessage.trim() 
                      ? 'bg-[#586330]/80 hover:bg-[#586330] text-white' 
                      : 'text-gray-400 cursor-not-allowed bg-gray-200'
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
import React from 'react';

const MessagesWidget = ({ setShowMessages, messageThreads }) => {
  return (
    <div className="bg-[#586330]/20 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold  mb-4">Messages</h3>
      <div className="space-y-4">
        {messageThreads.slice(0, 2).map((thread) => (
          <MessageThread 
            key={thread.id} 
            thread={thread} 
            setShowMessages={setShowMessages} 
          />
        ))}
      </div>
      <ViewAllButton 
        onClick={() => setShowMessages(true)} 
        text="View All Messages"
        className="  hover:bg-[#586330]/20"
      />
    </div>
  );
};

const MessageThread = ({ thread, setShowMessages }) => (
  <div 
    className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => setShowMessages(true)}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-800 text-sm">{thread.title}</h4>
      {thread.unread && <span className="w-2 h-2 bg-[#586330] rounded-full"></span>}
    </div>
    <p className="text-xs text-gray-600 mb-1 line-clamp-2">{thread.preview}</p>
    <p className="text-xs text-gray-400">{thread.time}</p>
  </div>
);

const ViewAllButton = ({ onClick, text, className }) => (
  <button 
    onClick={onClick} 
    className={`w-full mt-4 py-2 border rounded-lg transition-colors ${className}`}
  >
    {text}
  </button>
);

export default MessagesWidget;
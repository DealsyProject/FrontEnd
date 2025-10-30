import React, { useState } from 'react';
import { Search, Phone, MoreVertical, Send } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx'; 

export default function SupportChatAccess() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState('');

  const chatsData = [
    {
      id: 0,
      orderId: 'Order #12345 - Inquiry',
      customer: 'Alex',
      vendor: 'Tech',
      status: 'active',
      messages: [
        { sender: 'customer', text: 'Hi, I have a question about my order.', time: '10:30 AM', avatar: 'A' },
        { sender: 'support', text: 'Hello Alex, can you provide your order number?', time: '10:33 AM', avatar: 'S' },
        { sender: 'customer', text: 'Sure, it\'s #12345.', time: '10:34 AM', avatar: 'A' }
      ],
      avatar: 'A'
    },
    {
      id: 1,
      orderId: 'Product Return',
      customer: 'Sarah',
      vendor: 'Home Decor',
      status: 'closed',
      messages: [
        { sender: 'customer', text: 'I want to return a product.', time: '09:15 AM', avatar: 'S' },
        { sender: 'support', text: 'Sure, please provide the order number.', time: '09:17 AM', avatar: 'H' }
      ],
      avatar: 'S'
    },
    {
      id: 2,
      orderId: 'Shipping Delay',
      customer: 'Mike',
      vendor: 'Outdoor Gear',
      status: 'active',
      messages: [
        { sender: 'customer', text: 'My order is delayed.', time: '08:00 AM', avatar: 'M' },
        { sender: 'support', text: 'We are checking on that.', time: '08:05 AM', avatar: 'O' }
      ],
      avatar: 'M'
    }
  ];

  const [chats, setChats] = useState(chatsData);

  // Filter chats based on tab and search
  const [search, setSearch] = useState('');
  const filteredChats = chats.filter(chat => {
    const matchesTab = activeTab === 'all' || chat.status === activeTab;
    const matchesSearch = chat.customer.toLowerCase().includes(search.toLowerCase()) || chat.orderId.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages, { sender: 'support', text: messageInput, time: 'Now', avatar: 'S' }]
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setMessageInput('');
  };

  const activeMessages = chats.find(chat => chat.id === selectedChat)?.messages || [];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <main className="pt-24 pb-8">
        <Navbar />
        <div className="h-[calc(100vh-8rem)] flex">
          {/* Left Sidebar */}
          <div className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold mb-4">Support Chat Access</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chats"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="flex gap-2">
                {['all', 'active', 'closed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-slate-800 cursor-pointer transition-colors ${
                    selectedChat === chat.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 font-medium">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white truncate">{chat.orderId}</h3>
                        <span className="text-xs text-slate-400">{chat.messages.slice(-1)[0]?.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {chat.messages.slice(-1)[0]?.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col bg-slate-950">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div>
                <h2 className="text-lg font-semibold">Chat with {chats[selectedChat].customer}</h2>
                <p className="text-sm text-slate-400">{chats[selectedChat].orderId}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Search className="w-5 h-5 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Phone className="w-5 h-5 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ml-2">{chats[selectedChat].avatar}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === 'support' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium ${message.sender === 'support' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    {message.avatar}
                  </div>
                  <div className={`flex flex-col ${message.sender === 'support' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-md px-4 py-3 rounded-2xl ${message.sender === 'support' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none'}`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{message.sender === 'support' ? 'Support' : chats[selectedChat].customer} • {message.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

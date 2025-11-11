import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Mail,
  MessageCircle,
  Bell,
  Search,
  Calendar,
  X,
  Send,
} from 'lucide-react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import NavbarSupport from '../../Components/SupportTeam/NavbarSupport';

function Helpcenter() {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatFilter, setChatFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new message comes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize SignalR connection once
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/chatHub') // 🔹 your backend hub URL
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  // Start connection
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('✅ Connected to SignalR hub');
          connection.on('ReceiveMessage', (user, message) => {
            console.log('📩 Received:', user, message);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                text: message,
                sender: user === 'Support' ? 'support' : 'customer',
                time: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                avatar: user === 'Support' ? 'S' : 'U',
              },
            ]);
          });
        })
        .catch(err => console.error('❌ Connection failed:', err));
    }
  }, [connection]);

  const activeChats = [
    { id: 1, name: 'Alex', status: 'online', type: 'customer', issue: 'Order #12345 Inquiry', avatar: 'A' },
    { id: 2, name: 'Tech Store', status: 'online', type: 'vendor', issue: 'Payment Issue', avatar: 'T' },
  ];

  const startChat = (user) => {
    setSelectedUser(user);
    setMessages([
      {
        id: 1,
        text: `Hello ${user.name}, how can I assist you today?`,
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'S',
      },
    ]);
  };

  const closeChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (newMessage.trim() && selectedUser && connection) {
      const message = newMessage.trim();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: message,
          sender: 'support',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          avatar: 'S',
        },
      ]);
      setNewMessage('');

      try {
        await connection.invoke('SendMessage', 'Support', message);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const filteredChats = useMemo(() => {
    let filtered = activeChats;
    if (chatFilter !== 'all') filtered = filtered.filter(chat => chat.type === chatFilter);
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(
        chat =>
          chat.name.toLowerCase().includes(term) ||
          chat.issue.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [chatFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSupport />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white shadow-sm rounded-lg border p-4">
          <button
            onClick={() => setActiveTab('chats')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-3 ${
              activeTab === 'chats'
                ? 'bg-[#586330] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Active Chats
          </button>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {['all', 'customer', 'vendor'].map(f => (
              <button
                key={f}
                onClick={() => setChatFilter(f)}
                className={`px-3 py-1 rounded-md text-sm ${
                  chatFilter === f
                    ? 'bg-[#586330] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Chats list */}
          <div className="overflow-y-auto max-h-[500px]">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => startChat(chat)}
                className={`p-3 rounded-lg cursor-pointer mb-2 ${
                  selectedUser?.id === chat.id ? 'bg-[#586330]/10' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      chat.type === 'customer'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {chat.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{chat.name}</p>
                    <p className="text-xs text-gray-500">{chat.issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white shadow-sm rounded-lg border flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-[#586330]">
                  Chat with {selectedUser.name} ({selectedUser.type})
                </h2>
                <button
                  onClick={closeChat}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex mb-3 ${
                      m.sender === 'support' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-sm ${
                        m.sender === 'support'
                          ? 'bg-[#586330] text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className="text-xs text-gray-300 mt-1">{m.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t flex items-center gap-2 bg-white">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#586330]"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#586330] text-white p-2 rounded-lg hover:bg-[#485228] disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Helpcenter;
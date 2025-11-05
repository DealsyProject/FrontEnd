import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { Search, Phone, MoreVertical, Send, User, Clock, Filter, Video, Paperclip, Smile, Mic } from "lucide-react";
import Navbar from "../../Components/Admin/Navbar.jsx";

export default function SupportChatAccess() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [connection, setConnection] = useState(null);
  const connectionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([
    {
      id: 0,
      orderId: "ORD-12345",
      customer: "Alex Johnson",
      vendor: "TechCorp",
      status: "active",
      lastSeen: "2 min ago",
      unread: 3,
      priority: "high",
      messages: [
        { sender: "customer", text: "Hi, I have a question about my order delivery timeline.", time: "10:30 AM", avatar: "A" },
        { sender: "support", text: "Hello Alex, I'd be happy to help. Can you provide your order number?", time: "10:33 AM", avatar: "S" },
        { sender: "customer", text: "Sure, it's ORD-12345. I ordered the gaming laptop.", time: "10:34 AM", avatar: "A" },
        { sender: "support", text: "Thank you! Let me check the status for you...", time: "10:35 AM", avatar: "S" },
      ],
      avatar: "A",
    },
    {
      id: 1,
      orderId: "ORD-67890",
      customer: "Sarah Miller",
      vendor: "HomeDecor Plus",
      status: "closed",
      lastSeen: "1 hour ago",
      unread: 0,
      priority: "medium",
      messages: [
        { sender: "customer", text: "I want to return a product that arrived damaged.", time: "09:15 AM", avatar: "S" },
        { sender: "support", text: "I'm sorry to hear that. Please provide the order number and photos of the damage.", time: "09:17 AM", avatar: "H" },
      ],
      avatar: "S",
    },
    {
      id: 2,
      orderId: "ORD-11223",
      customer: "Mike Chen",
      vendor: "Outdoor Gear Co",
      status: "active",
      lastSeen: "Online",
      unread: 1,
      priority: "medium",
      messages: [
        { sender: "customer", text: "My order is delayed by 3 days. Can you expedite the shipping?", time: "08:00 AM", avatar: "M" },
        { sender: "support", text: "Let me check the shipping status and see what we can do.", time: "08:05 AM", avatar: "O" },
      ],
      avatar: "M",
    },
    {
      id: 3,
      orderId: "ORD-44556",
      customer: "Emily Davis",
      vendor: "Fashion Hub",
      status: "active",
      lastSeen: "5 min ago",
      unread: 0,
      priority: "low",
      messages: [
        { sender: "customer", text: "Do you have this dress in size medium?", time: "11:20 AM", avatar: "E" },
        { sender: "support", text: "Let me check our inventory for you.", time: "11:22 AM", avatar: "F" },
      ],
      avatar: "E",
    },
  ]);

  const [search, setSearch] = useState("");

  // 🔹 Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, selectedChat]);

  // 🔹 Setup SignalR connection
  useEffect(() => {
    const connect = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub")
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
      connectionRef.current = newConnection;
    };
    connect();
  }, []);

  // 🔹 Handle incoming SignalR messages
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("✅ Connected to SignalR Hub");

          connection.on("ReceiveMessage", (user, message) => {
            console.log("📩 Message received:", message);

            setChats((prevChats) =>
              prevChats.map((chat, index) =>
                index === selectedChat
                  ? {
                      ...chat,
                      messages: [
                        ...chat.messages,
                        {
                          sender: user === "Support" ? "support" : "customer",
                          text: message,
                          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                          avatar: user[0].toUpperCase(),
                        },
                      ],
                    }
                  : chat
              )
            );
          });
        })
        .catch((err) => console.error("❌ SignalR Connection Error:", err));
    }

    return () => {
      if (connection) connection.stop();
    };
  }, [connection, selectedChat]);

  // 🔹 Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const message = messageInput.trim();

    // Add locally
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  sender: "support",
                  text: message,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  avatar: "S",
                },
              ],
              unread: 0,
            }
          : chat
      )
    );

    setMessageInput("");

    // Send via SignalR
    try {
      await connectionRef.current?.invoke("SendMessage", "Support", message);
    } catch (err) {
      console.error("❌ SendMessage failed:", err);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const matchesTab = activeTab === "all" || chat.status === activeTab;
    const matchesSearch =
      chat.customer.toLowerCase().includes(search.toLowerCase()) ||
      chat.orderId.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeMessages = chats.find((chat) => chat.id === selectedChat)?.messages || [];
  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900">
      
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Customer Support</h1>
                <p className="text-slate-600 mt-2">Manage conversations and provide exceptional support</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-600">Active chats</p>
                  <p className="text-2xl font-bold text-slate-800">{chats.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Avg. response</p>
                  <p className="text-2xl font-bold text-slate-800">2m</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[calc(100vh-14rem)] flex rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
            {/* Left Sidebar - Glass Morphism */}
            <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-slate-200 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Conversations</h2>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">{filteredChats.length}</span>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                  {["all", "active", "closed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab
                          ? "bg-white text-blue-600 shadow-sm font-semibold"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 group ${
                      selectedChat === chat.id 
                        ? "bg-blue-50 border-l-4 border-l-blue-500" 
                        : "hover:bg-slate-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
                          {chat.avatar}
                        </div>
                        {chat.status === "active" && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-slate-800 truncate">{chat.customer}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {chat.messages.slice(-1)[0]?.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                            {chat.orderId}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(chat.priority)}`}>
                            {chat.priority}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 truncate mb-2">
                          {chat.messages.slice(-1)[0]?.text}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            chat.status === "active" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {chat.status}
                          </span>
                          
                          {chat.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center font-medium">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              {selectedChatData && (
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
                        {selectedChatData.avatar}
                      </div>
                      {selectedChatData.status === "active" && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-bold text-slate-800">
                          {selectedChatData.customer}
                        </h2>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(selectedChatData.priority)}`}>
                          {selectedChatData.priority} priority
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="font-medium bg-slate-100 px-2 py-1 rounded-full">{selectedChatData.orderId}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Last seen {selectedChatData.lastSeen}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700 border border-slate-200">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700 border border-slate-200">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700 border border-slate-200">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                {activeMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-700">No messages yet</p>
                      <p className="text-sm text-slate-500">Start the conversation with your customer</p>
                    </div>
                  </div>
                ) : (
                  activeMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.sender === "support" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shadow-sm flex-shrink-0 ${
                          message.sender === "support"
                            ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                            : "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700"
                        }`}
                      >
                        {message.avatar}
                      </div>
                      <div
                        className={`flex flex-col max-w-[70%] ${
                          message.sender === "support" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.sender === "support"
                              ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-none"
                              : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 font-medium">
                            {message.sender === "support" ? "You" : selectedChatData?.customer}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{message.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-700">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-700">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-700">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className={`p-3 rounded-xl transition-all duration-200 shadow-sm ${
                      messageInput.trim()
                        ? "bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transform hover:scale-105"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-500">
                    Press Enter to send • Support conversations are recorded for quality purposes
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Connected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
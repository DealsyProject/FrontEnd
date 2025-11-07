import React, { useState } from "react";
import { Search, Phone, MoreVertical, Send } from "lucide-react";
import Navbar from "../../Components/customer/Common/Navbar";

export default function SupportChatAccess() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState("");

  const chatsData = [
    {
      id: 0,
      orderId: "Order #12345 - Inquiry",
      customer: "Alex",
      vendor: "Tech",
      status: "active",
      messages: [
        { sender: "customer", text: "Hi, I have a question about my order.", time: "10:30 AM", avatar: "A" },
        { sender: "support", text: "Hello Alex, can you provide your order number?", time: "10:33 AM", avatar: "S" },
        { sender: "customer", text: "Sure, it's #12345.", time: "10:34 AM", avatar: "A" },
      ],
      avatar: "A",
    },
    {
      id: 1,
      orderId: "Product Return",
      customer: "Sarah",
      vendor: "Home Decor",
      status: "closed",
      messages: [
        { sender: "customer", text: "I want to return a product.", time: "09:15 AM", avatar: "S" },
        { sender: "support", text: "Sure, please provide the order number.", time: "09:17 AM", avatar: "H" },
      ],
      avatar: "S",
    },
    {
      id: 2,
      orderId: "Shipping Delay",
      customer: "Mike",
      vendor: "Outdoor Gear",
      status: "active",
      messages: [
        { sender: "customer", text: "My order is delayed.", time: "08:00 AM", avatar: "M" },
        { sender: "support", text: "We are checking on that.", time: "08:05 AM", avatar: "O" },
      ],
      avatar: "M",
    },
  ];

  const [chats, setChats] = useState(chatsData);
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) => {
    const matchesTab = activeTab === "all" || chat.status === activeTab;
    const matchesSearch =
      chat.customer.toLowerCase().includes(search.toLowerCase()) ||
      chat.orderId.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages, { sender: "support", text: messageInput, time: "Now", avatar: "S" }],
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setMessageInput("");
  };

  const activeMessages = chats.find((chat) => chat.id === selectedChat)?.messages || [];

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <main className=" pb-8">
        <Navbar/>
        <div className="h-[calc(100vh-8rem)] flex rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
          {/* Left Sidebar */}
          <div className="w-96 bg-gray-100 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
            

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#586330]/40"
                />
              </div>

              <div className="flex gap-2">
                {["all", "active", "closed"].map((tab) => (
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

            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition ${
                    selectedChat === chat.id ? "bg-[#586330]/20" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#586330]/10 text-[#586330] flex items-center justify-center font-medium">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800 truncate">Support Team</h3>
                        <span className="text-xs text-gray-400">{chat.messages.slice(-1)[0]?.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.messages.slice(-1)[0]?.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold text-[#586330]">
                  Chat with Support Team
                </h2>
                
              </div>
              <div className="flex items-center gap-2">
                
                <div className="w-10 h-10 rounded-full bg-[#586330]/10 text-[#586330] flex items-center justify-center ml-2">
                  {chats[selectedChat].avatar}
                </div>
              </div>
            </div> 

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {activeMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === "support" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      message.sender === "support"
                        ? "bg-[#586330] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.avatar}
                  </div>
                  <div
                    className={`flex flex-col ${
                      message.sender === "support" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === "support"
                          ? "bg-[#586330]/80 text-white rounded-tr-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {message.sender === "support" ? "Support" : chats[selectedChat].customer} •{" "}
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#586330]/80 hover:bg-[#586330] text-white rounded-lg transition"
                >
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

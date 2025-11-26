import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

function SupportChatCustomer() {
  const [connection, setConnection] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typingCustomer, setTypingCustomer] = useState(null);


  const chatEndRef = useRef(null);
  const connRef = useRef(null);
  const isMounted = useRef(true);

  // Same useEffect and connection logic as before
  useEffect(() => {



    isMounted.current = true;

    const startConnection = async () => {
      setConnectionStatus("Connecting...");

      const token = localStorage.getItem("authToken");

      if (!token) {
        setConnectionStatus("No token");
        console.warn("No auth token found.");
        return;
      }

      let decoded = null;
      try {
        decoded = jwtDecode(token);
      } catch (e) {
        console.error("JWT decode failed", e);
        setConnectionStatus("Invalid Token");
        return;
      }

      const role =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        decoded.role ||
        decoded.Role ||
        decoded["role"];

      const isSupport =
        role === "SupportTeam" ||
        role === "supportteam" ||
        Number(role) === 4;

      if (!isSupport) {
        setConnectionStatus("Unauthorized");
        return;
      }

      setIsAuthorized(true);

      const hubUrl =
        `https://localhost:7001/chatHub?access_token=` +
        encodeURIComponent(token);

      const conn = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connRef.current = conn;

      conn.onreconnecting(() => setConnectionStatus("Reconnecting..."));
      conn.onreconnected(() => setConnectionStatus("Connected"));
      conn.onclose(() => setConnectionStatus("Disconnected"));

      conn.on("ReceiveMessage", (fromUserId, msg) => {
        setChatHistory(prev => ({
          ...prev,
          [fromUserId]: [
            ...(prev[fromUserId] || []),
            {
              fromUserId,
              msg,
              isSupport: false,
              timestamp: new Date(),
            },
          ],
        }));

        setCustomers(prev => {
          if (prev.some(c => c.userId === fromUserId)) return prev;
          return [
            ...prev,
            {
              userId: fromUserId,
              FullName: `Customer ${fromUserId.substring(0, 6)}`,
              email: "",
            },
          ];
        });
      });

      try {
        await conn.start();
        setConnection(conn);
        setConnectionStatus("Connected");

        try {
          const allCustomers = await conn.invoke("GetAllCustomers");
          if (Array.isArray(allCustomers)) {
            setCustomers(existing => {
              const merged = [...existing];
              allCustomers.forEach(c => {
                if (!merged.some(x => x.userId === c.userId)) merged.push(c);
              });
              return merged;
            });
          }
        } catch (cusErr) {
          console.warn("GetAllCustomers error:", cusErr);
        }
      } catch (e) {
        console.error("SignalR start failed:", e);
        setConnectionStatus("Failed");
      }
    };

    startConnection();

    return () => {
      isMounted.current = false;
      if (connRef.current) {
        connRef.current.stop().catch(() => {});
        connRef.current = null;
      }
    };
  }, []);


useEffect(() => {
  if (!connection) return;

  connection.on("CustomerTyping", (customerId) => {
    setTypingCustomer(customerId);

    setTimeout(() => {
      setTypingCustomer(null);
    }, 3000); // auto hide after 2 seconds
  });

  return () => connection.off("CustomerTyping");
}, [connection]);


  const messages = selectedUser ? chatHistory[selectedUser] || [] : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!connRef.current || !selectedUser || !message.trim()) return;

    const text = message;
    setMessage("");

    setChatHistory(prev => ({
      ...prev,
      [selectedUser]: [
        ...(prev[selectedUser] || []),
        {
          fromUserId: "support",
          msg: text,
          isSupport: true,
          timestamp: new Date(),
        },
      ],
    }));

    try {
      await connRef.current.invoke("SendPrivateMessage", selectedUser, text);
    } catch (e) {
      console.error("Send failed:", e);
      toast.error("Message send failed");

      setChatHistory(prev => {
        const list = [...(prev[selectedUser] || [])];
        if (list.length > 0) {
          list[list.length - 1].error = true;
        }
        return { ...prev, [selectedUser]: list };
      });
    }
  };

  const getDisplayName = (c) => c?.fullName || `Customer ${c?.userId.slice(0, 6)}`;
  const getInitials = (c) =>
    (c?.fullName || c?.userId || "C")
      .slice(0, 2)
      .toUpperCase();

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredCustomers = customers.filter(customer =>
    getDisplayName(customer).toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Tharilla</h2>
          <p className="text-gray-600 mb-6">This area is restricted to you. Support Team members only.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">Support Dashboard</h1>
            <div className={`w-3 h-3 rounded-full ${connectionStatus === "Connected" ? "bg-green-400" : "bg-red-400"} animate-pulse`}></div>
          </div>
          <p className="text-blue-100 text-sm opacity-90">
            {connectionStatus === "Connected" ? "Live connected" : connectionStatus}
          </p>
           </div>
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <p>No customers found</p>
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <div
                key={customer.userId}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                  selectedUser === customer.userId
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedUser(customer.userId)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {getInitials(customer)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {getDisplayName(customer)}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {customer.email || "No email provided"}
                  </p>
                </div>
                {chatHistory[customer.userId]?.length > 0 && (
                  <div className="ml-2 text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {chatHistory[customer.userId].length}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(customers.find(c => c.userId === selectedUser))}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {getDisplayName(customers.find(c => c.userId === selectedUser))}
                    </h2>
                    <div>
            {typingCustomer === selectedUser && (
             <h2 className="text-xs text-gray-900">Typing...</h2>
               )}
</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                 
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-blue-50 p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-20">💬</div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2"> Bruh No messages yet</h3>
                  <p className="text-gray-400">Start a conversation with this customer</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isSupport ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex max-w-xs lg:max-w-md">
                      {!message.isSupport && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                          {getInitials(customers.find(c => c.userId === message.fromUserId))}
                        </div>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          message.isSupport
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        } ${message.error ? "border border-red-300 bg-red-50" : ""}`}
                      >
                        <p className="text-sm">{message.msg}</p>
                        <div className={`text-xs mt-1 ${message.isSupport ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                          {message.error && " • Failed to send"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
                    value={message}
                    onChange={(e) => {
                       setMessage(e.target.value);
                       connRef.current?.invoke("CustomerTyping", selectedUser).catch(() => {});
                          }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    message.trim()
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </div>
              <div className="flex justify-center mt-6 text-sm text-gray-500">
                <div className="flex space-x-6">
                  <span className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
                    <span>📧</span>
                    <span>Email</span>
                  </span>
                  <span className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </span>
                  <span className="flex items-center space-x-2 cursor-pointer hover:text-pink-600">
                    <span>📱</span>
                    <span>Instagram</span>
                  </span>
                  <span className="flex items-center space-x-2 cursor-pointer hover:text-blue-400">
                    <span>🐦</span>
                    <span>Twitter</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">💬</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Dealsy Support Chat</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Select a customer from the sidebar to start a conversation and provide exceptional support.
              </p>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Connect through other channels:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
                    <span className="text-green-100">💚</span>
                    <span>WhatsApp</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 cursor-pointer transition-colors">
                    <span className="text-pink-600">📷</span>
                    <span>Instagram</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                    <span className="text-blue-400">🐦</span>
                    <span>Twitter</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                    <span className="text-purple-600">✈️</span>
                    <span>Telegram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportChatCustomer;
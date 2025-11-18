import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei'
function SupportChat() {
  // --- hooks ---
  const [connection, setConnection] = useState(null);
  const [customers, setCustomers] = useState([]); // Now will store objects with id, fullName, email
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const chatEndRef = useRef(null);
  const connRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const startConnection = async () => {
      setConnectionStatus("Connecting...");
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setConnectionStatus("No token");
          console.warn("Please login first: no authToken in localStorage.");
          return;
        }

        const decoded = jwtDecode(token);
        const role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          decoded.role ||
          decoded["role"];

        const isSupport = role === "SupportTeam" || role === "4" || Number(role) === 4;
        if (!isSupport) {
          setConnectionStatus("Unauthorized");
          console.warn("Access denied. Support team only.");
          return;
        }

        setIsAuthorized(true);

        const hubUrl = `https://localhost:7001/chatHub?access_token=${encodeURIComponent(token)}`;

        const conn = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl)
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        connRef.current = conn;

        conn.onreconnecting(err => {
          console.log("reconnecting", err);
          if (isMounted.current) setConnectionStatus("Reconnecting...");
        });
        conn.onreconnected(id => {
          console.log("reconnected", id);
          if (isMounted.current) setConnectionStatus("Connected");
        });
        conn.onclose(err => {
          console.log("closed", err);
          if (isMounted.current) {
            setConnectionStatus("Disconnected");
            setConnection(null);
          }
        });

        conn.on("ReceiveMessage", (fromUserId, msg) => {
          setChatHistory(prev => {
            const list = prev[fromUserId] ? [...prev[fromUserId]] : [];
            list.push({ fromUserId, msg, isSupport: false, timestamp: new Date() });
            return { ...prev, [fromUserId]: list };
          });

          // Check if we already have this customer in our list
          setCustomers(prev => {
            const exists = prev.some(customer => customer.userId === fromUserId);
            if (exists) return prev;
            
            // If not, add a placeholder customer object
            return [...prev, { 
              userId: fromUserId, 
              fullName: `Customer ${fromUserId.substring(0, 8)}...`,
              email: '' 
            }];
          });
        });

        await conn.start();
        if (!isMounted.current) return;

        setConnection(conn);
        setConnectionStatus("Connected");

        try {
          // This will now return an array of customer objects with names
          const allCustomers = await conn.invoke("GetAllCustomers");
          if (isMounted.current && Array.isArray(allCustomers)) {
            setCustomers(prev => {
              // Merge existing customers with new ones, avoiding duplicates
              const merged = [...prev];
              allCustomers.forEach(newCustomer => {
                if (!merged.some(existing => existing.userId === newCustomer.userId)) {
                  merged.push(newCustomer);
                }
              });
              return merged;
            });
          }
        } catch (invokeErr) {
          console.warn("GetAllCustomers failed", invokeErr);
        }
      } catch (e) {
        console.error("SignalR start failed:", e);
        if (isMounted.current) {
          setConnectionStatus("Failed");
        }
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

  const messages = selectedUser ? chatHistory[selectedUser] || [] : [];
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!connRef.current || !selectedUser || !message.trim()) return;
    try {
      setChatHistory(prev => ({
        ...prev,
        [selectedUser]: [
          ...(prev[selectedUser] || []),
          { fromUserId: "support", msg: message, isSupport: true, timestamp: new Date() }
        ]
      }));
      const txt = message;
      setMessage("");
      await connRef.current.invoke("SendPrivateMessage", selectedUser, txt);
    } catch (e) {
      console.error("Failed to send:", e);
      setChatHistory(prev => {
        const list = [...(prev[selectedUser] || [])];
        if (list.length) {
          const last = list[list.length - 1];
          list[list.length - 1] = { ...last, error: true };
        }
        return { ...prev, [selectedUser]: list };
      });
      alert("Failed to send message");
    }
  };

  // Helper function to get display name for a user
  const getDisplayName = (customer) => {
    if (customer.fullName && customer.fullName !== "Unknown Customer") {
      return customer.fullName;
    }
    return `Customer ${customer.userId.substring(0, 8)}...`;
  };

  // Helper function to get initials for avatar
  const getInitials = (customer) => {
    if (customer.fullName && customer.fullName !== "Unknown Customer") {
      return customer.fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return customer.userId.substring(0, 2).toUpperCase();
  };





if (!isAuthorized) {
  return (
    <div className="flex items-center justify-center h-screen bg-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div key={i} 
               className={`absolute w-1 h-1 bg-green-400 rounded-full animate-pulse`}
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 2}s`,
                 animationDuration: `${1 + Math.random() * 2}s`
               }}></div>
        ))}
      </div>
      
      <div className="animate-glitch text-red-400 font-mono text-xl font-bold 
                     border border-green-400/30 bg-black/80 backdrop-blur-lg
                     px-8 py-6 relative group hover:border-red-400/50 transition-all duration-500">
        <div className="animate-ping-slow absolute -inset-1 bg-red-400/20 rounded-lg blur-sm"></div>
        <span className="relative z-10">🚫 ACCESS DENIED. AUTHORIZED PERSONNEL ONLY.</span>
      </div>
    </div>
  );
}
  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* LEFT — User List */}
      <div className="w-80 bg-white border-r shadow-md flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 bg-[#0084ff] text-white flex items-center justify-between shadow">
          <h2 className="text-lg font-semibold">Support Panel</h2>
          <span className="text-sm opacity-90">
            {connectionStatus === "Connected" ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-3">
          {customers.length === 0 && (
            <p className="text-gray-500 text-center mt-10 text-sm">No customers yet</p>
          )}

          {customers.map((customer, i) => (
            <div
              key={customer.userId}
              onClick={() => setSelectedUser(customer.userId)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition ${
                selectedUser === customer.userId
                  ? "bg-[#e7f3ff]"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                {getInitials(customer)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{getDisplayName(customer)}</div>
                <div className="text-xs text-gray-500 truncate">
                  {customer.email || `ID: ${customer.userId.substring(0, 10)}...`}
                </div>
                <div className="text-xs text-gray-400">
                  {chatHistory[customer.userId]?.length || 0} messages
                </div>
              </div>
            </div>//
          ))}
        </div>
      </div>

      {/* RIGHT — Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="px-5 py-4 bg-white shadow flex items-center gap-3 border-b">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                {getInitials(customers.find(c => c.userId === selectedUser) || { userId: selectedUser })}
              </div>
              <div>
                <h3 className="font-medium">
                  {getDisplayName(customers.find(c => c.userId === selectedUser) || { userId: selectedUser })}
                </h3>
                <p className="text-xs text-gray-500">
                  {customers.find(c => c.userId === selectedUser)?.email || 'Customer'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#eef1f4]">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  No messages yet. Say hello 👋
                </p>
              ) : (
                messages.map((m, index) => (
                  <div
                    key={index}
                    className={`flex items-end ${
                      m.isSupport ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!m.isSupport && (
                      <div className="w-9 h-9 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs font-bold">
                        {getInitials(customers.find(c => c.userId === m.fromUserId) || { userId: m.fromUserId })}
                      </div>
                    )}

                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow ${
                        m.isSupport
                          ? "bg-[#0084ff] text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {m.msg}
                      {m.error && (
                        <p className="text-xs text-red-600 mt-1">Failed</p>
                      )}
                    </div>

                    {m.isSupport && (
                      <div className="w-9 h-9 rounded-full bg-[#0084ff] ml-2 flex items-center justify-center text-white font-bold text-xs">
                        S
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t flex items-center gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-3 rounded-full border bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#0084ff]"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-[#0084ff] text-white px-6 py-3 rounded-full shadow hover:bg-[#006fe0] disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a customer to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportChat;
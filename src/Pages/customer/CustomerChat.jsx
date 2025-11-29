import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";

function CustomerChat() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);

  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // =========================================================
  // 1. CONNECT + AUTH + SIGNALR SETUP
  // =========================================================
  useEffect(() => {
    const connect = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Please login first");
          return;
        }

        const decoded = jwtDecode(token);
        const uid =
          decoded.nameid ||
          decoded.sub ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"];
        const role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          decoded.role ||
          decoded["role"];

        const isCustomer = role === "Customer" || role === "3" || Number(role) === 3;
        if (!isCustomer) {
          alert("Access denied. Customers only.");
          return;
        }

        setUserId(uid);
        setIsAuthorized(true);
        setIsConnecting(true);
        setConnectionStatus("Connecting...");

        const hubUrl = `https://localhost:7001/chatHub?access_token=${encodeURIComponent(token)}`;

        const conn = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl)
          .withAutomaticReconnect([0, 1000, 3000, 5000, 10000, 15000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Receive message from Support Agent
        conn.on("ReceiveMessage", (from, msg) => {
          setMessages(prev => [
            ...prev,
            {
              fromUserId: from,
              msg,
              isCustomer: false,
              timestamp: new Date(),
              id: Date.now() + Math.random()
            }
          ]);
          setAgentTyping(false);
        });

        // Agent is typing indicator
        conn.on("AgentTyping", () => {
          setAgentTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setAgentTyping(false), 4000);
        });

        conn.onreconnecting(() => setConnectionStatus("Reconnecting..."));
        conn.onreconnected(() => setConnectionStatus("Connected"));
        conn.onclose(() => {
          setConnectionStatus("Disconnected");
          setIsConnecting(false);
        });

        await conn.start();
        setConnection(conn);
        setConnectionStatus("Connected");
        setIsConnecting(false);

        // Offline messages are auto-delivered by backend on connect
      } catch (e) {
        console.error("SignalR connection failed:", e);
        setConnectionStatus("Failed");
        setIsConnecting(false);
        alert("Chat connection failed. Please refresh.");
      }
    };

    connect();

    return () => {
      connection?.stop();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // =========================================================
  // 2. SEND MESSAGE + TYPING INDICATOR
  // =========================================================
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (connection && e.target.value.trim()) {
      connection.invoke("CustomerTyping").catch(() => {});
    }
  };

  const sendMessage = async () => {
    if (!connection || !message.trim()) return;

    const txt = message.trim();
    setMessage("");

    const tempId = Date.now();
    setMessages(prev => [
      ...prev,
      {
        fromUserId: userId,
        msg: txt,
        isCustomer: true,
        timestamp: new Date(),
        id: tempId,
        status: "sending"
      }
    ]);

    try {
      await connection.invoke("SendToSupport", txt);
      setMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...m, status: "sent" } : m))
      );
    } catch (e) {
      console.error("Send failed:", e);
      setMessage(txt);
      setMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...m, status: "failed" } : m))
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // 3. AUTO SCROLL
  // =========================================================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentTyping]);

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // =========================================================
  // 4. UI RENDERS
  // =========================================================
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md">
          <div className="text-6xl mb-6">Locked</div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Access Denied</h2>
          <p className="text-gray-600">This chat is for customers only.</p>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#97A36D] mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800">Connecting to Support...</h3>
          <p className="text-gray-500 mt-2">{connectionStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7EB] to-[#E8F0D8] flex flex-col">
      {/* Header */}
      <div className="bg-[#97A36D] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Customer Support</h1>
                <p className="text-white/90">We're online and ready to help you</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-5 py-3 rounded-full text-sm font-semibold flex items-center space-x-2 ${connectionStatus === "Connected" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <span className={`w-3 h-3 rounded-full ${connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"} animate-pulse`}></span>
                <span>{connectionStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#97A36D] text-white px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-bold">Support Team</h3>
                  <p className="text-white/80 text-sm">Typically replies in 2-5 minutes</p>
                </div>
              </div>
              <div className="text-sm bg-white/20 px-4 py-2 rounded-full">
                24/7 Available
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6 opacity-30">Chat</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">Welcome to Dealsy Support</h3>
                <p className="text-gray-500 max-w-lg mx-auto">
                  Send us a message and our team will assist you right away. We're here 24/7!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.isCustomer ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex max-w-lg">
                      {!m.isCustomer && (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0 shadow-lg">
                          S
                        </div>
                      )}
                      <div
                        className={`px-6 py-4 rounded-3xl shadow-md ${
                          m.isCustomer
                            ? "bg-[#97A36D] text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        } ${m.status === "failed" ? "border-2 border-red-400 bg-red-50" : ""}`}
                      >
                        <p className="text-base leading-relaxed break-words">{m.msg}</p>
                        <div className={`text-xs mt-2 flex items-center space-x-2 ${m.isCustomer ? "text-white/80" : "text-gray-500"}`}>
                          <span>{formatTime(m.timestamp)}</span>
                          {m.status === "sending" && <span className="animate-pulse">Sending...</span>}
                          {m.status === "sent" && <span>Delivered</span>}
                          {m.status === "failed" && <span className="text-red-600">Failed</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Agent Typing Indicator */}
                {agentTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-3 bg-white px-5 py-4 rounded-3xl border border-gray-200 shadow-md ml-14">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Agent is typing...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-gray-200 bg-white p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here... (Press Enter to send)"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-[#97A36D] focus:outline-none text-lg transition-all duration-200"
                  disabled={connectionStatus !== "Connected"}
                  maxLength={1000}
                />
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {connectionStatus === "Connected" && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || connectionStatus !== "Connected"}
                className="px-10 py-5 bg-[#97A36D] text-white rounded-2xl font-bold text-lg hover:bg-[#7e8a5a] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Send</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              Your messages are secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerChat;
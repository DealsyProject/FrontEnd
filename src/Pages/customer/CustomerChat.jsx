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
  const chatEndRef = useRef(null);

  // --------------------------------------------------------------
  // 1. Connect + auth
  // --------------------------------------------------------------
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

        conn.onreconnecting(() => setConnectionStatus("Reconnecting..."));
        conn.onreconnected(() => setConnectionStatus("Connected"));
        conn.onclose(() => {
          setConnectionStatus("Disconnected");
          setIsConnecting(false);
        });

        conn.on("ReceiveMessage", (from, msg) => {
          setMessages(prev => [
            ...prev,
            {
              fromUserId: from,
              msg,
              isCustomer: from === uid,
              timestamp: new Date(),
              id: Date.now() + Math.random()
            }
          ]);
        });

        await conn.start();
        setConnection(conn);
        setConnectionStatus("Connected");
        setIsConnecting(false);

        await conn.invoke("CheckPendingMessages");
      } catch (e) {
        console.error(e);
        setConnectionStatus("Failed");
        setIsConnecting(false);
        alert("Chat connection failed");
      }
    };

    connect();

    return () => connection?.stop();
  }, []);

  // --------------------------------------------------------------
  // 2. Send message
  // --------------------------------------------------------------
  const sendMessage = async () => {
    if (!connection || !message.trim()) return;
    const txt = message.trim();
    setMessage("");

    try {
      await connection.invoke("SendPrivateMessage", "support", txt);
      setMessages(prev => [
        ...prev,
        {
          fromUserId: userId,
          msg: txt,
          isCustomer: true,
          timestamp: new Date(),
          id: Date.now() + Math.random(),
          status: "sent"
        }
      ]);
    } catch (e) {
      console.error(e);
      setMessage(txt);
      setMessages(prev => [
        ...prev,
        {
          fromUserId: "system",
          msg: "Failed to send. Try again.",
          isCustomer: false,
          timestamp: new Date(),
          id: Date.now() + Math.random(),
          isError: true
        }
      ]);
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --------------------------------------------------------------
  // 3. Auto-scroll
  // --------------------------------------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const formatTime = ts =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // --------------------------------------------------------------
  // 4. UI guards
  // --------------------------------------------------------------
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7EB]">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md mx-4">
          <div className="text-red-600 text-xl font-semibold mb-2">Access Denied</div>
          <div className="text-gray-600">This chat is for customers only.</div>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7EB]">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#97A36D] mx-auto mb-4" />
          <div className="text-gray-600">Connecting to chat service...</div>
          <div className="text-sm text-gray-500 mt-2">{connectionStatus}</div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // 5. Main UI
  // --------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F7EB] flex flex-col">
      {/* Header */}
      <div className="bg-[#97A36D] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#97A36D] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Customer Support</h1>
                <p className="text-white text-opacity-80">We're here to help you</p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  connectionStatus === "Connected"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : connectionStatus.includes("Reconnecting") || connectionStatus === "Connecting"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    connectionStatus === "Connected"
                      ? "bg-green-500"
                      : connectionStatus.includes("Reconnecting") || connectionStatus === "Connecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                {connectionStatus}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#97A36D] text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold">Support Agent</h3>
                  <p className="text-white text-opacity-80 text-sm">Online • 24/7 Support</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-opacity-80 text-sm">Avg. response: 2-5 min</div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-12 ">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Support Chat</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Start a conversation with our support team. We're here to help you with any questions or issues.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex ${m.isCustomer ? "justify-end" : "justify-start"} ${m.isError ? "animate-pulse" : ""}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${m.fromUserId === "system" ? "w-full text-center" : ""}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          m.isError
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : m.isCustomer
                            ? "bg-[#97A36D] text-white rounded-br-none"
                            : m.fromUserId === "system"
                            ? "bg-yellow-50 text-yellow-700 text-center border border-yellow-200"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        <div className="break-words">{m.msg}</div>
                        {!m.isError && m.fromUserId !== "system" && (
                          <div className={`text-xs mt-2 ${m.isCustomer ? "text-white text-opacity-80" : "text-gray-500"}`}>
                            {formatTime(m.timestamp)}
                          </div>
                        )}
                      </div>
                      {m.status === "sending" && (
                        <div className="text-xs text-gray-500 text-right mt-1">Sending...</div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#97A36D] focus:border-transparent transition-all duration-200"
                    placeholder="Type your message here... (Press Enter to send)"
                    disabled={connectionStatus !== "Connected"}
                    maxLength={500}
                  />
                  {connectionStatus === "Connected" && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {connectionStatus === "Connected" ? "✓ Connected to support" : "Connecting..."}
                  </span>
                  <span className="text-xs text-gray-500">{message.length}/500</span>
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || connectionStatus !== "Connected"}
                className="bg-[#97A36D] text-white px-8 py-4 rounded-xl hover:bg-[#A0B06B] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center space-x-2 min-w-20 shadow-sm"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-center text-gray-500 text-xs mt-4">
              💡 Tip: Describe your issue clearly for faster support
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Help Section */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-gray-600 text-sm mb-4">
              Support available 24/7 • Average response time: 2-5 minutes
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/support-faq-options"
                className="flex items-center space-x-2 bg-[#97A36D] bg-opacity-10 text-[#97A36D] hover:bg-opacity-20 rounded-lg px-6 py-3 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-amber-50">Browse FAQ & Help Center</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerChat;

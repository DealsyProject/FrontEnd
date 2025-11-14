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
          honour: Date.now() + Math.random(),
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">Access Denied</div>
          <div className="text-gray-600">This chat is for customers only.</div>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
    <div className="p-4 bg-gray-50 min-h-screen flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Support Chat</h2>
            <p className="text-gray-600">Get help from our support team</p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === "Connected"
                  ? "bg-green-100 text-green-800"
                  : connectionStatus.includes("Reconnecting") || connectionStatus === "Connecting"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  connectionStatus === "Connected"
                    ? "bg-green-500"
                    : connectionStatus.includes("Reconnecting") || connectionStatus === "Connecting"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              {connectionStatus}
            </div>
            <div className="text-xs text-gray-500 mt-1">User ID: {userId}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">Chat Bubble</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
              <p className="text-gray-500">Start a conversation with our support team!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex ${m.isCustomer ? "justify-end" : "justify-start"} ${
                    m.isError ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      m.fromUserId === "system" ? "w-full text-center" : ""
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        m.isError
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : m.isCustomer
                          ? "bg-blue-500 text-white rounded-br-none"
                          : m.fromUserId === "system"
                          ? "bg-yellow-100 text-yellow-800 text-center"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <div className="break-words">{m.msg}</div>
                      {!m.isError && m.fromUserId !== "system" && (
                        <div
                          className={`text-xs mt-1 ${m.isCustomer ? "text-blue-100" : "text-gray-500"}`}
                        >
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

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here... (Enter to send)"
                disabled={connectionStatus !== "Connected"}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>
                  {connectionStatus === "Connected" ? "Connected to support" : "Connecting..."}
                </span>
                <span>{message.length}/500</span>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim() || connectionStatus !== "Connected"}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold min-w-20"
            >
              Send
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-3">
            Tip: Describe your issue clearly for faster support
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs mt-4">
        Support hours: 24/7 • Average response time: 5-10 minutes
      </div>
    </div>
  );
}

export default CustomerChat;
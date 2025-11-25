// SupportChatToAdmin.jsx
import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

function SupportChatToAdmin() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      setIsAuthorized(false);
      return;
    }

    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
    const isSupport = role === "SupportTeam" || Number(role) === 4;

    if (!isSupport) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7001/chatHub?access_token=${encodeURIComponent(token)}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn.on("ReceiveSupportMessage", (fromUserId, msg) => {
      setMessages(prev => [...prev, { from: fromUserId, msg, isMe: true, timestamp: new Date() }]);
    });

    conn.on("ReceiveAdminMessage", (fromAdminId, msg) => {
      setMessages(prev => [...prev, { from: fromAdminId, msg, isMe: false, timestamp: new Date(), isAdmin: true }]);
    });

    conn.onreconnecting(() => setConnectionStatus("Reconnecting..."));
    conn.onreconnected(() => setConnectionStatus("Connected"));
    conn.onclose(() => setConnectionStatus("Disconnected"));

    conn.start()
      .then(() => {
        setConnection(conn);
        setConnectionStatus("Connected");
        toast.success("Connected to Admin");
      })
      .catch(err => {
        console.error(err);
        setConnectionStatus("Failed");
        toast.error("Failed to connect");
      });

    return () => conn?.stop();
  }, []);

  const sendMessage = async () => {
    if (!connection || !message.trim()) return;
    const text = message.trim();
    setMessage("");

    try {
      await connection.invoke("SendToAdmin", text);
      setMessages(prev => [...prev, { from: "You", msg: text, isMe: true, timestamp: new Date() }]);
    } catch (err) {
      toast.error("Failed to send");
      setMessage(text);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p>Only Support Team members can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              Admin
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Communication</h1>
              <p className="opacity-90">Direct line to Admin</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm ${connectionStatus === "Connected" ? "bg-green-400" : "bg-red-400"} text-white`}>
            {connectionStatus}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">Admin</div>
                <p>No messages yet. Send a message to Admin when needed.</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm ${m.isMe ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : m.isAdmin ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {!m.isMe && <div className="text-xs opacity-80 mb-1">{m.isAdmin ? "Admin" : m.from}</div>}
                    <p>{m.msg}</p>
                    <div className="text-xs mt-1 opacity-80">{formatTime(m.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type your message to Admin..."
                className="flex-1 px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || connectionStatus !== "Connected"}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportChatToAdmin;
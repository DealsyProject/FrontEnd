// AdminChatToSupport.jsx
import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

function AdminChatToSupport() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineSupport, setOnlineSupport] = useState([]);
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      return;
    }

    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
    if (role !== "Admin" && Number(role) !== 5) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7001/chatHub?access_token=${encodeURIComponent(token)}`)
      .withAutomaticReconnect()
      .build();

    conn.on("ReceiveAdminMessage", (fromSupportId, msg) => {
      setMessages(prev => [...prev, { from: fromSupportId, msg, isMe: false, timestamp: new Date() }]);
      // Update online list
      setOnlineSupport(prev => {
        if (!prev.includes(fromSupportId)) return [...prev, fromSupportId];
        return prev;
      });
    });

    conn.on("ReceiveSupportMessage", (fromSupportId, msg) => {
      setMessages(prev => [...prev, { from: fromSupportId, msg, isMe: true, timestamp: new Date() }]);
    });

    conn.onreconnecting(() => setConnectionStatus("Reconnecting..."));
    conn.onreconnected(() => setConnectionStatus("Connected"));
    conn.onclose(() => setConnectionStatus("Disconnected"));

    conn.start()
      .then(async () => {
        setConnection(conn);
        setConnectionStatus("Connected");
        toast.success("Connected to Support Team");
        // Optionally fetch online support via DB or keep via messages
      })
      .catch(err => {
        console.error(err);
        toast.error("Connection failed");
      });

    return () => conn?.stop();
  }, []);

  const sendMessage = async () => {
    if (!connection || !message.trim()) return;
    const text = message.trim();
    setMessage("");

    try {
      await connection.invoke("SendToSupport", text);
      setMessages(prev => [...prev, { from: "You (Admin)", msg: text, isMe: true, timestamp: new Date() }]);
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Restricted</h1>
          <p>Only Admin can access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-700 p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin → Support Team Broadcast</h1>
            <p className="opacity-90">Message all online support agents instantly</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Online Agents: {onlineSupport.length}</span>
            <div className={`w-4 h-4 rounded-full ${connectionStatus === "Connected" ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-8">
        <div className="bg-gray-800 rounded-2xl shadow-2xl h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-8xl mb-6">Support Team</div>
                <p>No messages yet. Your messages will appear here and be sent to all online support agents.</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-lg px-6 py-4 rounded-2xl ${m.isMe ? "bg-gradient-to-r from-red-600 to-purple-700" : "bg-gray-700"} shadow-lg`}>
                    {!m.isMe && <div className="text-xs opacity-75 mb-2">Support: {m.from}</div>}
                    <p className="text-lg">{m.msg}</p>
                    <div className="text-xs mt-2 opacity-70">{formatTime(m.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-gray-900 border-t border-gray-700">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Broadcast message to all Support agents..."
                className="flex-1 px-6 py-5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 text-white text-lg"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-10 py-5 bg-gradient-to-r from-red-600 to-purple-700 rounded-xl font-bold text-lg hover:shadow-2xl transition disabled:opacity-50"
              >
                Send to All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChatToSupport;
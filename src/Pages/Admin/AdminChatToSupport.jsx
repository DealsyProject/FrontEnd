// AdminSupportChat.jsx
import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

function AdminSupportChat() {
  const [connection, setConnection] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState({}); // { agentId: [messages] }
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
    if (role !== "Admin" && Number(role) !== 5) return;

    setIsAuthorized(true);

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7001/chatHub?access_token=${encodeURIComponent(token)}`)
      .withAutomaticReconnect()
      .build();

    // Receive message FROM support agent
    conn.on("ReceiveAdminMessage", (fromAgentId, msg) => {
      setMessages(prev => ({
        ...prev,
        [fromAgentId]: [...(prev[fromAgentId] || []), {
          from: fromAgentId,
          msg,
          isMe: false,
          timestamp: new Date()
        }]
      }));
    });

    conn.onreconnecting(() => setConnectionStatus("Reconnecting..."));
    conn.onreconnected(() => setConnectionStatus("Connected"));
    conn.onclose(() => setConnectionStatus("Disconnected"));

    conn.start()
      .then(async () => {
        setConnection(conn);
        setConnectionStatus("Connected");
        toast.success("Admin connected to support system");

        // Load all support agents
        try {
          const supportList = await conn.invoke("GetSupportTeam");
          setAgents(supportList.map(a => ({
            userId: a.userId,
            fullName: a.fullName || "Support Agent",
            email: a.email || ""
          })));
        } catch (err) {
          console.error("Failed to load agents:", err);
          toast.error("Could not load support team");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Connection failed");
      });

    return () => conn?.stop();
  }, []);

  const sendMessage = async () => {
    if (!connection || !selectedAgent || !message.trim()) return;

    const text = message.trim();
    setMessage("");

    // Show message immediately (optimistic UI)
    setMessages(prev => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), {
        from: "You (Admin)",
        msg: text,
        isMe: true,
        timestamp: new Date()
      }]
    }));

    try {
      await connection.invoke("SendToSupportAgent", selectedAgent, text);
    } catch (err) {
      toast.error("Failed to send message");
      // Optional: mark last message as failed
      setMessages(prev => ({
        ...prev,
        [selectedAgent]: prev[selectedAgent].map((m, i, arr) =>
          i === arr.length - 1 ? { ...m, error: true } : m
        )
      }));
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedAgent]]);

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-4xl">
        Access Denied — Admin Only
      </div>
    );
  }

  const currentChat = selectedAgent ? messages[selectedAgent] || [] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 bg-gradient-to-b from-purple-700 to-pink-700">
          <h1 className="text-2xl font-bold">Support Agents</h1>
          <p className="text-sm opacity-90">Click to chat privately</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {agents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No agents found</div>
          ) : (
            agents.map(agent => (
              <div
                key={agent.userId}
                onClick={() => setSelectedAgent(agent.userId)}
                className={`p-4 flex items-center space-x-4 cursor-pointer transition-all ${
                  selectedAgent === agent.userId ? "bg-purple-700" : "hover:bg-gray-700"
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {agent.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-gray-800 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{agent.fullName}</h3>
                  <p className="text-xs opacity-75">{agent.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedAgent ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="text-8xl mb-6">Select Agent</div>
              <p className="text-xl opacity-75">Click an agent to start private chat</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-purple-700 to-pink-700 p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {agents.find(a => a.userId === selectedAgent)?.fullName[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {agents.find(a => a.userId === selectedAgent)?.fullName}
                  </h2>
                  <p className="opacity-90">Private Admin Chat</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-900">
              {currentChat.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                currentChat.map((m, i) => (
                  <div key={i} className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-lg px-6 py-4 rounded-2xl ${m.isMe ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-700"} shadow-lg`}>
                      {!m.isMe && <div className="text-xs opacity-75 mb-1">Agent</div>}
                      <p className="text-lg">{m.msg}</p>
                      <div className="text-xs mt-2 opacity-70">{formatTime(m.timestamp)}</div>
                      {m.error && <div className="text-red-400 text-xs mt-1">Failed to send</div>}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-gray-800 border-t border-gray-700">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={`Message ${agents.find(a => a.userId === selectedAgent)?.fullName}...`}
                  className="flex-1 px-6 py-5 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:shadow-2xl transition disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminSupportChat;
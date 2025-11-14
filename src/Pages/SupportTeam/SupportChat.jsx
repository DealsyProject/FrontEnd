import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";

function SupportChat() {
  // --- hooks (ALL hooks must be here, before any return) ---
  const [connection, setConnection] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const chatEndRef = useRef(null);
  const connRef = useRef(null); // stable ref to current HubConnection
  const isMounted = useRef(true);

  // --------------------------------------------------------------
  // 1. Connect + auth
  // --------------------------------------------------------------
  useEffect(() => {
    isMounted.current = true;
    const startConnection = async () => {
      setConnectionStatus("Connecting...");
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          // don't early-return the component (hooks must remain consistent)
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

        // store ref immediately so cleanup has the correct instance
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

        // ReceiveMessage handler
        conn.on("ReceiveMessage", (fromUserId, msg) => {
          // push message into chatHistory for that user
          setChatHistory(prev => {
            const list = prev[fromUserId] ? [...prev[fromUserId]] : [];
            list.push({ fromUserId, msg, isSupport: false, timestamp: new Date() });
            return { ...prev, [fromUserId]: list };
          });

          setCustomers(prev => (prev.includes(fromUserId) ? prev : [...prev, fromUserId]));
        });

        await conn.start();
        if (!isMounted.current) return;

        setConnection(conn);
        setConnectionStatus("Connected");

        // initial fetch of all customers (server method)
        try {
          const all = await conn.invoke("GetAllCustomers");
          if (isMounted.current && Array.isArray(all)) {
            setCustomers(prev => [...new Set([...prev, ...all])]);
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
      // stop the exact connection created
      if (connRef.current) {
        connRef.current.stop().catch(() => {});
        connRef.current = null;
      }
    };
  }, []); // run once

  // --------------------------------------------------------------
  // 2. Auto-scroll — keep this declared before any early return
  // --------------------------------------------------------------
  const messages = selectedUser ? chatHistory[selectedUser] || [] : [];
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --------------------------------------------------------------
  // 3. Send message
  // --------------------------------------------------------------
  const sendMessage = async () => {
    if (!connRef.current || !selectedUser || !message.trim()) return;
    try {
      // optimistic UI push
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
      // mark the last message as failed (simple fallback)
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

  // --------------------------------------------------------------
  // 4. UI guard (now safe because all hooks are declared above)
  // --------------------------------------------------------------
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-xl">Access Denied. Support Team Only.</div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // 5. Render
  // --------------------------------------------------------------
  return (
    <div className="flex h-screen">
      {/* Customer list */}
      <div className="w-1/4 border-r bg-gray-100 p-4 overflow-y-auto">
        <h3 className="font-bold mb-3 flex justify-between items-center">
          Customers ({customers.length})
          <span className={`ml-2 text-sm ${connectionStatus === "Connected" ? "text-green-600" : "text-red-600"}`}>
            {connectionStatus}
          </span>
        </h3>

        {customers.length === 0 && <p className="text-gray-500 text-sm italic">No customers found</p>}

        {customers.map((id, i) => (
          <div
            key={`${id}-${i}`}
            onClick={() => setSelectedUser(id)}
            className={`p-3 cursor-pointer rounded mb-2 ${id === selectedUser ? "bg-green-500 text-white" : "bg-white hover:bg-gray-200 border"}`}
          >
            <div className="font-medium">Customer ID: {id}</div>
            <div className="text-sm text-gray-600">
              {chatHistory[id]?.length > 0 ? `${chatHistory[id].length} messages` : "No messages"}
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col p-4">
        {selectedUser ? (
          <>
            <div className="border-b pb-2 mb-3">
              <h3 className="font-semibold">Chat with Customer: {selectedUser}</h3>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-white">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No messages yet. Start a conversation!</p>
              ) : (
                messages.map((m, i) => (
                  <div key={`${selectedUser}-${i}`} className={`my-2 flex ${m.isSupport ? "justify-end" : "justify-start"}`}>
                    <div className={`inline-block px-4 py-2 rounded-lg max-w-md break-words ${m.isSupport ? "bg-green-500 text-white" : "bg-blue-100 text-gray-900"}`}>
                      {m.msg}
                      {m.error && <div className="text-xs text-red-600 mt-1">Failed to deliver</div>}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex mt-3">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-green-600 text-white px-6 rounded-r-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Select a customer to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportChat;
//sss
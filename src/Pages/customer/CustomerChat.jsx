// src/pages/customer/CustomerSupport.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import { FaPaperPlane } from "react-icons/fa";

export default function CustomerChat() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Seek customer support with Complaint / Suggestions / Experience." },
    { id: 2, from: "bot", text: "Please select what help you need about:" },
  ]);

  const [stage, setStage] = useState(0);
  const [input, setInput] = useState("");
  const scrollerRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const pushBot = (text) => {
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now(), from: "bot", text }]);
    }, 350);
  };

  const handleOption = (option) => {
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: option }]);

    if (stage === 0) {
      setStage(1);
      pushBot(`"Customer Complaint about ${option} / delivery / experience" →`);
      setTimeout(() => pushBot("Please select follow-up:"), 700);
    } else if (stage === 1) {
      setStage(2);
      pushBot(`Thanks — you chose: ${option}. Please type details below.`);
    } else {
      pushBot(`Received: ${option}. Our team will review and contact you.`);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: trimmed }]);
    setInput("");
    pushBot("Thanks for your message — our support team will review and get back soon.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-400">
      <Navbar />

      <main className="flex-grow flex justify-center items-stretch">
        <div className="w-full max-w-7xl flex h-[calc(100vh-89px)]  overflow-hidden shadow-md">
          {/* Sidebar */}
          <aside className="w-64 bg-[#1f1f21] text-white flex flex-col justify-between">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-8">Customer Support</h2>

              <nav className="flex flex-col gap-3 text-sm">
                {["Light mode", "Dealsy Discord", "Updates & FAQ", "Call support"].map((item) => (
                  <button
                    key={item}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition"
                  >
                    <span className="w-2 h-2 bg-white rounded-full" />
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Chat Section */}
          <section className="flex-1 bg-[#34323a] text-white flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 text-xl font-semibold">
              Customer Support
            </div>

            {/* Scrollable Chat Area */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
                      m.from === "bot"
                        ? "bg-gray-700 text-white rounded-tl-none"
                        : "bg-gray-500/40 text-white rounded-tr-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="p-4 border-t border-gray-700 flex flex-wrap justify-center gap-3">
              {stage === 0 &&
                ["product", "delivery", "experience"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="px-4 py-2 rounded-md bg-gray-500/40 text-white text-sm hover:bg-gray-600 transition"
                  >
                    {opt}
                  </button>
                ))}

              {stage === 1 && (
                <>
                  <button
                    onClick={() =>
                      handleOption("Customer Complaint about product/delivery/experience")
                    }
                    className="px-4 py-2 rounded-md bg-gray-500/40 text-white text-sm hover:bg-gray-600 transition"
                  >
                    Complaint →
                  </button>
                  <button
                    onClick={() =>
                      handleOption("Suggestions about product/delivery/experience")
                    }
                    className="px-4 py-2 rounded-md bg-gray-500/40 text-white text-sm hover:bg-gray-600 transition"
                  >
                    Suggestion →
                  </button>
                  <button
                    onClick={() => handleOption("Tell experience about our platform")}
                    className="px-4 py-2 rounded-md bg-gray-500/40 text-white text-sm hover:bg-gray-600 transition"
                  >
                    Experience →
                  </button>
                </>
              )}
            </div>

            {/* Input Field (Always Visible at Bottom) */}
            <div className="p-4 border-t border-gray-700 flex items-center gap-3 bg-[#34323a]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border border-gray-600 px-4 py-3 rounded-full text-white placeholder-gray-300 outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-[#3b450d] px-4 py-2 rounded-full flex items-center justify-center hover:bg-[#2e350b] transition"
              >
                <FaPaperPlane className="text-white" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

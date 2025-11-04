import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import { FaPaperPlane } from "react-icons/fa";

export default function CustomerSupport() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Seek customer support with Complaint / Suggestions / Experience.",
    },
    { id: 2, from: "bot", text: "Please select what help you need about:" },
  ]);

  const [stage, setStage] = useState(0);
  const [input, setInput] = useState("");
  const scrollerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const pushBot = (text) => {
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now(), from: "bot", text }]);
    }, 400);
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
      pushBot(`Received: ${option}. Our team will review and contact you soon.`);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: trimmed }]);
    setInput("");
    pushBot(
      "Thanks for your message — our support team will review and get back soon."
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Navbar />
      <main className="pt-6 pb-4">
        <div className="h-[calc(100vh-8rem)] flex rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white max-w-7xl mx-auto">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-100 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                Customer Support
              </h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>• Light / Dark mode</p>
                <p>• Dealsy Discord</p>
                <p>• Updates & FAQ</p>
                <p>• Call Support</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end p-6 text-xs text-gray-500">
              <p>Need immediate help?</p>
              <p className="text-emerald-600 font-medium">support@dealsy.com</p>
            </div>
          </div>

          {/* Right Chat Panel */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold text-emerald-700">
                 Support team
                </h2>
                <p className="text-sm text-gray-500">with Automated assistant</p>
              </div>
             
            </div>

            {/* Chat messages */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.from === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                      m.from === "bot"
                        ? "bg-emerald-100 text-gray-800 rounded-tl-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tr-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Options */}
            {stage < 2 && (
              <div className="p-4 border-t border-gray-200 flex flex-wrap justify-center gap-3 bg-white">
                {stage === 0 &&
                  ["Product", "Delivery", "Experience"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="px-4 py-2 rounded-md bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200 transition"
                    >
                      {opt}
                    </button>
                  ))}

                {stage === 1 && (
                  <>
                    <button
                      onClick={() =>
                        handleOption("Customer Complaint about product")
                      }
                      className="px-4 py-2 rounded-md bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200 transition"
                    >
                      Complaint →
                    </button>
                    <button
                      onClick={() =>
                        handleOption("Suggestions about product")
                      }
                      className="px-4 py-2 rounded-md bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200 transition"
                    >
                      Suggestion →
                    </button>
                    <button
                      onClick={() => handleOption("Share experience")}
                      className="px-4 py-2 rounded-md bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200 transition"
                    >
                      Experience →
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Input Field */}
            <div className="p-6 border-t border-gray-200 bg-white flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

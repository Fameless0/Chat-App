import { useState, useEffect } from "react";
import Socket from "../Socket";

export default function Chat({ to }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")); // Assumes user data is stored

  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          from: data.from,
          message: data.message,
          self: false,
          timestamp: new Date(),
        },
      ]);
    };

    Socket.on("receive-message", handleReceive);

    return () => {
      Socket.off("receive-message", handleReceive);
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    Socket.emit("send-message", { message: msg, to });

    setMessages((prev) => [
      ...prev,
      {
        from: user?.username || "Me",
        message: msg,
        self: true,
        timestamp: new Date(),
      },
    ]);

    setMsg("");
  };

  return (
    <div className="mb-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Chat Room</h2>

      <div className="h-80 overflow-y-auto bg-white rounded-lg p-4 shadow-inner border border-gray-300 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.self ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg text-sm ${
                m.self
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="font-semibold">{m.self ? "You" : m.from}</p>
              <p>{m.message}</p>
              <span className="block text-xs mt-1 text-gray-400 text-right">
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-4 gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

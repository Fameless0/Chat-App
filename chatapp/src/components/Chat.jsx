import { useState, useEffect } from "react";
import socket from "../Socket";

export default function Chat({ to }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleReceive = (data) => {
      setMessages(prev => [...prev, `${data.from}: ${data.message}`]);
    };
    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socket.emit("send-message", { message: msg, to });
    setMessages(prev => [...prev, `Me: ${msg}`]);
    setMsg("");
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">Chat</h2>
      <div className="h-64 overflow-y-auto bg-gray-100 rounded p-2 mb-2 shadow-inner">
        {messages.map((m, i) => <div key={i} className="mb-1">{m}</div>)}
      </div>
      <div className="flex gap-2">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

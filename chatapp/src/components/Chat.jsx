import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Socket from '../Socket';
import { FaBars, FaVideo } from 'react-icons/fa';

export default function Chat({ to }) {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

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

    Socket.on('receive-message', handleReceive);

    return () => {
      Socket.off('receive-message', handleReceive);
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    Socket.emit('send-message', { message: msg, to });

    setMessages((prev) => [
      ...prev,
      {
        from: user?.username || 'Me',
        message: msg,
        self: true,
        timestamp: new Date(),
      },
    ]);

    setMsg('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleVideoCallClick = () => {
    setIsVideoOpen(true);
  };

  return (
    <div className='bg-gradient-to-r from-[#200122] to-[#6f0000] h-screen w-screen overflow-hidden flex'>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded text-white hover:bg-gray-700"
          title="Open Sidebar"
        >
          <FaBars />
        </button>
      )}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />


      <div
        className={`flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-16'
          } w-full`}
      >
        {/* Header */}
        <header className="flex items-center justify-between bg-white bg-opacity-10 p-4 shadow transition-all duration-300 rounded-full">
          {/* <button onClick={toggleSidebar} className="text-white">
            <FaBars />
          </button> */}
          <h1 className="text-xl font-bold text-white">Chat Room</h1>
          <button
            className="text-white text-xl"
            onClick={handleVideoCallClick}
            title="Start Video Call"
          >
            <FaVideo />
          </button>
        </header>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${m.self
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                  <p className="font-semibold">{m.self ? 'You' : m.from}</p>
                  <p>{m.message}</p>
                  <span className="block text-xs mt-1 text-gray-400 text-right">
                    {m.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 bg-white bg-opacity-10 flex items-center space-x-2 rounded-full">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 bg-white bg-opacity-5 text-white"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition rounded-full"
          >
            Send
          </button>
        </footer>

        {/* Video Call Modal */}
        {isVideoOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-4 w-full max-w-xl shadow-xl relative">
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={() => setIsVideoOpen(false)}
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-2">Video Chat</h2>
              <p>Video screen goes here...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

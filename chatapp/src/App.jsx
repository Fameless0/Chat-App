import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserForm from "./components/UserForm";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import VideoCall from "./components/VideoCall";
import socket from "./Socket";

function ChatLayout({ users, selfId, selectedUser, setSelectedUser }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar users={users} selfId={selfId} onSelectUser={setSelectedUser} />
      <div className="flex-1 p-4">
        <Chat to={selectedUser} />
        <VideoCall to={selectedUser} />
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState({});
  const [selfId, setSelfId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const handleUsers = (data) => setUsers(data);
    const handleSelfId = (id) => setSelfId(id);

    socket.on("users", handleUsers);
    socket.on("self-id", handleSelfId);

    return () => {
      socket.off("users", handleUsers);
      socket.off("self-id", handleSelfId);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/login" element={<UserForm />} />
        <Route path="/register" element={<UserForm />} />
        <Route
          path="/chat"
          element={
            user ? (
              <ChatLayout
                users={users}
                selfId={selfId}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
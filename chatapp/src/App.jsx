import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Chat from "./components/Chat";
import UserForm from "./components/UserForm";

export default function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<UserForm />} />
      <Route
        path="/chat"
        element={user ? <Chat to="admin@example.com" /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/chat" : "/login"} replace />}
      />
    </Routes>
  );
}

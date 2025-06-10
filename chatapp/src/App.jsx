import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Chat from "./components/Chat";
import UserForm from "./components/UserForm";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage on mount or location change
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<UserForm />} />
      <Route
        path="/chat"
        element={user ? <Chat to="admin@example.com" /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/chat" : "/login"} replace />}
      />
    </Routes>
  );
}

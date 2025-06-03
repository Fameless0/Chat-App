import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Socket from "../Socket";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
function UserForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setRole(queryParams.get("role") || "user");
  }, [location]);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setFocusedField("");
    setShowPass(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/api/register" : "/api/login";
      const payload = isSignUp
        ? { username, email, password }
        : { email, password };

      const { data } = await axios.post(`${'http://localhost:5000'}${endpoint}`, payload, {
        withCredentials: true,
      });

      localStorage.setItem("user", JSON.stringify(data.user));

      if (!Socket.connected) {
        Socket.connect();
        Socket.once("connect", () => {
          Socket.emit("join", data.user.email);
        });
      }

      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = "relative w-full";
  const inputBase =
    "w-full pl-10 pr-10 py-2 border rounded-md text-black bg-white outline-none focus:ring-2 ring-offset-0 transition-all duration-200 ease-in-out";
  const inputInvalid = "border-red-500 ring-red-300";
  const labelBase =
    "absolute left-10 px-1 bg-white transition-all duration-200 ease-in-out text-sm pointer-events-none";
  const floatLabel = "-top-2.5 translate-y-0 text-gray-700 text-xs";
  const defaultLabel = "top-2.5 translate-y-0 text-gray-400";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#200122] to-[#6f0000] px-4">
      <div
        className="relative overflow-hidden rounded-3xl max-w-md w-full shadow-2xl bg-white/10 backdrop-blur p-6 transition-all duration-[600ms]"
        style={{ height: isSignUp ? 470 : 440 }}
      >
        <div
          className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out ${
            isSignUp ? "-translate-x-1/2" : "translate-x-0"
          }`}
          style={{ minWidth: "800px", maxWidth: "100%" }}
        >
          {/* Sign In Form */}
          <form
            onSubmit={handleSubmit}
            className="w-1/2 px-6 flex flex-col justify-center space-y-6 text-white min-w-[400px] sm:min-w-0"
          >
            <h1 className="text-3xl font-bold text-center underline text-blue-200">
              Sign In
            </h1>

            <div className={inputWrapper}>
              <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
              <input
                type="email"
                className={`${inputBase} ${
                  !email && focusedField === "email"
                    ? inputInvalid
                    : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                required
              />
              <label
                className={`${labelBase} ${
                  focusedField === "email" || email
                    ? floatLabel
                    : defaultLabel
                }`}
              >
                Email
              </label>
            </div>

            <div className={inputWrapper}>
              <FaLock className="absolute top-3 left-3 text-gray-500" />
              <input
                type={showPass ? "text" : "password"}
                className={`${inputBase} ${
                  !password && focusedField === "password"
                    ? inputInvalid
                    : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                required
              />
              <label
                className={`${labelBase} ${
                  focusedField === "password" || password
                    ? floatLabel
                    : defaultLabel
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-300 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-40 px-4 py-2 font-medium text-black bg-white rounded-full hover:bg-green-400 self-center"
            >
              {loading ? "Please wait..." : "Log In"}
            </button>

            <p className="text-center text-sm text-white">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="text-purple-300 no-underline hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>

          {/* Sign Up Form */}
          <form
            onSubmit={handleSubmit}
            className="w-1/2 px-6 flex flex-col justify-center space-y-6 text-white min-w-[400px] sm:min-w-0"
          >
            <h1 className="text-3xl font-bold text-center underline text-blue-200">
              Sign Up
            </h1>

            <div className={inputWrapper}>
              <FaUser className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                className={`${inputBase} ${
                  !username && focusedField === "username"
                    ? inputInvalid
                    : "border-gray-300"
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField("")}
                required
              />
              <label
                className={`${labelBase} ${
                  focusedField === "username" || username
                    ? floatLabel
                    : defaultLabel
                }`}
              >
                Username
              </label>
            </div>

            <div className={inputWrapper}>
              <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
              <input
                type="email"
                className={`${inputBase} ${
                  !email && focusedField === "email"
                    ? inputInvalid
                    : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                required
              />
              <label
                className={`${labelBase} ${
                  focusedField === "email" || email
                    ? floatLabel
                    : defaultLabel
                }`}
              >
                Email
              </label>
            </div>

            <div className={inputWrapper}>
              <FaLock className="absolute top-3 left-3 text-gray-500" />
              <input
                type={showPass ? "text" : "password"}
                className={`${inputBase} ${
                  !password && focusedField === "password"
                    ? inputInvalid
                    : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                required
              />
              <label
                className={`${labelBase} ${
                  focusedField === "password" || password
                    ? floatLabel
                    : defaultLabel
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-300 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-40 px-4 py-2 font-medium text-black bg-white rounded-full hover:bg-green-400 self-center"
            >
              {loading ? "Please wait..." : "Register"}
            </button>

            <p className="text-center text-sm text-white">
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="text-purple-300 no-underline hover:underline"
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserForm;

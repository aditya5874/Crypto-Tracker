import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [watchlist, setWatchlist] = useState([]);

  // Save user and token to localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  // Signup
  const signupUser = async (name, email, password) => {
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setToken(data.token);
        setWatchlist(data.watchlist || []);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Login
  const loginUser = async (email, password) => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setToken(data.token);
        setWatchlist(data.watchlist || []);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Fetch watchlist when token changes
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get("/api/users/watchlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(data.watchlist || []);
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
      }
    };
    fetchWatchlist();
  }, [token]);

  // Add coin to watchlist
  const addToWatchlist = async (coinId) => {
    if (!token) return;
    try {
      // Optimistically update watchlist
      setWatchlist((prev) => [...prev, coinId]);
      await axios.post(
        "/api/users/watchlist/add",
        { coinId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
      // Revert on error
      setWatchlist((prev) => prev.filter((id) => id !== coinId));
    }
  };

  // Remove coin from watchlist
  const removeFromWatchlist = async (coinId) => {
    if (!token) return;
    try {
      // Optimistically update watchlist
      setWatchlist((prev) => prev.filter((id) => id !== coinId));
      await axios.post(
        "/api/users/watchlist/remove",
        { coinId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      // Revert on error
      setWatchlist((prev) => [...prev, coinId]);
    }
  };

  // Logout
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        watchlist,
        signupUser,
        loginUser,
        logoutUser,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

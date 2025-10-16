import React from "react";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import Top10 from "./pages/Top10/Top10";
import Trending from "./pages/Trending/Trending";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Watchlist from "./pages/Watchlist/watchlist";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top10" element={<Top10 />} />
        <Route path="/trending" element={<Trending />} />

        {/* Protect this route */}
        <Route
          path="/coin/:coinId"
          element={
            <ProtectedRoute>
              <Coin />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

import React, { useContext, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { CoinContext } from "../../context/CoinContext";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { setCurrency } = useContext(CoinContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    setMenuOpen(false);
  };

  const currencyHandler = (event) => {
    const v = event.target.value;
    if (v === "usd") setCurrency({ name: "usd", symbol: "$" });
    else if (v === "eur") setCurrency({ name: "eur", symbol: "€" });
    else if (v === "inr") setCurrency({ name: "inr", symbol: "₹" });
    else setCurrency({ name: "usd", symbol: "$" });
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Crypto Tracker Logo" className="logo" />
        </NavLink>

        {/* hamburger */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/top10"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Top 10
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/trending"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Trending
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink
                  to="/watchlist"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Watchlist
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="nav-actions">
          <select
            onChange={currencyHandler}
            defaultValue="usd"
            aria-label="Select currency"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="inr">INR</option>
          </select>

          {!user ? (
            <>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-link"
              >
                <button className="btn">Login</button>
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="btn-link"
              >
                <button className="btn btn-primary">Sign Up</button>
              </NavLink>
            </>
          ) : (
            <>
              <div className="greeting">Hi, {user.name}</div>
              <NavLink
                to="/watchlist"
                onClick={() => setMenuOpen(false)}
                className="btn-link"
              >
                <button className="btn">My Watchlist</button>
              </NavLink>
              <button className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const {
    user,
    watchlist = [],
    addToWatchlist,
    removeFromWatchlist,
  } = useContext(AuthContext);

  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (!e.target.value) setDisplayCoin(allCoin);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const filtered = allCoin.filter((c) =>
      c.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(filtered);
  };

  const toggleWatchlist = async (coinId) => {
    if (!user) return alert("Please login first");
    if (loadingIds.includes(coinId)) return;

    setLoadingIds((prev) => [...prev, coinId]);
    try {
      if (watchlist.includes(coinId)) {
        await removeFromWatchlist(coinId);
      } else {
        await addToWatchlist(coinId);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== coinId));
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1>
          Largest <br /> Crypto Marketplace
        </h1>
        <p>
          Welcome to the world's largest cryptocurrency marketplace. Sign up to
          explore more about cryptos.
        </p>
        <form onSubmit={searchHandler}>
          <input
            placeholder="Search crypto..."
            type="text"
            value={input}
            onChange={inputHandler}
            list="coinlist"
            required
          />
          <datalist id="coinlist">
            {allCoin.map((coin, idx) => (
              <option key={idx} value={coin.name} />
            ))}
          </datalist>
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Crypto Table */}
      <div className="crypto-table">
        {/* Table Header: now 6 columns (# | Coins | ★ | Price | 24H Change | Market Cap) */}
        <div className="table-layout header">
          <p>#</p>
          <p style={{ textAlign: "left" }}>Coins</p>

          <p className="star-header">★</p>
          <p>Price</p>
          <p>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {/* Table Rows */}
        {displayCoin.map((coin, idx) => {
          const isSaved = watchlist.includes(coin.id);
          return (
            <Link
              to={`/coin/${coin.id}`}
              className="table-layout row"
              key={idx}
            >
              {/* Rank */}
              <p>{coin.market_cap_rank}</p>

              {/* Coin Info (image + name) */}
              <div className="coin-info">
                <img src={coin.image} alt={coin.name} />
                <span className="coin-name">
                  {coin.name} - {coin.symbol.toUpperCase()}
                </span>
              </div>

              {/* Star column - separate so all stars align vertically */}
              <div className="star-col">
                <button
                  className={`star-btn ${isSaved ? "saved" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWatchlist(coin.id);
                  }}
                  aria-label={
                    isSaved ? "Remove from watchlist" : "Add to watchlist"
                  }
                >
                  {isSaved ? "★" : "☆"}
                </button>
              </div>

              {/* Price */}
              <p className="price">
                {currency.symbol}
                {coin.current_price.toLocaleString()}
              </p>

              {/* 24H Change */}
              <p
                className={
                  coin.price_change_percentage_24h > 0 ? "green" : "red"
                }
              >
                {Math.round(coin.price_change_percentage_24h * 100) / 100}%
              </p>

              {/* Market Cap */}
              <p className="market-cap">
                {currency.symbol}
                {coin.market_cap.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

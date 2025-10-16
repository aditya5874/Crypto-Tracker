import React, { useContext, useEffect, useState } from "react";
import "../Home/Home.css";
import { CoinContext } from "../../context/CoinContext";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Trending = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const {
    user,
    watchlist = [],
    addToWatchlist,
    removeFromWatchlist,
  } = useContext(AuthContext);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    // Sort coins by 24h % change (descending)
    const sortedCoins = [...allCoin]
      .sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      )
      .slice(0, 10);
    setTrendingCoins(sortedCoins);
  }, [allCoin]);

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
      <div className="hero">
        <h1>Trending Cryptocurrencies</h1>
        <p>Currently trending coins based on CoinGecko popularity.</p>
      </div>

      <div className="crypto-table">
        {/* Table Header */}
        <div className="table-layout header">
          <p>#</p>
          <p style={{ textAlign: "left" }}>Coins</p>
          <p className="star-header">★</p>
          <p>Price</p>
          <p>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {/* Table Rows */}
        {trendingCoins.map((item, index) => {
          const isSaved = watchlist.includes(item.id);
          return (
            <Link
              to={`/coin/${item.id}`}
              className="table-layout row"
              key={index}
            >
              <p>{item.market_cap_rank}</p>

              {/* Coin Info */}
              <div className="coin-info">
                <img src={item.image} alt={item.name} />
                <span className="coin-name">
                  {item.name} - {item.symbol.toUpperCase()}
                </span>
              </div>

              {/* Star Column */}
              <div className="star-col">
                <button
                  className={`star-btn ${isSaved ? "saved" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWatchlist(item.id);
                  }}
                >
                  {isSaved ? "★" : "☆"}
                </button>
              </div>

              {/* Price */}
              <p className="price">
                {currency.symbol}
                {item.current_price.toLocaleString()}
              </p>

              {/* 24H Change */}
              <p
                className={
                  item.price_change_percentage_24h > 0 ? "green" : "red"
                }
              >
                {Math.floor(item.price_change_percentage_24h * 100) / 100}%
              </p>

              {/* Market Cap */}
              <p className="market-cap">
                {currency.symbol}
                {item.market_cap.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Trending;

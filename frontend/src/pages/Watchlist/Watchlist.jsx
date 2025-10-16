import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";
import "../Home/Home.css";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, addToWatchlist, user } =
    useContext(AuthContext);
  const { allCoin, currency } = useContext(CoinContext);

  const [watchlistCoins, setWatchlistCoins] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    const filteredCoins = allCoin.filter((coin) => watchlist.includes(coin.id));
    setWatchlistCoins(filteredCoins);
  }, [allCoin, watchlist]);

  const toggleWatchlist = async (e, coinId) => {
    e.preventDefault(); // prevent <Link> navigation
    e.stopPropagation();

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
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== coinId));
    }
  };

  if (!watchlistCoins.length) {
    return (
      <div className="home">
        <div className="hero">
          <h1>Your Watchlist</h1>
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            Your watchlist is empty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Your Watchlist</h1>
        <p style={{ fontSize: 20 }}>
          All the coins you’ve marked with a star in one place.
        </p>
      </div>

      <div className="crypto-table">
        {/* Header matches Home layout */}
        <div className="table-layout header">
          <p>#</p>
          <p style={{ textAlign: "left" }}>Coins</p>
          <p className="star-header">★</p>
          <p>Price</p>
          <p>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {/* Rows */}
        {watchlistCoins.map((coin, idx) => {
          const isSaved = watchlist.includes(coin.id);
          return (
            <Link
              to={`/coin/${coin.id}`}
              className="table-layout row"
              key={idx}
            >
              {/* Rank */}
              <p>{coin.market_cap_rank}</p>

              {/* Coin Info */}
              <div className="coin-info">
                <img src={coin.image} alt={coin.name} />
                <span className="coin-name">
                  {coin.name} - {coin.symbol.toUpperCase()}
                </span>
              </div>

              {/* Star column (same as Home) */}
              <div className="star-col">
                <button
                  className={`star-btn ${isSaved ? "saved" : ""}`}
                  onClick={(e) => toggleWatchlist(e, coin.id)}
                  disabled={loadingIds.includes(coin.id)}
                  title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
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
                {Math.floor(coin.price_change_percentage_24h * 100) / 100}%
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

export default Watchlist;

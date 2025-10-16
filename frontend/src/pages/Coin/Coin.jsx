import React, { useContext, useEffect, useState } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState();
  const [historicalData, setHistoricalData] = useState();
  const { currency } = useContext(CoinContext);
  const fetchCoinData = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/coins/${coinId}`;
    const response = await fetch(url);
    const data = await response.json();
    setCoinData(data);
  };

  const fetchHistoricalData = async () => {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/coins/${coinId}/market_chart?vs_currency=${currency.name}`;
    const response = await fetch(url);
    const data = await response.json();
    setHistoricalData(data);
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency]);

  if (coinData && historicalData) {
    return (
      <div className="coin">
        <div className="coin-name">
          <img src={coinData.image.large} alt={coinData.name} />
          <div className="coin-desc">
            <p>
              <b>
                {coinData.name} ({coinData.symbol.toUpperCase()})
              </b>
            </p>
            <br></br>
          </div>
        </div>
        <div className="description">
          <p>{coinData.description.en}</p>
        </div>

        <div className="coin-chart">
          <LineChart historicalData={historicalData}></LineChart>
        </div>

        <div className="coin-info">
          <ul>
            <li>Crypto Market Rank</li>
            <li>{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Current Price</li>
            <li>
              {currency.symbol}{" "}
              {coinData.market_data.current_price[
                currency.name
              ].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>Market Cap</li>
            <li>
              {currency.symbol}{" "}
              {coinData.market_data.market_cap[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>24 Hour high</li>
            <li>
              {currency.symbol}{" "}
              {coinData.market_data.high_24h[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>24 Hour Low</li>
            <li>
              {currency.symbol}{" "}
              {coinData.market_data.low_24h[currency.name].toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }
};

export default Coin;

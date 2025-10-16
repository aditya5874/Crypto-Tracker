import express from "express";
import axios from "axios";

const router = express.Router();
const API_BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.CG_API_KEY;

router.get("/", async (req, res) => {
  const { vs_currency = "usd" } = req.query;

  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: { vs_currency },
      headers: { "x-cg-demo-api-key": API_KEY },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching all coins:", error.message);
    res.status(500).json({ error: "Failed to fetch coins data" });
  }
});

router.get("/:coinId", async (req, res) => {
  const { coinId } = req.params;

  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`, {
      headers: { "x-cg-demo-api-key": API_KEY },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching coin details:", error.message);
    res.status(500).json({ error: "Failed to fetch coin details" });
  }
});

router.get("/:coinId/market_chart", async (req, res) => {
  const { coinId } = req.params;
  const { vs_currency = "usd", days = 7 } = req.query;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/${coinId}/market_chart`,
      {
        params: { vs_currency, days, interval: "daily" },
        headers: { "x-cg-demo-api-key": API_KEY },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching historical data:", error.message);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
});

export default router;

import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Get coin details
router.get("/:coinId", async (req, res) => {
  const { coinId } = req.params;
  const apiKey = process.env.CG_API_KEY;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        method: "GET",
        headers: { "x-cg-demo-api-key": apiKey },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching coin data" });
  }
});

// Get historical data
router.get("/:coinId/market_chart", async (req, res) => {
  const { coinId } = req.params;
  const { vs_currency = "usd" } = req.query;
  const apiKey = process.env.CG_API_KEY;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=7&interval=daily`,
      {
        method: "GET",
        headers: { "x-cg-demo-api-key": apiKey },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching historical data" });
  }
});

export default router;

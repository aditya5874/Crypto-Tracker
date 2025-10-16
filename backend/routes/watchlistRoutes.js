import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/watchlistController.js";
import { protect } from "../middleware/authMiddleware.js"; // your existing auth middleware

const router = express.Router();

router.post("/add", protect, addToWatchlist);
router.post("/remove", protect, removeFromWatchlist);
router.get("/", protect, getWatchlist);

export default router;

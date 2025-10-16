import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  addToWatchlist,
  removeFromWatchlist,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUser);
router.post("/watchlist/add", protect, addToWatchlist);
router.post("/watchlist/remove", protect, removeFromWatchlist);

export default router;

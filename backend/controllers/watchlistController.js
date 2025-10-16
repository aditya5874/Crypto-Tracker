import User from "../models/User.js";

// Add coin to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const { coinId } = req.body;
    const userId = req.user.id; // comes from auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.watchlist.includes(coinId)) {
      user.watchlist.push(coinId);
      await user.save();
    }

    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove coin from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { coinId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchlist = user.watchlist.filter((id) => id !== coinId);
    await user.save();

    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

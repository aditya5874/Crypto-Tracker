import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
      watchlist: user.watchlist,
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

// Get user data
export const getUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

// Add to watchlist
export const addToWatchlist = async (req, res) => {
  const { coinId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.watchlist.includes(coinId)) {
    user.watchlist.push(coinId);
    await user.save();
  }

  res.json(user.watchlist);
};

// Remove from watchlist
export const removeFromWatchlist = async (req, res) => {
  const { coinId } = req.body;
  const user = await User.findById(req.user.id);
  user.watchlist = user.watchlist.filter((id) => id !== coinId);
  await user.save();

  res.json(user.watchlist);
};

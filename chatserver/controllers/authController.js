const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true }).json({ user });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ email: username });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true }).json({ user });
};

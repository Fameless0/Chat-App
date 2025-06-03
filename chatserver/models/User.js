const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "moderator", "admin", "guest"], // Add all applicable roles here
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "pending", "inactive"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

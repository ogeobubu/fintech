const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
    },
    referral: {
      type: String,
      default: "OhTopUp",
    },
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

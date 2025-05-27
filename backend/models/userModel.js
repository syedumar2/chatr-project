const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pwd: {
      type: String,
    },
     refreshTokens: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user",userSchema)

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
      required: true,
    },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channel",
      },
    ],
    status: {
        type: String,
        enum: ['online', 'offline', 'busy'],
        default: 'offline'
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    refreshTokens: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);

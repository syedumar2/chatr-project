const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,

    },
    channel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "channel",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);

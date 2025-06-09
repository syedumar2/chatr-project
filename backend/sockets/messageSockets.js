const { MessageDao, ChannelDao } = require("../dao");

const initMessageSocket = async (socket, io) => {
  console.log(`Message socket initialized for User: ${socket.user}`);

  try {
    const userChannels = await ChannelDao.getChannel({ members: socket.user });
    socket.emit("userChannels", userChannels);
  } catch (error) {
    console.error("Error fetching user channels:", error);
    socket.emit("errorMessage", "Failed to load your channels.");
  }

  socket.on("sendMessage", async ({ content, channel }) => {
    if (!content || !channel) {
      return socket.emit("error", { message: "Empty content or channel" });
    }

    try {
      const message = await MessageDao.addMessage({
        sender: socket.user,
        content,
        channel,
      });

      io.in(channel).emit("newMessage", message);

      // Optional: still emit an ack if you want
      socket.emit("messageSent", { success: true, data: message });
    } catch (error) {
      console.error("Socket sendMessage error:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
    console.log(`Socket ${socket.id} joined room ${channelId}`);
  });

  // Optionally, leave room
  socket.on("leaveChannel", (channelId) => {
    socket.leave(channelId);
    console.log(`Socket ${socket.id} left room ${channelId}`);
  });
};

module.exports = { initMessageSocket };

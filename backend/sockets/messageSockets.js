const { MessageDao, ChannelDao, UserDao } = require("../dao");

const initMessageSocket = (socket, io) => {
  // Join channel room
  socket.on("joinChannel", async (channel) => {
    try {
      socket.join(channel);
      const setOnline = await UserDao.updateUser(
        { _id: socket.user },
        { status: "online" }
      );

      if (!setOnline) {
        return socket.emit("error", { messsage: "User not found" });
      }
      io.emit("userStatusOnline", { userId: socket.user, status: "online" });
    } catch (error) {
      socket.emit("error", { message: "Internal server error" });
    }
  });

  // Leave channel room
  socket.on("leaveChannel", async (channel) => {
    try {
      socket.leave(channel);
      const setOffline = await UserDao.updateUser(
        { _id: socket.user },
        { status: "offline" }
      );
      if (!setOffline) {
        return socket.emit("error", "User not found");
      }
      io.emit("userStatusOffline", { userId: socket.user, status: "offline" });
    } catch (error) {
      socket.emit("error", { message: "Internal server error" });
    }
  });

  // Handle message sending
  socket.on("sendMessage", async ({ content, channel, replyMessageId }) => {
    if (!content || !channel) {
      return socket.emit("error", {
        message: "Content and channel are required.",
      });
    }

    try {
      const message = await MessageDao.addMessage({
        sender: socket.user,
        content: content.trim(),
        channel,

        replyTo: replyMessageId,
      });

      // Emit to all users in the channel
      io.in(channel).emit("newMessage", message);
      // Confirm to sender
      socket.emit("messageSent", { success: true, data: message });
    } catch (error) {
      socket.emit("error", { message: "Failed to send message." });
    }
  });

  socket.on("editMessage", async ({ messageid, content, channel }) => {
    if (!messageid || !content) {
      return socket.emit("error", {
        message: "Content, channel and messageId are required.",
      });
    }
    try {
      const channelExists = await ChannelDao.getChannel({ _id: channel });

      if (!channelExists || channelExists.length === 0) {
        return socket.emit("error", {
          message: "Channel does not exist",
        });
      }
      const message = await MessageDao.getSingleMessage(messageid);

      if (!message) {
        return socket.emit("error", {
          message: "This message doesnt exist",
        });
      }
      if (String(message.sender._id) !== String(socket.user)) {
        return socket.emit("error", {
          message: "This message doesnt exist",
        });
      }

      const result = await MessageDao.updateMessage(
        { _id: messageid },
        { content: content }
      );

      io.in(channel).emit("updatedMessage", result);
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Failed to edit message." });
    }
  });

  socket.on("deleteMessage", async ({ messageid }) => {
    try {
      if (!messageid) {
        return socket.emit("error", {
          message: "No messageId passed for deletion",
        });
      }
      const message = await MessageDao.getSingleMessage(messageid);

      if (!message) {
        return socket.emit("error", {
          message: "No such message with id found",
        });
      }

      if (String(message.sender._id) !== String(socket.user)) {
        return socket.emit("error", {
          message: "Unauthorized to delete this message",
        });
      }
      const result = await MessageDao.deleteMessage({ _id: messageid });

      if (result.deletedCount === 0) {
        return socket.emit("error", {
          message: "Message not found or already deleted",
        });
      }
      const channel = String(message.channel);

      io.in(channel).emit("deletedMessage", result);
    } catch (error) {
      console.log(error);
      socket.emit("error", { message: "Failed to delete message." });
    }
  });
};

module.exports = { initMessageSocket };

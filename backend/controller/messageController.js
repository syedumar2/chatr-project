const { MessageDao } = require("../dao");

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, channel } = req.body;
    if (!content || !channel) {
      return res.status(200).json({
        success: false,
        message: "Empty input! No operation performed",
      });
    }
    const message = await MessageDao.addMessage({
      sender: userId,
      content,
      channel,
    });

    return res.json({
      success: true,
      message: "Message sent to db successfully",
      data: message,
    });
  } catch (error) {
    console.log("Error at sendMessage: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { channelid } = req.params;

    if (!channelid) {
      return res.status(200).json({
        success: false,
        message: "Empty input! No operation performed",
      });
    }
    const messagesArray = await MessageDao.getMessage({ channel: channelid }); // Oldest first

    return res.json({
      success: true,
      message: "Message recieved from db",
      data: messagesArray,
    });
  } catch (error) {
    console.log("Error at getMessage: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const senderId = req.user.id;

    const { messageid } = req.params;

    if (!messageid || !senderId) {
      return res
        .status(400)
        .json({ success: false, message: "Sender and Message id is required" });
    }

    const message = await MessageDao.getMessage({ _id: messageid });

    if (!message[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    if (String(message[0].sender._id) !== String(senderId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this message",
      });
    }
    const result = await MessageDao.deleteMessage({ _id: messageid });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or already deleted",
      });
    }
    return res.json({
      success: true,
      message: "Message Deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error in deleteMessage controller", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const senderId = req.user.id;

    const { messageid } = req.params;

    const { content } = req.body;

    if (!messageid || !senderId || !content) {
      return res.status(400).json({
        success: false,
        message: "Sender, Message id and Content is required",
      });
    }

    const message = await MessageDao.getMessage({ _id: messageid });

    if (!message[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    console.log(message[0].sender._id);
    if (String(message[0].sender._id) !== String(senderId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this message",
      });
    }
    const result = await MessageDao.updateMessage({ _id: messageid }, {content : content});

    return res.json({
      success: true,
      message: "Message Updated successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error in UpdateMessage controller", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage, updateMessage };

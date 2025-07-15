const { MessageDao } = require("../dao");

const getMessages = async (req, res) => {
  try {
    const { channelid } = req.params;
    console.log("channelId passed is", channelid);
    const { before, limit } = req.query;
    console.log("before is", before);
    console.log("limit is", limit);
    
    if (!channelid) {
      return res.status(200).json({
        success: false,
        message: "Empty input! No operation performed",
      });
    }
    
    
    const messagesArray = await MessageDao.getMessage(channelid,before,limit);

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

const postMessageWithFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, replyTo } = req.body;
    const { channelid } = req.params;

    if (!channelid) {
      return res.status(200).json({
        success: false,
        message: "Empty input! No operation performed",
      });
    }

    const files = req.files.map((file) => ({
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
    }));

    const message = await MessageDao.addMessage({
      sender: userId,
      content,
      channel: channelid,
      files,
      replyTo,
    });
    //  ✅ Emit real-time update
    req.io.to(channelid).emit("newMessage", message);

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
module.exports = { getMessages, postMessageWithFile };

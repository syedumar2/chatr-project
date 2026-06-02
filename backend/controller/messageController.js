const { MessageDao } = require("../dao");
const { putObject } = require("../config/s3");

const getMessages = async (req, res) => {
  try {
    const { channelid } = req.params;

    const { before, limit } = req.query;

    if (!channelid) {
      return res.status(200).json({
        success: false,
        message: "Empty input! No operation performed",
      });
    }

    const messagesArray = await MessageDao.getMessage(channelid, before, limit);

    return res.json({
      success: true,
      message: "Message recieved from db",
      data: messagesArray,
    });
  } catch (error) {
    console.error("Error at getMessage: ", error);
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

    async function uploadFiles(files) {
      const uploadedFiles = [];
      for (const file of files) {
        const fileUrl = await putObject(file.originalname, file.buffer, file.mimetype);
        uploadedFiles.push({
          fileName: file.originalname,
          fileUrl,
          fileType: file.mimetype,  
        });
      }
      return uploadedFiles;
    }

    const files = req.files ? await uploadFiles(req.files) : [];

    const message = await MessageDao.addMessage({
      sender: userId,
      content,
      channel: channelid,
      files,
      replyTo,
    });

    req.io.to(channelid).emit("newMessage", message);


    return res.json({
      success: true,
      message: "Message sent to db successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error at sendMessage: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getMessages, postMessageWithFile };

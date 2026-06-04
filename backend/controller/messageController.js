const { MessageDao } = require("../dao");
const { putObject, getObjectUrl } = require("../config/s3");
const { randomUUID } = require("crypto");
const getMessages = async (req, res) => {
  try {
    const { channelid } = req.params;
    const { before, limit } = req.query;

    if (!channelid) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required",
      });
    }

    const messagesArray = await MessageDao.getMessage(channelid, before, limit);

    const populatedMessages = await Promise.all(
      messagesArray.map(async (message) => {
        if (!message.files || message.files.length === 0) {
          return message;
        }

        const filesWithUrls = await Promise.all(
          message.files.map(async (file) => ({
            ...file,
            fileUrl: await getObjectUrl(file.fileKey),
          })),
        );

        return {
          ...message,
          files: filesWithUrls,
        };
      }),
    );

    return res.json({
      success: true,
      message: "Message received from db",
      data: populatedMessages,
    });
  } catch (error) {
    console.error("Error at getMessage:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
        const fileKey = `${randomUUID()}-${file.originalname}`;

        await putObject(fileKey, file.buffer, file.mimetype);

        uploadedFiles.push({
          fileName: file.originalname,
          fileKey,
          fileType: file.mimetype,
        });
      }

      return uploadedFiles;
    }

    const files = req.files ? await uploadFiles(req.files) : [];

    const intermediateMessage = await MessageDao.addMessage({
      sender: userId,
      content,
      channel: channelid,
      files,
      replyTo,
    });

    async function retrieveFiles(files) {
      const retrievedFiles = [];

      for (const file of files) {
        const fileUrl = await getObjectUrl(file.fileKey);

        retrievedFiles.push({
          fileName: file.fileName,
          fileUrl,
          fileType: file.fileType,
          fileKey: file.fileKey,
        });
      }

      return retrievedFiles;
    }

   
    const messageObject = intermediateMessage && intermediateMessage.toObject
      ? intermediateMessage.toObject()
      : intermediateMessage;

    messageObject.files = await retrieveFiles(files);


    if (!messageObject.createdAt) {
      messageObject.createdAt = new Date().toISOString();
    }

    req.io.to(channelid).emit("newMessage", messageObject);

    return res.json({
      success: true,
      message: "Message sent to db successfully",
      data: messageObject,
    });
  } catch (error) {
    console.error("Error at sendMessage: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getMessages, postMessageWithFile };

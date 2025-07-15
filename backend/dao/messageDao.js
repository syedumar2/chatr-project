const { MessageModel } = require("../models");

const addMessage = async (messageData) => {
  try {
    const message = await MessageModel.create(messageData);

    // Step 2: Populate the `sender` field (select only needed fields)
    await message.populate("sender", "_id name email");

    return message;
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const getMessage = async (channelId, before = null, limit = 15) => {
  try {
    console.log("Limit we getting is", limit);
    console.log("before", before);

    const query = { channel: channelId };

    if (before) {
      query.createdAt = { $lt: new Date(before) }; // Only messages created *before* this timestamp
    }

    const messages = await MessageModel.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: -1 }) // get latest first, for consistent pagination
      .limit(parseInt(limit))
      .lean()
      .exec();

    // Reverse to get oldest-to-newest order on frontend
    return messages.reverse();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSingleMessage = async (messageId) => {
  try {
    return await MessageModel.findById(messageId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateMessage = async (query, messageData) => {
  try {
    return await MessageModel.findOneAndUpdate(query, messageData, {
      new: true,
      runValidators: true,
    })
      .populate("sender", "_id name email")
      .lean()
      .exec();
  } catch (error) {
    throw error;
  }
};

const deleteMessage = async (deleteQuery) => {
  try {
    return await MessageModel.findByIdAndDelete(deleteQuery).lean().exec();
  } catch (error) {
    throw error;
  }
};

const deleteAllMessages = async (deleteQuery) => {
  try {
    return await MessageModel.deleteMany(deleteQuery).lean().exec();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  deleteAllMessages,
  getSingleMessage
};

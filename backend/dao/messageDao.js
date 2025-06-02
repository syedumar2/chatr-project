const { MessageModel } = require("../models");

const addMessage = async (messageData) => {
  try {
    return await MessageModel.create(messageData);
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const getMessage = async (query) => {
  try {
    return await MessageModel.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .lean()
      .exec();
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

module.exports = { addMessage, getMessage, updateMessage, deleteMessage };

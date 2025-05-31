const { ChannelModel } = require("../models");

const addChannel = async (ChannelData) => {
  try {
    return await ChannelModel.create(ChannelData);
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const getChannel = async (query) => {
  try {
    return await ChannelModel.find(query).lean().exec();
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const updateChannel = async (query, updateData) => {
  try {
    return await ChannelModel.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();
  } catch (error) {
    throw error;
  }
};

const deleteChannel = async (deleteQuery) => {
  try {
    return await ChannelModel.findByIdAndDelete(deleteQuery).lean().exec();
  } catch (error) {
    throw error;
  }
};

const deleteAllChannels = async (userId) => {
   try {
    return await ChannelModel.deleteMany(userId).lean().exec();
  } catch (error) {
    throw error;
  }
}

module.exports = { addChannel, getChannel, updateChannel, deleteChannel };

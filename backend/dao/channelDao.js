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
    return await ChannelModel.find(query)
      .populate("members", "name email")
      .lean()
      .exec();
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

const updateChannelMembers = async (channelId, updateData) => {
  try {
    await ChannelModel.findByIdAndUpdate(
      channelId,
      { $set: { members: [] } },
      { $new: true }
    );

    return await ChannelModel.findOneAndUpdate(
      { _id: channelId },
      {
        members: updateData
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .lean()
      .exec();
  } catch (error) {
    throw error;
  }
};

const deleteAllChannels = async (channelId) => {
  try {
    return await ChannelModel.deleteMany(channelId).lean().exec();
  } catch (error) {
    throw error;
  }
};

//TODO build controller function for deleting all channels

module.exports = {
  addChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  deleteAllChannels,
  updateChannelMembers,
};

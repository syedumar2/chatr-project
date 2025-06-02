const { ChannelDao, UserDao } = require("../dao");

const addChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, members = [] } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(200).json({
        success: false,
        message: "Empty input! No operation performed",
      });
    }

    // Check if the creator (user making this request) exists in the database
    const creator = await UserDao.getUser({ _id: userId });
    if (!creator || creator.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Creator not found." });
    }

    // Normalize and deduplicate member emails:
    //  - Lowercase all provided emails
    //  - Include creator's email in the members list

    const memberEmails = Array.from(
      new Set([...members.map((e) => e.toLowerCase()), creator[0].email])
    );

    // Verify all member emails are registered users in the database:
    //  - Query users by email
    //  - Only select their _id and email fields
    const users = await UserDao.getUser({
      email: { $in: memberEmails },
    });

    // Check if all provided emails exist:
    if (users.length !== memberEmails.length) {
      return res.status(400).json({
        success: false,
        message: "Some provided emails are invalid.",
      });
    }

    // Extract user IDs from the valid user documents:
    const memberIds = users.map((user) => user._id);

    // Create a new channel in the database:
    const newChannel = await ChannelDao.addChannel({
      name,
      description,
      members: memberIds,
      createdBy: userId,
    });

    // Send success response with the created channel details:
    return res.json({
      success: true,
      message: "Channel creation successful",
      data: {
        id: newChannel._id,
        name: newChannel.name,
        description: newChannel.description,
        members: newChannel.members,
        createdBy: newChannel.createdBy,
        createdAt: newChannel.createdAt,
      },
    });
  } catch (error) {
    console.log("Error at addChannel: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//ADD CHANNEL TESTED AND WORKING ✅

const getChannel = async (req, res) => {
  try {
    const userId = req.user.id;

    const channels = await ChannelDao.getChannel({ createdBy: userId });

    if (!channels || channels.length === 0) {
      //If ChannelArr is an empty array [], it’s truthy, so this if (!ChannelArr) won’t trigger.
      // Better to check ChannelArr.length instead.

      return res
        .status(404)
        .json({ success: true, message: "No Channels found" });
    }
    res.json({
      success: true,
      channels: channels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//GET CHANNEL TESTED AND WORKING ✅

const getChannelsUserBelongsTo = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await ChannelDao.getChannel({ members: userId });
    if (!channels || channels.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No Channels found" });
    }
    res.json({
      success: true,
      channels: channels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.query.cid;

    if (!channelId) {
      return res
        .status(400)
        .json({ success: false, message: "Channel ID is required" });
    }

    const channel = await ChannelDao.getChannel({ _id: channelId });

    if (!channel[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    if (String(channel[0].createdBy) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this channel",
      });
    }
    const result = await ChannelDao.deleteChannel({ _id: channelId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Channel not found or already deleted",
      });
    }
    return res.json({
      success: true,
      message: "Channels Deleated successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error in deleteChannel controller", error);
    res.json({ success: false, message: error?.message });
  }
};

//DELETE CHANNEL TESTED AND WORKING ✅
const updateChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.query.cid;
    const updateData = req.body;

    if (!channelId) {
      return res
        .status(400)
        .json({ success: false, message: "Channel ID is required" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Update data is required to complete the operation",
      });
    }

    // Fetch the channel by channelId, not userId
    const channel = await ChannelDao.getChannel({ _id: channelId });
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    // Check if the user is the creator
    if (String(channel[0].createdBy) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this channel",
      });
    }

    // Perform the update
    const updatedChannel = await ChannelDao.updateChannel(
      { _id: channelId },
      updateData
    );

    return res.json({
      success: true,
      message: "Channel updated successfully",
      data: updatedChannel,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

//UPDATE CHANNEL TESTED AND WORKING ✅

module.exports = {
  addChannel, //✅
  getChannel, //✅
  getChannelsUserBelongsTo,  //✅
  updateChannel, //✅
  deleteChannel, //✅
};



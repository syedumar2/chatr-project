const { ChannelDao } = require("../dao");

const addChannel = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, members } = req.body;
        if (!name || !description) {
            return res.status(200).json({
                success: false,
                message: "Empty input! No operation performed",
            });
        }
        const finalMembers =
            members && members.length > 0
                ? [...new Set([...members, userId])]
                : [userId];

        const newChannelarr = await ChannelDao.addChannel({
            name,
            description,
            members: finalMembers,
            createdBy: userId,
        });
        const newChannel = newChannelarr[0];
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
            channels: ChannelArr,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUserBelongsToChannels = async (req, res) => {
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
        const channelId = req.query.id;


        if (!channelId) {
            return res.status(400).json({ success: false, message: "Channel ID is required" });
        }

        const channel = await ChannelDao.getChannel({ _id: userId });
        if (!channel) {
            return res.status(404).json({ success: false, message: "Channel not found" });
        }

        if(String(channel.createdby)!== String(userId)){
            return res.status(403).json({ success: false, message: "Unauthorized to delete this channel" });
        }
        const result = await ChannelDao.deleteChannel({ _id: channelId });
        if(result.deletedCount === 0){
             return res.status(404).json({ success: false, message: "Channel not found or already deleted" });
        }
        return res.json({
            success: true,
            message: "Channels Deleated successfully",
            data: result
        })

    } catch (error) {
        console.log("Error in deleteChannel controller", error);
        res.json({ success: false, message: error?.message });

    }
}


//TODO: TEST ABOVE CREATED METHODS

//TODO : Create updateChannel method    

module.exports = {addChannel,getChannel,getUserBelongsToChannels,deleteChannel}
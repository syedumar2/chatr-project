import { useParams } from "react-router-dom";
import { ChannelBar } from "./ChannelBar";
import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";
import { CirclePlus, Hash } from "lucide-react";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { toast } from "sonner";
import MessageList from "./MessageList";
import MessageContext from "@/utils/contexts/message/MessageContext";
const Channel = () => {
  const { channelId } = useParams();
  const { channelData, getChannelData, updateChannel } =
    useContext(ChannelContext);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const { userId } = useContext(AuthContext);
  const { getMessage, joinChannel, leaveChannel, socketConnected } =
    useContext(MessageContext);
  const [thisChannelData, setThisChannelData] = useState("");
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [creatorEmail, setCreatorEmail] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [replyMessage, setReplyMessage] = useState(null);

  const prevChannelIdRef = useRef(null);
  const { onlineUsers } = useContext(MessageContext);
  const onlineUsersMap = useMemo(() => {
    const map = new Map();
    onlineUsers.forEach(({ userId, status }) => {
      map.set(userId, status);
    });
    return map;
  }, [onlineUsers]);

  const handleReplyMessage = (data) => {
    setReplyMessage(data); // store it if needed
    console.log("At parent", data); // use this instead of replyMessage
  };
  const clearReplyMessage = () => {
    setReplyMessage(null);
  };

  useEffect(() => {
    getChannelData();

    if (socketConnected && channelId) {
      // Leave the previous channel
      if (prevChannelIdRef.current && prevChannelIdRef.current !== channelId) {
        leaveChannel(prevChannelIdRef.current);
      }

      // Join the new channel
      joinChannel(channelId);
      prevChannelIdRef.current = channelId;

      console.log("🔁 Switched to channel:", channelId);
    }

    return () => {
      if (prevChannelIdRef.current) {
        leaveChannel(prevChannelIdRef.current);
        prevChannelIdRef.current = null;
        console.log("💨 Cleanup: left channel", prevChannelIdRef.current);
      }
    };
  }, [socketConnected, channelId]);

  useEffect(() => {
    if (!channelId) return;

    // Leave the previous room when channelId changes
    return () => {
      leaveChannel(channelId);
    };
  }, [channelId]);

  useEffect(() => {
    if (channelData) {
      console.log("Channel Data obtained", channelData);
      setLoading(true);

      try {
        const thisChannel = channelData.find((ch) => ch._id === channelId);

        setThisChannelData(thisChannel);
        setChannelName(thisChannel?.name);
        setChannelDescription(thisChannel?.description);

        const theseMembers = thisChannel?.members || [];
        setMembers(theseMembers);

        const creator = theseMembers.find(
          (member) => member._id === thisChannel?.createdBy
        );
        setCreatorEmail(creator?.email);
        console.log("Creator Email:", creator?.email);
      } catch (error) {
        console.error("Error loading channel:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [channelData, channelId]);
  // only runs when channelData updates

  //TODO: make an update channel method

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!channelName || !channelDescription) {
      setErrMsg("Invalid Entry");
      return;
    }
    const resp = await updateChannel(
      channelId,
      channelName,
      channelDescription
    );
    if (resp.success) {
      toast.success("Channel Updated Successfully");
      setOpen(false);
      getChannelData();
    } else {
      toast.error(`Error: ${resp.message}`);
      setErrMsg(resp.message);
      errRef.current?.focus();
      //TODO remove errRef and errMsg later
    }
  };

  //get channel details for this channel
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Channel Header */}
      <div className="sticky top-0 bg-blue-900 py-6 dark:bg-gray-900 border-t border-black p-4 z-50">
        <h2 className="flex items-center gap-2 font-semibold ml-4 tracking-wide">
          <Hash size={20} />
          {channelName}
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden sm:px-4 px-2 ">
        {/* Channel Sidebar */}
        <ChannelBar
          channelId={channelId}
          open={open}
          setOpen={setOpen}
          channelData={thisChannelData}
          userId={userId}
          channelName={channelName}
          setChannelName={setChannelName}
          channelDescription={channelDescription}
          setChannelDescription={setChannelDescription}
          members={members}
          setMembers={setMembers}
          errRef={errRef}
          errMsg={errMsg}
          handleUpdate={handleUpdate}
          memberDialogOpen={memberDialogOpen}
          setMemberDialogOpen={setMemberDialogOpen}
          removeMemberDialogOpen={removeMemberDialogOpen}
          setRemoveMemberDialogOpen={setRemoveMemberDialogOpen}
          creatorEmail={creatorEmail}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          onlineUsersMap={onlineUsersMap}
        />

        {/* Floating Action Button */}
        <Button
          onClick={() => getMessage(channelId)}
          className="bg-green-700 fixed top-[350px] right-2 sm:right-4 z-50 rounded-xl"
        >
          <CirclePlus />
        </Button>

        {/* Messages List */}
        <div className="flex-grow flex flex-col-reverse overflow-y-auto p-4 pb-4 bg-gray-100 dark:bg-black">
          <MessageList
            onReplyMessageSend={handleReplyMessage}
            onlineUsersMap={onlineUsersMap}
          />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput
        channelId={channelId}
        replyMessage={replyMessage}
        clearReplyMessage={clearReplyMessage}
      />
    </>
  );
};

export default Channel;

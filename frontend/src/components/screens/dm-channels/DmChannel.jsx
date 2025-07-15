import { useParams } from "react-router-dom";
import { ChannelBar } from "./ChannelBar";
import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";
import { CirclePlus, Send } from "lucide-react";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { Hash } from "lucide-react";
import MessageList from "./MessageList";
import MessageContext from "@/utils/contexts/message/MessageContext";
const Channel = () => {
  const { dmChannelId } = useParams();
  const { dmChannelData, getChannelData } = useContext(ChannelContext);
  const [replyMessage, setReplyMessage] = useState(null);
  const { userId } = useContext(AuthContext);
  const { getMessage, joinChannel, leaveChannel, socketConnected } =
    useContext(MessageContext);
  const [thisChannelData, setThisChannelData] = useState("");
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const prevChannelIdRef = useRef(null);
  const { onlineUsers } = useContext(MessageContext);

  const handleReplyMessage = (data) => {
    setReplyMessage(data); // store it if needed
    console.log("At parent", data); // use this instead of replyMessage
  };
  const clearReplyMessage = () => {
    setReplyMessage(null);
  };

  const onlineUsersMap = useMemo(() => {
    const map = new Map();
    onlineUsers.forEach(({ userId, status }) => {
      map.set(userId, status);
    });
    return map;
  }, [onlineUsers]);

  useEffect(() => {
    getChannelData();

    if (socketConnected && dmChannelId) {
      // Leave the previous channel
      if (
        prevChannelIdRef.current &&
        prevChannelIdRef.current !== dmChannelId
      ) {
        leaveChannel(prevChannelIdRef.current);
      }

      // Join the new channel
      joinChannel(dmChannelId);
      prevChannelIdRef.current = dmChannelId;

      console.log("🔁 Switched to channel:", dmChannelId);
    }

    return () => {
      if (prevChannelIdRef.current) {
        leaveChannel(prevChannelIdRef.current);
        prevChannelIdRef.current = null;
        console.log("💨 Cleanup: left channel", prevChannelIdRef.current);
      }
    };
  }, [socketConnected, dmChannelId]);

  useEffect(() => {
    if (!dmChannelId) return;

    // Leave the previous room when dmChannelId changes
    return () => {
      leaveChannel(dmChannelId);
    };
  }, [dmChannelId]);

  useEffect(() => {
    if (dmChannelData) {
      console.log("DM Channel Data obtained", dmChannelData);
      console.log("dmChannelId is", dmChannelId);
      setLoading(true);

      try {
        const thisChannel = dmChannelData.find((ch) => ch._id === dmChannelId);

        setThisChannelData(thisChannel);

        setChannelName(thisChannel?.name);
        setChannelDescription(thisChannel?.description);

        const theseMembers = thisChannel?.members || [];
        setMembers(theseMembers);
      } catch (error) {
        console.error("Error loading channel:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [dmChannelData, dmChannelId]);
  // only runs when dmChannelData updates

  //get channel details for this channel
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <>
      {/* Channel Header */}
      <div className="sticky top-0 bg-blue-900 py-6 dark:bg-gray-900 border-t border-black p-4 z-50">
        <h2 className="flex items-center gap-2 font-semibold ml-4 tracking-wide">
          <Send size={20} />
          {members.filter((member) => member._id !== userId)[0]?.name}
        </h2>
      </div>
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden sm:px-4 px-2 ">
        <ChannelBar
          dmChannelId={dmChannelId}
          open={open}
          setOpen={setOpen}
          dmChannelData={thisChannelData}
          userId={userId}
          channelName={channelName}
          setChannelName={setChannelName}
          members={members}
          setMembers={setMembers}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          onlineUsersMap={onlineUsersMap}
        />

        {/* Floating Button */}
        <Button
          onClick={() => getMessage(dmChannelId)}
          className="bg-green-700 fixed top-[350px] right-2 sm:right-4 z-50 rounded-xl"
        >
          <CirclePlus />
        </Button>

        {/* Messages */}
        <div className="flex-grow flex flex-col-reverse overflow-y-auto p-4 pb-4 bg-gray-100 dark:bg-black">
          <MessageList
            onlineUsersMap={onlineUsersMap}
            onReplyMessageSend={handleReplyMessage}
       
          />
        </div>

        {/* Input Box */}
      </div>
      <div className="sticky bottom-0 z-10 bg-white dark:bg-black px-2 sm:px-4">
        <MessageInput
          dmChannelId={dmChannelId}
          replyMessage={replyMessage}
          clearReplyMessage={clearReplyMessage}
        />
      </div>
    </>
  );
};

export default Channel;

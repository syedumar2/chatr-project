import { useParams } from "react-router-dom";
import { ChannelBar } from "./ChannelBar";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  CirclePlus,
  CircleUser,
  DivideCircle,
} from "lucide-react";
import { useState, useEffect, useContext, useRef } from "react";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { toast } from "sonner";
const Channel = () => {
  const { channelId } = useParams();
  const { channelData, getChannelData, updateChannel } =
    useContext(ChannelContext);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const { userId } = useContext(AuthContext);
  const [thisChannelData, setThisChannelData] = useState("");
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [creatorEmail, setCreatorEmail] = useState("");

  useEffect(() => {
    getChannelData(); // just trigger it once
  }, [channelId]);

  useEffect(() => {
    if (channelData) {
      setLoading(true);

      const timer = setTimeout(() => {
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
      }, 500); // 500ms delay for loading effect

      return () => clearTimeout(timer);
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
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <div className="flex flex-col h-screen">
      <ChannelBar
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
      />
      <Button className="bg-green-700 fixed top-[350px] right-[-30px] hover:right-1 transition-all duration-300 z-50 rounded-xl">
        <CirclePlus />
      </Button>

      {/* Messages */}
      <div className="flex-grow flex flex-col-reverse overflow-y-auto p-4 pb-18 bg-gray-100 dark:bg-black">
        {/* Incoming Message */}
        <div className="flex w-full space-x-3 max-w-xs">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div>
            <div className="bg-gray-300 dark:bg-gray-700 p-3 rounded-r-lg rounded-bl-lg">
              <p className="text-sm text-black dark:text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                incoming
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">
              2 min ago
            </span>
          </div>
        </div>

        {/* Outgoing Message */}
        <div className="flex w-full space-x-3 max-w-xs ml-auto justify-end">
          <div>
            <div className="bg-blue-600 dark:bg-blue-800 text-white p-3 rounded-l-lg rounded-br-lg">
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod. Outgoing
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">
              2 min ago
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>

      {/* Input Box */}
      <div className="sticky bottom-0 bg-gray-300 dark:bg-gray-900 p-4">
        <input
          className="h-10 w-full rounded px-3 text-sm text-black dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
          type="text"
          placeholder="Type your message…"
        />
      </div>
    </div>
  );
};

export default Channel;

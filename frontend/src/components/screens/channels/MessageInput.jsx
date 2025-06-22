import { useState, useContext } from "react";
import { toast } from "sonner";
import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { Input } from "@/components/ui/input";
import { PlusCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MessageInput = ({ channelId, replyMessage, clearReplyMessage }) => {
  const [inputField, setInputField] = useState("");
  const { postMessage } = useContext(MessageContext);
  const { userId } = useContext(AuthContext);

  const handlePost = async (e) => {
    e.preventDefault();
    const res = await postMessage(inputField, channelId, replyMessage?._id); // send reply ID too
    if (res.success) {
      setInputField("");
      toast.success("Message sent successfully");
      clearReplyMessage?.(); // optional callback to clear the reply state in parent
    } else {
      toast.error(`Error: ${res.message}`);
    }
  };

  return (
    <div className="sticky bottom-0 bg-gray-300 dark:bg-gray-900 p-4">
      <div>
        {/* Reply preview */}
        {replyMessage && (
          <div className="mb-2 flex items-center justify-between rounded-lg border-l-4 border-blue-500 bg-white p-3 shadow-md dark:bg-gray-800">
            <div className="flex-1">
              <p className="text-sm font-semibold text-black dark:text-white">
                {replyMessage?.sender?.name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {replyMessage?.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearReplyMessage}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={16} />
            </Button>
          </div>
        )}

        {/* Message input and send/reply button */}
        <div className="flex items-center space-x-3">
          <Button variant={"blue"} ><PlusCircle/></Button>
          <Input
            className="h-10 w-full rounded bg-white px-3 text-sm text-black placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            type="text"
            value={inputField}
            onChange={(e) => setInputField(e.target.value)}
            placeholder="Type your message here…"
          />
          <Button
            variant="blue"
            onClick={handlePost}
            className=" hover:bg-gray-400"
            size="lg"
          >
            <Send  />
          </Button>
        </div>
      </div>
    </div>
  );
};

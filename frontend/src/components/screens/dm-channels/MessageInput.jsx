import { useState, useContext, useEffect, useMemo } from "react";
import { toast } from "sonner";
import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { Input } from "@/components/ui/input";
import { Send, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
export const MessageInput = ({ dmChannelId }) => {
  const [inputField, setInputField] = useState("");
  const { postMessage } = useContext(MessageContext);
  const { userId } = useContext(AuthContext);

  const handlePost = async (e) => {
    e.preventDefault();
    const res = await postMessage(inputField, dmChannelId,);
    if (res.success) {
      setInputField("");
      toast.success("Message sent Successfully");
    } else {
      toast.error(`Error: ${res.message}`);

      //TODO remove errRef and errMsg later
    }
  };

  return (
    <div className="sticky bottom-0 bg-gray-300 dark:bg-gray-900 p-4">
      <div>
        <form onSubmit={handlePost} className="flex items-center space-x-3">
          <Input
            className="h-10 w-full rounded px-3 text-sm text-black dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            type="text"
            value={inputField}
            onChange={(e) => setInputField(e.target.value)}
            placeholder="Type your message here…"
          />
          <Button
            variant="blue"
            type="submit"
            className={
              "dark:bg-gray-800 dark:text-white bg-white text-black hover:bg-gray-400"
            }
            size={"lg"}
          >
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
};

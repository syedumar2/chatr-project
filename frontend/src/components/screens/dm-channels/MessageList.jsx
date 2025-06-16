import { useContext, useEffect, useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";

import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import EditMessage from "./EditMessage";
import DeleteMessage from "./DeleteMessage";

const MessageList = ({onlineUsersMap}) => {
  const { dmChannelId } = useParams();
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change

  const { messages, getMessage } = useContext(MessageContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    getMessage(dmChannelId);
  }, [dmChannelId]);

  const renderedMsgs = useMemo(() => {
    return messages.map((msg) => {
      const isOutgoing = msg.sender._id === userId;

      //what is equal to userId is the outgoing message
      return (
        <div
          key={msg._id}
          className={`flex w-full space-x-3 max-w-xs ${
            isOutgoing ? "ml-auto justify-end " : ""
          }`}
        >
          {/* Incoming msg avatar on the left replace in future with avatar */}
          {!isOutgoing && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative">
                  <Avatar className="size-10">
                    <AvatarImage />
                    <AvatarFallback className="bg-cyan-700 p-2 text-2xl">
                      {msg?.sender?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsersMap.get(msg?.sender?._id) === "online" && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2  bg-green-500" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="bg-accent rounded p-2">
                  <div className="flex-col items-center px-2 py-2 text-sm ">
                    <p>
                      <span> Name: {msg?.sender?.name} </span>{" "}
                    </p>
                  </div>
                  <div className="flex-col items-center px-2 py-2 text-sm ">
                    <p>
                      <span>Email: {msg?.sender?.email}</span>
                    </p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div>
            <div
              className={`p-3 text-sm ${
                isOutgoing
                  ? "bg-blue-600 dark:bg-blue-800 text-white rounded-l-lg rounded-br-lg"
                  : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-r-lg rounded-bl-lg"
              }`}
            >
              <div className="flex gap-1">
                <p>{msg.content}</p>{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ChevronDown
                      size={20}
                      className={
                        isOutgoing
                          ? `opacity-0 hover:opacity-100 transition-opacity duration-200`
                          : "hidden"
                      }
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                      <EditMessage msg={msg} dmChannelId={dmChannelId} />
                      <DeleteMessage msg={msg} />
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Outgoing message avatar on the right */}
          {isOutgoing && (
            <Avatar className={"size-10"}>
              <AvatarImage />

              <AvatarFallback className=" p-2 text-2xl bg-purple-600 ">
                {msg?.sender?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div ref={messagesEndRef} />
        </div>
      );
    });
  }, [messages, userId]);

  // 3. Render all message bubbles
  return messages.length !== 0 ? (
    <div className="space-y-2">{renderedMsgs}</div>
  ) : (
    <div className="text-black font-semibold dark:text-white overflow-">
      No messages on this Channel
    </div>
  );
};

export default MessageList;

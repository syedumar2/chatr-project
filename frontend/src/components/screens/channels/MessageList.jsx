import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import MessageContext from "@/utils/contexts/message/messageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import EditMessage from "./EditMessage";
import DeleteMessage from "./DeleteMessage";

const MessageList = ({ onReplyMessageSend }) => {
  const { channelId } = useParams();
  const messagesEndRef = useRef(null);
  const { messages, getMessage } = useContext(MessageContext);
  const { userId } = useContext(AuthContext);
  const [replyMessageChild, setReplyMessageChild] = useState(null);

  useEffect(() => {
    getMessage(channelId);
  }, [channelId, getMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderedMessages = useMemo(() => {
    return messages.map((msg) => {
      const isOutgoing = msg.sender._id === userId;
      const repliedMessage = msg.replyTo
        ? messages.find((m) => m._id === msg.replyTo)
        : null;

      return (
        <div
          key={msg._id}
          className={`flex w-full max-w-xs space-x-3 ${
            isOutgoing ? "ml-auto justify-end" : ""
          }`}
        >
          {/* Incoming avatar */}
          {!isOutgoing && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="size-10">
                  <AvatarImage />
                  <AvatarFallback className="bg-cyan-700 p-2 text-2xl">
                    {msg?.sender?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="rounded bg-accent p-2">
                  <div className="flex-col items-center px-2 py-2 text-sm">
                    <p>
                      <span>Name: </span>
                      {msg?.sender?.name}
                    </p>
                  </div>
                  <div className="flex-col items-center px-2 py-2 text-sm">
                    <p>
                      <span>Email: </span>
                      {msg?.sender?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Message bubble */}
          <div>
            <div
              className={`p-3 text-sm ${
                isOutgoing
                  ? "rounded-l-lg rounded-br-lg bg-blue-800 text-white dark:bg-blue-900"
                  : "rounded-r-lg rounded-bl-lg bg-white text-black dark:bg-gray-800 dark:text-white"
              }`}
            >
              <div className="flex flex-col gap-1">
                {repliedMessage && (
                  <div className="mb-1 rounded border-l-4 border-blue-500 bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <p className="font-semibold">
                      {repliedMessage?.sender?.name}
                    </p>
                    <p className="truncate">{repliedMessage?.content}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <p>{msg.content}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ChevronDown
                      size={20}
                      className={`opacity-0 transition-opacity duration-200 hover:opacity-100 ${
                        !isOutgoing && "ml-1"
                      }`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {isOutgoing ? (
                      <DropdownMenuGroup>
                        <EditMessage msg={msg} />
                        <DeleteMessage msg={msg} />
                      </DropdownMenuGroup>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => {
                          setReplyMessageChild(msg);
                          onReplyMessageSend(msg);
                        }}
                      >
                        Reply
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Outgoing avatar */}
          {isOutgoing && (
            <Avatar className="size-10">
              <AvatarImage />
              <AvatarFallback className="bg-purple-600 p-2 text-2xl">
                {msg?.sender?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div ref={messagesEndRef} />
        </div>
      );
    });
  }, [messages, userId]);

  return messages.length > 0 ? (
    <div className="space-y-2">{renderedMessages}</div>
  ) : (
    <div className="font-semibold text-black dark:text-white">
      No messages in this channel
    </div>
  );
};

export default MessageList;

import { useState, useContext, useEffect, useMemo } from "react";

import MessageContext from "@/utils/contexts/message/messageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";

const MessageList = ({ channelId }) => {
  const {
    messages,
    getMessage,
    postMessage,
    deleteMessage,
    updateMessage,
  } = useContext(MessageContext);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    getMessage(channelId);
  }, []);
  

  const renderedMsgs = useMemo(() => {
    return messages.map((msg) => {

      const isOutgoing =  msg.sender._id === userId;
      console.log("result of msg.sender._id", msg.sender._id, "userId", userId);
 //what is equal to userId is the outgoing message
      return (
        <div
          key={msg._id}
          className={`flex w-full space-x-3 max-w-xs ${
            isOutgoing ? "ml-auto justify-end" : ""
          }`}
        >
          {/* Incoming msg avatar on the left replace in future with avatar */}
          {!isOutgoing && (
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}

          <div>
            <div
              className={`p-3 text-sm ${
                isOutgoing
                  ? "bg-blue-600 dark:bg-blue-800 text-white rounded-l-lg rounded-br-lg"
                  : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-r-lg rounded-bl-lg"
              }`}
            >
              <p>{msg.content}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Outgoing message avatar on the right */}
          {isOutgoing && (
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
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

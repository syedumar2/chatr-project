import { useState, useContext, useCallback } from "react";
import { messageApi } from "@/utils/axios";
import AuthContext from "../auth/AuthContext";
import MessageContext from "./messageContext";

const MessageProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  // GET messages for a channel
  const getMessage = useCallback(async (channelId) => {
    try {
      const res = await messageApi.get(`/${channelId}`);
      if (res?.data.success) {
        setMessages(res.data.data);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "An unexpected error occurred.",
      };
    }
  }, []); // No dependency on accessToken here, just fetching data

  // POST a new message
  const postMessage = useCallback(
    async (content, channel) => {
      try {
        const res = await messageApi.post(
          "",
          { content, channel },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log("at postMessage context",res.data)
        if (res?.data.success) {
          setMessages((prev) => [...prev, res.data.data]);
          return { success: true };
        } else {
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        return {
          success: false,
          message:
            error?.response?.data?.message || "An unexpected error occurred.",
        };
      }
    },
    [accessToken]
  );

  // DELETE a message
  const deleteMessage = useCallback(
    async (messageId) => {
      try {
        const res = await messageApi.delete(`/${messageId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res?.data.success) {
          setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
          return { success: true };
        } else {
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        return {
          success: false,
          message:
            error?.response?.data?.message || "An unexpected error occurred.",
        };
      }
    },
    [accessToken]
  );

  // UPDATE a message
  const updateMessage = useCallback(
    async (messageId, content) => {
      try {
        const res = await messageApi.patch(
          `/${messageId}`,
          { content },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (res?.data.success) {
          setMessages((prev) =>
            prev.map((msg) => (msg._id === messageId ? res.data.data : msg))
          );
          return { success: true };
        } else {
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        return {
          success: false,
          message:
            error?.response?.data?.message || "An unexpected error occurred.",
        };
      }
    },
    [accessToken]
  );

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        getMessage,
        postMessage,
        deleteMessage,
        updateMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;

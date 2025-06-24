import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { messageApi } from "@/utils/axios";
import AuthContext from "../auth/AuthContext";
import MessageContext from "./MessageContext";
import { toast } from "sonner";

const MessageProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io("http://localhost:3000", {
      auth: {
        token: `Bearer ${accessToken}`,
      },
    });

    socketRef.current = socket;

    //Connection events
    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("userStatusOnline", (data) => {
      setOnlineUsers((prev) => [...prev, data]);
    });

    socket.on("userStatusOffline", (data) => {
      setOnlineUsers((prev) =>
        prev.filter((user) => user.userId !== data.userId)
      );
    });
    //Message Events
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("updatedMessage", (message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === message._id ? message : msg))
      );
    });

    socket.on("deletedMessage", (message) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== message._id));
    });

    socket.on("error", ({ message }) => {
      toast.error("Error: ", message);
      console.error("Socket error:", message);
    });

    //clean up fn
    return () => {
      socket.off("connect");
      socket.off("welcome");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.off("updatedMessage");
      socket.off("deletedMessage");
      socket.off("error");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  const postMessageWithFile = useCallback(
    async ({ content, files = [], channelid, replyTo }) => {
      console.log("postMessageWithFile params:", {
        content,
        files,
        channelid,
        replyTo,
      });

      if (!channelid) {
        console.error("channelid is undefined");
        return { success: false, error: "Channel ID is required" };
      }

      if (!files || files.length === 0) {
        console.error("No content or files provided");
        return {
          success: false,
          error: "Message content or files are required",
        };
      }

      const formData = new FormData();
      if (content) formData.append("content", content);
      if (replyTo) formData.append("replyTo", replyTo);
      files.forEach((file) => formData.append("files", file));

      try {
        const res = await messageApi.post(`/${channelid}`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken || ""}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        });

        const newMessage = res.data?.data;
        if (!newMessage) throw new Error("No message data returned from API");

       
        setUploadProgress(0);
        return { success: true, data: newMessage };
      } catch (err) {
        setUploadProgress(0);
        console.error("File Message send failed:", err);
        return {
          success: false,
          error: err.message || "Failed to send message",
        };
      }
    },
    [accessToken, setMessages, setUploadProgress]
  );
  

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

  // DELETE a message
  const deleteMessage = useCallback((messageid) => {
    if (!socketRef.current || !socketRef.current.connected) {
      return { success: false, message: "Socket not connected." };
    }
    socketRef.current.emit("deleteMessage", { messageid });
    return { success: true };
  }, []);

  const joinChannel = (channelId) => {
    if (!socketRef.current && !socketRef.current.connected) {
      return;
    }
    socketRef.current.emit("joinChannel", channelId);
  };

  const leaveChannel = (channelId) => {
    if (!socketRef.current && !socketRef.current.connected) {
      return;
    }
    socketRef.current.emit("leaveChannel", channelId);
  };

  // POST a new message
  const postMessage = useCallback((content, channel, replyMessageId) => {
    if (!socketRef.current || !socketRef.current.connected) {
      return { success: false, message: "Socket not connected." };
    }
    socketRef.current.emit("sendMessage", { content, channel, replyMessageId });
    return { success: true };
  }, []);

  // UPDATE a message
  const updateMessage = useCallback((messageid, content, channel) => {
    if (!socketRef.current || !socketRef.current.connected) {
      return { success: false, message: "Socket not connected." };
    }
    socketRef.current.emit("editMessage", { messageid, content, channel });
    return { success: true };
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        getMessage,
        postMessage,
        deleteMessage,
        updateMessage,
        socket: socketRef.current,
        socketConnected,
        joinChannel,
        leaveChannel,
        onlineUsers,
        postMessageWithFile,
        uploadProgress,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;

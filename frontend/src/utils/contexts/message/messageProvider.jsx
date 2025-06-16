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
      console.log("at userStatusOnline socket recieved", data); //redact after testing
      setOnlineUsers((prev) => [...prev, data]);
    });

    socket.on("userStatusOffline", (data) => {
      console.log("at userStatusOffline socket recieved", data); //redact after testing
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
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;

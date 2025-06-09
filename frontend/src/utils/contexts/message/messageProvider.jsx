import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { messageApi } from "@/utils/axios";
import AuthContext from "../auth/AuthContext";
import MessageContext from "./messageContext";

const MessageProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io("http://localhost:3000", {
      auth: {
        token: `Bearer ${accessToken}`,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    // ✅ Listen for server welcome message
    socket.on("welcome", (data) => {
      console.log("🎉 Server says:", data); // should log: { message: "a new client connected" }
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);


// 1. Listen once for messageSent events
useEffect(() => {
  if (!socketRef.current) return;

  const handleMessageSent = (response) => {
    if (response.success) {
      setMessages((prev) => [...prev, response.data]);
      console.log("Message sent event received", response);
    } else {
      console.error("Error sending message", response.message);
    }
  };

  socketRef.current.on("messageSent", handleMessageSent);

  return () => {
    socketRef.current.off("messageSent", handleMessageSent);
  };
}, []); // Run once on mount (make sure socketRef.current exists before useEffect)


useEffect(() => {
  console.log("Messages updated:", messages);
}, [messages]);


















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
  const postMessage = useCallback((content, channel) => {
    if (!socketRef.current || !socketRef.current.connected) {
      return { success: false, message: "Socket not connected." };
    }

    socketRef.current.emit("sendMessage", { content, channel });

    // Immediately return success — actual update happens in listener above
    return { success: true };
  }, []);
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

  const joinChannel = (channelId) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log("joinChannel called on client");
      socketRef.current.emit("joinChannel", channelId);
      console.log(`Requested to join channel ${channelId}`);
    } else {
      console.warn("❌ Socket not connected while trying to join:", channelId);
    }
  };

  const leaveChannel = (channelId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("leaveChannel", channelId);
      console.log(`Requested to leave channel ${channelId}`);
    }
  };

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
          //here is the update logic after update
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
        socket: socketRef.current,
        socketConnected,
        joinChannel,
        leaveChannel,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;

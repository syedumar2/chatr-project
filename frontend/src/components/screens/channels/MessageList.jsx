import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import FilePreviewDialog from "./FilePreviewDialog";
import MessageItem from "./MessageItem";

const MessageList = ({ onReplyMessageSend, onlineUsersMap }) => {
  const { channelId } = useParams();
  const { messages = [], getMessage } = useContext(MessageContext) || {};
  const { userId } = useContext(AuthContext) || {};

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInitialLoad = useRef(true);

  const [isFetching, setIsFetching] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  // Initial load
  useEffect(() => {
    if (channelId && getMessage) {
      const fetchMessages = async () => {
        try {
          const res = await getMessage(channelId);
          if (!res || !res.success) {
            console.error("Initial message fetch failed:", res);
            return;
          }
          setHasMoreMessages(true);
        } catch (error) {
          console.error("Failed to fetch initial messages:", error);
        } finally {
          isInitialLoad.current = false;
        }
      };
      fetchMessages();
    }
  }, [channelId, getMessage]);

  // Auto-scroll to bottom only on initial load
  useEffect(() => {
    if (isInitialLoad.current && !isLoadingOlder) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoadingOlder]);

  // Detect scroll to top to show "Load Older Messages" button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop } = scrollContainerRef.current;
        setShowLoadMore(scrollTop < 50 && hasMoreMessages);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMoreMessages]);

  // Handle "Load Older Messages" button click
  const handleLoadMore = useCallback(async () => {
    if (
      isFetching ||
      !hasMoreMessages ||
      messages.length === 0 ||
      !messages[0]?.createdAt
    ) {
      return;
    }

    setIsFetching(true);
    setIsLoadingOlder(true);
    try {
      const oldest = messages[0];
      const res = await getMessage(channelId, oldest.createdAt);
      if (!res) {
        console.error("getMessage returned undefined for older messages");
        setHasMoreMessages(false);
        return;
      }
      if (
        !res.success ||
        !Array.isArray(res.messages) ||
        res.messages.length < 15
      ) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
      setHasMoreMessages(false);
    } finally {
      setIsFetching(false);
      setIsLoadingOlder(false);
    }
  }, [channelId, getMessage, isFetching, hasMoreMessages, messages]);

  const renderedMessages = useMemo(() => {
    return messages.map((msg, i) => {
      const isOutgoing = msg.sender?._id === userId;
      const repliedMessage = msg.replyTo
        ? messages.find((m) => m._id === msg.replyTo)
        : null;

      const handleReply = () => {
        if (onReplyMessageSend) {
          onReplyMessageSend(msg);
        } else {
          console.warn("onReplyMessageSend is not provided");
        }
      };

      return (
        <div key={msg._id}>
          <MessageItem
            message={msg}
            isOutgoing={isOutgoing}
            repliedMessage={repliedMessage}
            onReply={handleReply}
            onPreviewFile={setPreviewFile}
            onlineUsersMap={onlineUsersMap}
          />
          {i === messages.length - 1 && <div ref={messagesEndRef} />}
        </div>
      );
    });
  }, [messages, userId, onReplyMessageSend, onlineUsersMap]);

  if (!getMessage || !userId) {
    return <div className="text-red-500">Error: Context not available</div>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto w-full"
      style={{
        maxHeight: "80vh",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {hasMoreMessages && showLoadMore && (
        <div className="text-center py-2">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            variant="blue"
            className="text-sm"
          >
            {isFetching ? "Loading..." : "Load Older Messages"}
          </Button>
        </div>
      )}
      {isFetching && !showLoadMore && (
        <div className="text-center text-gray-400 text-sm py-1">
          Loading older messages...
        </div>
      )}
      {messages.length > 0 ? (
        <div className="space-y-2 pr-4 mx-auto max-w-full">
          {renderedMessages}
        </div>
      ) : (
        <div className="font-semibold text-black dark:text-white text-center">
          No messages in this channel
        </div>
      )}

      {/* File Preview Dialog */}
      <FilePreviewDialog
        file={previewFile}
        open={!!previewFile}
        onOpenChange={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default MessageList;

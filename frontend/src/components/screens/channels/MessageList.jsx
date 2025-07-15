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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, FileText, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditMessage from "./EditMessage";
import DeleteMessage from "./DeleteMessage";
import { Button } from "@/components/ui/button";

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
  }, [messages]);

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
      console.log(
        "Fetching older messages for channel:",
        channelId,
        "before:",
        oldest.createdAt
      );
      const res = await getMessage(channelId, oldest.createdAt);
      console.log("getMessage response:", res);
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
          <div
            className={`flex w-full max-w-xs space-x-3 ${
              isOutgoing ? "ml-auto justify-end" : ""
            }`}
          >
            {/* Avatar (Incoming) */}
            {!isOutgoing && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarImage src={msg.sender?.avatarUrl || ""} />
                      <AvatarFallback className="bg-cyan-700 p-2 text-2xl">
                        {msg.sender?.name
                          ? msg.sender.name.charAt(0).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    {onlineUsersMap.get(msg?.sender?._id) === "online" && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2  bg-green-500" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="rounded bg-accent p-2 text-sm">
                    <p>
                      <strong>Name:</strong> {msg.sender?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Email:</strong> {msg.sender?.email || "N/A"}
                    </p>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Message bubble */}
            <div className="flex flex-col">
              <div
                className={`p-3 text-sm ${
                  isOutgoing
                    ? "rounded-l-lg rounded-br-lg bg-blue-800 text-white dark:bg-blue-900"
                    : "rounded-r-lg rounded-bl-lg bg-white text-black dark:bg-gray-800 dark:text-white"
                }`}
              >
                {repliedMessage && (
                  <div className="mb-1 border-l-4 border-blue-500 bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    <p className="font-semibold">
                      {repliedMessage.sender?.name || "Unknown"}
                    </p>
                    <p className="truncate">{repliedMessage.content}</p>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <p>{msg.content}</p>
                  {msg.file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPreviewFile({
                          url: msg.file.url,
                          type: msg.file.type,
                        })
                      }
                    >
                      <FileText size={16} /> View File
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ChevronDown
                        size={20}
                        className="opacity-0 transition-opacity duration-200 hover:opacity-100"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {isOutgoing ? (
                        <DropdownMenuGroup>
                          <EditMessage msg={msg} />
                          <DeleteMessage msg={msg} />
                        </DropdownMenuGroup>
                      ) : (
                        <DropdownMenuItem onClick={handleReply}>
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

            {/* Avatar (Outgoing) */}
            {isOutgoing && (
              <Avatar className="size-10">
                <AvatarImage src={msg.sender?.avatarUrl || ""} />
                <AvatarFallback className="bg-purple-600 p-2 text-2xl">
                  {msg.sender?.name
                    ? msg.sender.name.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

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

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="flex justify-center my-auto w-full text-black bg-gray-400 flex-col">
          <DialogHeader>
            <DialogTitle className="text-base text-center font-semibold">
              File Preview
            </DialogTitle>
          </DialogHeader>
          {previewFile && previewFile.url && (
            <>
              {previewFile.type?.startsWith("image/") && (
                <img
                  src={previewFile.url}
                  alt="preview"
                  className="max-w-full max-h-[70vh] object-contain rounded"
                />
              )}
              {previewFile.type === "application/pdf" && (
                <iframe
                  src={previewFile.url}
                  title="PDF"
                  className="max-w-full h-[70vh] border rounded"
                />
              )}
              <a
                href={previewFile.url}
                target="_blank"
                download
                className="block text-sm mt-2 text-blue-600 underline text-center"
                rel="noopener noreferrer"
              >
                <Button variant="blue">
                  <Download /> Download
                </Button>
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageList;

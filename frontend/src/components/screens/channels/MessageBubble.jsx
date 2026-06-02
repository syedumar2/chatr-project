import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import EditMessage from "./EditMessage";
import DeleteMessage from "./DeleteMessage";
import FileButton from "./FileButton";

/**
 * MessageBubble Component
 * Renders a single message bubble with content, file button, and actions
 * Handles message styling based on incoming/outgoing direction
 */

const MessageBubble = ({
  message,
  isOutgoing,
  repliedMessage,
  onReply,
  onPreviewFile,
}) => {
  const handleReply = () => {
    if (onReply) {
      onReply(message);
    } else {
      console.warn("onReply is not provided");
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`p-3 text-sm ${
          isOutgoing
            ? "rounded-l-lg rounded-br-lg bg-blue-800 text-white dark:bg-blue-900"
            : "rounded-r-lg rounded-bl-lg bg-white text-black dark:bg-gray-800 dark:text-white"
        }`}
      >
        {/* Replied Message Preview */}
        {repliedMessage && (
          <div className="mb-1 border-l-4 border-blue-500 bg-gray-100 px-2 py-1 text-xs text-gray-600">
            <p className="font-semibold">
              {repliedMessage.sender?.name || "Unknown"}
            </p>
            <p className="truncate">{repliedMessage.content}</p>
          </div>
        )}

        {/* Message Content */}
        <div className="flex items-center gap-1">
          <p>{message.content}</p>

          {/* File Preview Button */}
          {message.files && message.files.length > 0 && (
            <FileButton files={message.files} onPreview={onPreviewFile} />
          )}

          {/* Message Actions Menu */}
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
                  <EditMessage msg={message} />
                  <DeleteMessage msg={message} />
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

      {/* Message Timestamp */}
      <span className="text-xs text-gray-400 dark:text-gray-500">
        {new Date(message.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default MessageBubble;

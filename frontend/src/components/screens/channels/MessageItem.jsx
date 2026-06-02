import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";

/**
 * MessageItem Component
 * Renders a complete message with avatar, sender info, and bubble
 * Handles incoming vs outgoing message layout
 */
const MessageItem = ({
  message,
  isOutgoing,
  repliedMessage,
  onReply,
  onPreviewFile,

  onlineUsersMap,
}) => {
  return (
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
                <AvatarImage src={message.sender?.avatarUrl || ""} />
                <AvatarFallback className="bg-cyan-700 p-2 text-2xl">
                  {message.sender?.name
                    ? message.sender.name.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              {onlineUsersMap?.get(message?.sender?._id) === "online" && (
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 bg-green-500" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="rounded bg-accent p-2 text-sm">
              <p>
                <strong>Name:</strong> {message.sender?.name || "Unknown"}
              </p>
              <p>
                <strong>Email:</strong> {message.sender?.email || "N/A"}
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Message Bubble */}
      <MessageBubble
        message={message}
        isOutgoing={isOutgoing}
        repliedMessage={repliedMessage}
        onReply={onReply}
        onPreviewFile={onPreviewFile}
      />

      {/* Avatar (Outgoing) */}
      {isOutgoing && (
        <Avatar className="size-10">
          <AvatarImage src={message.sender?.avatarUrl || ""} />
          <AvatarFallback className="bg-purple-600 p-2 text-2xl">
            {message.sender?.name
              ? message.sender.name.charAt(0).toUpperCase()
              : "?"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;

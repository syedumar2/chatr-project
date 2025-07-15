import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Download, FileText } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";

import EditMessage from "./EditMessage";
import DeleteMessage from "./DeleteMessage";

const MessageList = ({ onReplyMessageSend, onlineUsersMap }) => {
  // -------------------- Setup & Context --------------------
  const { dmChannelId } = useParams();
  const messagesEndRef = useRef(null);
  const { messages, getMessage } = useContext(MessageContext);
  const { userId } = useContext(AuthContext);
  const [previewFile, setPreviewFile] = useState(null);

  // -------------------- Side Effects --------------------
  useEffect(() => {
    getMessage(dmChannelId);
  }, [dmChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------- Helper: Render File --------------------
  const renderFileMessage = (file, idx, msg, isOutgoing) => {
    const url = `${import.meta.env.VITE_FILES_URL}${file.fileUrl}`;
    const type = file.fileType;
    const fileName = file.fileUrl.split("/")[2];

    const isImage = type?.startsWith("image/");
    const fileTypes = [
      {
        match: isImage,
        bg: "bg-gray-600",
        label: "Image",
        downloadText: "Download Image",
        textColor: "text-white",
      },
      {
        match: type === "application/pdf",
        bg: "bg-red-100",
        label: "PDF",
        downloadText: "Download PDF",
        textColor: "text-red-700",
      },
      {
        match:
          type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        bg: "bg-blue-50",
        label: "DOCX",
        downloadText: "Download DOCX",
        textColor: "text-blue-700",
      },
      {
        match:
          type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        bg: "bg-green-50",
        label: "Excel",
        downloadText: "Download Excel Sheet",
        textColor: "text-blue-600",
      },
    ];

    const matched = fileTypes.find((ft) => ft.match) || {
      bg: "bg-gray-100",
      label: "File",
      downloadText: "Download File",
      textColor: "text-blue-600",
    };

    return (
      <div
        key={idx}
        className={`${matched.bg} relative p-2 rounded-lg max-w-xs mb-2`}
      >
        {/* Dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ChevronDown
              size={20}
              className="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {isOutgoing ? (
              <DropdownMenuGroup>
                <EditMessage msg={msg} />
                <DeleteMessage msg={msg} />
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuItem onClick={() => onReplyMessageSend(msg)}>
                Reply
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          onClick={() => setPreviewFile({ url, type })}
          className={`cursor-pointer flex items-center gap-1 ml-2 font-semibold hover:underline ${matched.textColor}`}
        >
          <FileText /> <p className="ml-2">{fileName}</p>
        </div>
        <a
          href={url}
          target="_blank"
          download
          className={`block text-sm text-center mt-2 underline ${matched.textColor}`}
        >
          {matched.downloadText}
        </a>
      </div>
    );
  };

  // -------------------- Render Messages --------------------
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
          {/* Avatar */}
          {!isOutgoing && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative">
                  <Avatar className="size-10">
                    <AvatarImage />
                    <AvatarFallback className="bg-cyan-700 p-2 text-2xl">
                      {msg?.sender?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsersMap.get(msg?.sender?._id) === "online" && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 bg-green-500" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-sm rounded bg-accent p-2">
                <p>
                  <span>Name: </span>
                  {msg?.sender?.name}
                </p>
                <p>
                  <span>Email: </span>
                  {msg?.sender?.email}
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Message Body */}
          <div>
            {/* Files */}
            {msg.files?.map((file, idx) =>
              renderFileMessage(file, idx, msg, isOutgoing)
            )}

            {/* Text Message */}
            {msg.content?.trim() && (
              <div
                className={`p-3 text-sm ${
                  isOutgoing
                    ? "bg-blue-800 text-white rounded-l-lg rounded-br-lg"
                    : "bg-white text-black dark:bg-gray-800 dark:text-white rounded-r-lg rounded-bl-lg"
                }`}
              >
                {repliedMessage && (
                  <div className="mb-1 rounded border-l-4 border-blue-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <p className="font-semibold">
                      {repliedMessage.sender.name}
                    </p>
                    <p className="truncate">{repliedMessage.content}</p>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <p>{msg.content}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ChevronDown
                        size={20}
                        className="opacity-0 hover:opacity-100 transition-opacity"
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
                          onClick={() => onReplyMessageSend(msg)}
                        >
                          Reply
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            {/* Timestamp */}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Outgoing Avatar */}
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

  // -------------------- Final Render --------------------
  return (
    <>
      {messages.length > 0 ? (
        <div className="space-y-2">{renderedMessages}</div>
      ) : (
        <div className="font-semibold text-black dark:text-white">
          No messages in this channel
        </div>
      )}

      {/* File Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="flex flex-col items-center text-black bg-gray-400">
          <DialogHeader>
            <DialogTitle className="text-center text-base font-semibold">
              File Preview
            </DialogTitle>
          </DialogHeader>

          {previewFile?.type?.startsWith("image/") && (
            <img
              src={previewFile.url}
              alt="preview"
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          )}

          {previewFile?.type === "application/pdf" && (
            <iframe
              src={previewFile.url}
              title="PDF"
              className="max-w-full h-[70vh] border rounded"
            />
          )}

          <a
            href={previewFile?.url}
            target="_blank"
            download
            className="mt-4 flex justify-center"
          >
            <Button variant="blue">
              <Download className="mr-2" />
              Download
            </Button>
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageList;

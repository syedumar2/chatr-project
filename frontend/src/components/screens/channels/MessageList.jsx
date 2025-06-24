import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { ChevronDown, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
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

import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import EditMessage from "./EditMessage";
import DeleteMessage from "./DeleteMessage";
import { Button } from "@/components/ui/button";

const MessageList = ({ onReplyMessageSend, onlineUsersMap }) => {
  const { channelId } = useParams();
  const messagesEndRef = useRef(null);
  const { messages, getMessage } = useContext(MessageContext);
  const { userId } = useContext(AuthContext);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    getMessage(channelId);
  }, [channelId, getMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("messages array", messages);
  }, [messages]);

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
          {/* Incoming avatar */}
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
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2  bg-green-500" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="rounded bg-accent p-2">
                  <div className="flex-col items-center px-2 py-2 text-sm">
                    <p>
                      <span>Name: </span>
                      {msg?.sender?.name}
                    </p>
                  </div>
                  <div className="flex-col items-center px-2 py-2 text-sm">
                    <p>
                      <span>Email: </span>
                      {msg?.sender?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Message bubble */}
          <div>
            {msg.files?.map((file, idx) => {
              const url = `${import.meta.env.VITE_FILES_URL}${file.fileUrl}`;
              const type = file.fileType;
              const fileName = file.fileUrl.split("/")[2];

              const isImage = type?.startsWith("image/");
              const isPDF = type === "application/pdf";
              const isDocx =
                type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              const isExcel =
                type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

              if (isImage) {
                return (
                  <div
                    key={idx}
                    className="max-w-xs my-2 rounded-xl relative  overflow-hidden shadow-md bg-gray-600 "
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ChevronDown
                          size={20}
                          color="black"
                          className={` opacity-0 transition-opacity duration-200 hover:opacity-100 z-50  absolute top-3  right-3 ${
                            !isOutgoing && "ml-1"
                          }`}
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
                            onClick={() => {
                              onReplyMessageSend(msg);
                            }}
                          >
                            Reply
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <img
                      src={url}
                      alt="sent-img"
                      className="rounded-xl object-cover max-h-60 w-full cursor-pointer"
                      onClick={() => setPreviewFile({ url, type })}
                    />
                    <a
                      href={url}
                      target="_blank"
                      download
                      className="block text-sm text-white  text-center py-2"
                    >
                      Download Image
                    </a>
                  </div>
                );
              }

              if (isPDF) {
                return (
                  <div
                    key={idx}
                    className="bg-red-100 relative text-sm p-2 rounded-lg max-w-xs mb-2"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ChevronDown
                          size={20}
                          color="black"
                          className={` opacity-0 transition-opacity duration-200 hover:opacity-100 z-50  absolute top-3  right-3 ${
                            !isOutgoing && "ml-1"
                          }`}
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
                            onClick={() => {
                              onReplyMessageSend(msg);
                            }}
                          >
                            Reply
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                      onClick={() => setPreviewFile({ url, type })}
                      className="cursor-pointer flex gap-1 pr-8 pl-1 py-1 ml-2 items-center  text-red-700 font-semibold hover:underline"
                    >
                      <FileText /> <p className="ml-2">{fileName}</p>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      download
                      className="block text-sm text-red-700  text-center pt-2 "
                    >
                      Download PDF
                    </a>
                  </div>
                );
              }

              if (isDocx) {
                return (
                  <div
                    key={idx}
                    className="bg-blue-50 relative p-2 rounded-lg max-w-xs mb-2"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ChevronDown
                          size={20}
                          color="black"
                          className={` opacity-0 transition-opacity duration-200 hover:opacity-100 z-50  absolute top-3  right-3 ${
                            !isOutgoing && "ml-1"
                          }`}
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
                            onClick={() => {
                              onReplyMessageSend(msg);
                            }}
                          >
                            Reply
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                      onClick={() => setPreviewFile({ url, type })}
                      className="cursor-pointer flex gap-1 pr-8 pl-1 py-1 ml-2 items-center  text-blue-700 font-semibold hover:underline"
                    >
                      <FileText /> <p className="ml-2">{fileName}</p>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      download
                      className="block text-sm mt-2 text-blue-600 underline text-center"
                    >
                      Download DOCX
                    </a>
                  </div>
                );
              }

              if (isExcel) {
                return (
                  <div
                    key={idx}
                    className="bg-green-50 p-2 relative rounded-lg max-w-xs mb-2"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ChevronDown
                          size={20}
                          color="black"
                          className={` opacity-0 transition-opacity duration-200 hover:opacity-100 z-50  absolute top-3  right-3 ${
                            !isOutgoing && "ml-1"
                          }`}
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
                            onClick={() => {
                              onReplyMessageSend(msg);
                            }}
                          >
                            Reply
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                      onClick={() => setPreviewFile({ url, type })}
                      className="cursor-pointer flex gap-1 pr-8 pl-1 py-1 ml-2 items-center  text-blue-600 font-semibold hover:underline"
                    >
                      <FileText /> <p className="ml-2">{fileName}</p>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      download
                      className="block text-sm mt-2 text-blue-600 underline text-center"
                    >
                      Download Excel Sheet
                    </a>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="bg-gray-100 p-2 relative rounded-lg max-w-xs mb-2"
                >
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ChevronDown
                          size={20}
                          color="black"
                          className={` opacity-0 transition-opacity duration-200 hover:opacity-100 z-50  absolute top-3  right-3 ${
                            !isOutgoing && "ml-1"
                          }`}
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
                            onClick={() => {
                              onReplyMessageSend(msg);
                            }}
                          >
                            Reply
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  <div
                      onClick={() => setPreviewFile({ url, type })}
                      className="cursor-pointer flex gap-1 pr-8 pl-1 py-1 ml-2 items-center  text-blue-600 font-semibold hover:underline"
                    >
                      <FileText /> <p className="ml-2">{fileName}</p>
                    </div>
                  <a
                    href={url}
                    target="_blank"
                    download
                    className="block text-sm mt-2 text-blue-600 underline mb-2 text-center"
                  >
                    Download File
                  </a>
                </div>
              );
            })}
            <div
              className={`${
                msg.content?.trim()
                  ? `p-3 text-sm ${
                      isOutgoing
                        ? "rounded-l-lg rounded-br-lg bg-blue-800 text-white dark:bg-blue-900"
                        : "rounded-r-lg rounded-bl-lg bg-white text-black dark:bg-gray-800 dark:text-white"
                    }`
                  : "hidden"
              }`}
            >
              <div className="flex flex-col gap-1">
                {repliedMessage && (
                  <div className="mb-1 rounded border-l-4 border-blue-500 bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <p className="font-semibold">
                      {repliedMessage?.sender?.name}
                    </p>
                    <p className="truncate">{repliedMessage?.content}</p>
                  </div>
                )}
              </div>

              {
                <div className="flex items-center gap-1">
                  {<p>{msg.content}</p>}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ChevronDown
                        size={20}
                        className={`opacity-0 transition-opacity duration-200 hover:opacity-100 ${
                          !isOutgoing && "ml-1"
                        }`}
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
                          onClick={() => {
                            onReplyMessageSend(msg);
                          }}
                        >
                          Reply
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Outgoing avatar */}
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

  return (
    <>
      {messages.length > 0 ? (
        <div className="space-y-2">{renderedMessages}</div>
      ) : (
        <div className="font-semibold text-black dark:text-white">
          No messages in this channel
        </div>
      )}

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="flex justify-center my-auto w-full text-black bg-gray-400 flex-col">
          <DialogHeader>
            <DialogTitle className="text-base text-center font-semibold">
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

          <Link
            href={previewFile?.url}
            target="_blank"
            download
            className="block text-sm mt-2 text-blue-600 underline text-center"
          >
            <Button variant={"blue"}>
              {" "}
              <Download /> Download
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageList;

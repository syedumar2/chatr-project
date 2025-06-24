import { useState, useContext, useRef } from "react";

import { toast } from "sonner";
import MessageContext from "@/utils/contexts/message/MessageContext";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { Input } from "@/components/ui/input";
import { Files, PlusCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";

export const MessageInput = ({ replyMessage, clearReplyMessage }) => {
  const [inputField, setInputField] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { postMessage, postMessageWithFile, uploadProgress } =
    useContext(MessageContext);
  const { userId } = useContext(AuthContext);
  const { channelId } = useParams();

  const handlePost = async (e) => {
    e.preventDefault();
    const res = await postMessageWithFile({
      content: inputField,
      files,
      channelid: channelId,
      replyTo: replyMessage._id,
    });

    if (res.success) {
      setInputField("");
      toast.success("Message sent successfully");
      clearReplyMessage?.();
    } else {
      toast.error(`Error: ${res.message}`);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.info("No file selected");
      return;
    }
    const res = await postMessageWithFile({
      content: inputField || null,
      files: files,
      channelid: channelId,
      replyTo: replyMessage?._id || null,
    });
    if (res.success) {
      setInputField("");
      setFiles([]);
      toast.success("Files sent successfully");
      clearReplyMessage?.();
    } else {
      toast.error(`Error: ${res.message}`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Upload Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <div className="sticky bottom-0 bg-gray-300 dark:bg-gray-900 px-4 py-2">
        <div>
          {/* Reply preview */}
          {replyMessage && (
            <div className="mb-2 flex items-center justify-between rounded-lg border-l-4 border-blue-500 bg-white p-3 shadow-md dark:bg-gray-800">
              <div className="flex-1">
                <p className="text-sm font-semibold text-black dark:text-white">
                  {replyMessage?.sender?.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {replyMessage?.content}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearReplyMessage}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={16} />
              </Button>
            </div>
          )}
          {/* File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded border text-sm my-1">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-500 px-2 py-1 rounded border shadow-sm"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center space-x-3">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="blue">
                  <PlusCircle />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={triggerFileInput}
                  aria-label="Upload files"
                >
                  Upload Files
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              className="h-10 w-full rounded bg-white px-3 text-sm text-black placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              type="text"
              value={inputField}
              onChange={(e) => setInputField(e.target.value)}
              placeholder="Type your message here…"
            />

            <Button
              variant="blue"
              onClick={files.length === 0 ? handlePost : handleUpload}
              className={
                files.length > 0
                  ? "!bg-green-700 hover:!bg-green-600"
                  : "hover:bg-gray-400"
              }
              size="lg"
              title={files.length > 0 ? "Upload files" : "Send message"}
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

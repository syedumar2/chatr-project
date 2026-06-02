import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * FilePreview Component
 * Renders different file types based on MIME type
 * Supports: images, PDFs, and downloadable files
 * Displays filename in preview
 */
const FilePreview = ({ file }) => {
  if (!file || !file.url) return null;

  return (
    <>
      {file.fileName && (
        <p className="text-sm font-semibold mb-3 text-center break-words">
          {file.fileName}
        </p>
      )}
      {file.type?.startsWith("image/") && (
        <img
          src={file.url}
          alt="preview"
          className="max-w-full max-h-[70vh] object-contain rounded"
        />
      )}
      {file.type === "application/pdf" && (
        <iframe
          src={file.url}
          title="PDF"
          className="max-w-full h-[70vh] border rounded"
        />
      )}
      <a
        href={file.url}
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
  );
};

export default FilePreview;

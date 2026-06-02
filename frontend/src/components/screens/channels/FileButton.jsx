import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * FileButton Component
 * Renders a button to trigger file preview with filename
 * Calls onPreview callback when clicked
 * Supports both single file and array of files from backend
 */
const FileButton = ({ files, onPreview }) => {
  if (!files) return null;

  // Handle both single file object and array of files
  const fileArray = Array.isArray(files) ? files : [files];
  if (fileArray.length === 0) return null;

  const handleClick = () => {
    // Preview first file by default
    const firstFile = fileArray[0];
    onPreview({
      url: firstFile.fileUrl || firstFile.url,
      type: firstFile.fileType || firstFile.type,
      fileName: firstFile.fileName,
    });
  };

  const displayName =
    fileArray.length === 1
      ? fileArray[0].fileName
      : `${fileArray.length} files`;

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} title={displayName}>
      <FileText size={16} /> {displayName}
    </Button>
  );
};

export default FileButton;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FilePreview from "./FilePreview";

/**
 * FilePreviewDialog Component
 * Modal dialog for displaying file previews
 * Handles opening/closing state
 */
const FilePreviewDialog = ({ file, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex justify-center my-auto w-full text-black bg-gray-400 flex-col">
        <DialogHeader>
          <DialogTitle className="text-base text-center font-semibold">
            File Preview
          </DialogTitle>
        </DialogHeader>
        <FilePreview file={file} />
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;

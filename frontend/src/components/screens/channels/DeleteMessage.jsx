import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useContext, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageContext from "@/utils/contexts/message/MessageContext";
import { toast } from "sonner";

const DeleteMessage = ({ msg }) => {
  const [open, setOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(msg.content);
  const { updateMessage, deleteMessage } = useContext(MessageContext);

  const handleDelete = async (e) => {
    e.preventDefault();
    const res = await deleteMessage(msg._id);
    if (res?.success) {
      toast.info("Message deleted successfully");
      setOpen(false);
    } else {
      
      toast.error(`Error: ${res.message}`);
    }
  };

  return (
    <>
      {/* This acts as the clickable item in the dropdown */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
            Delete Message
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent className={"text-black dark:text-white space-y-4"}>
          <form onSubmit={handleDelete} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Delete Message</DialogTitle>
              <DialogDescription className="">
                Are you sure you want to delete this message ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-between">
              <div className="flex justify-between items-center w-full">
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" type="submit">
                    Delete
                  </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteMessage;

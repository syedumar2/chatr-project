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
import MessageContext from "@/utils/contexts/message/messageContext";
import { toast } from "sonner";

const EditMessage = ({ msg }) => {
  const [open, setOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(msg.content);
  const { updateMessage } = useContext(MessageContext);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateMessage(msg._id, editedContent);
    if (res?.success) {
      toast.success("Message updated successfully");
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
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit message
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent className={"text-black dark:text-white space-y-4"}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Message</DialogTitle>
              <DialogDescription className="">
                Make changes to your message below.
              </DialogDescription>
            </DialogHeader>

            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <DialogFooter className="flex justify-between">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="blue" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditMessage;

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useContext } from "react";

import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DeleteChannel = ({ deleteDialogOpen, setDeleteDialogOpen }) => {
  const { deleteChannel } = useContext(ChannelContext);
  const { channelId } = useParams();
  const navigate = useNavigate();

  const onDelete = async () => {
    const res = await deleteChannel(channelId);
    if (res.success) {
      toast.success("Channel deleted successfully");
      setDeleteDialogOpen(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      toast.error("Error", res.message);
    }
  };

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <Button
        type="button"
        variant={"destructive"}
        onClick={() => setDeleteDialogOpen(true)}
      >
        Delete Channel
      </Button>
      <DialogContent className={"text-black "}>
        <DialogHeader>
          <DialogTitle className={"text-black dark:text-white"}>
            Delete Channel
          </DialogTitle>
          <DialogDescription className={"text-black dark:text-white"}>
            This operation cannot be undone
            <br />
            Are you sure you want to delete this channel ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex items-center justify-between">
            <DialogClose asChild>
              <Button variant="default">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete()}
            >
              Delete Channel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannel;

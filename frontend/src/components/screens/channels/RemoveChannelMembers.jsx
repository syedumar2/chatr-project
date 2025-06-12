import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CircleUser, Trash } from "lucide-react";
import { toast, Toaster } from "sonner";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";

export const RemoveChannelMembers = ({
  members,
  removeMemberDialogOpen,
  setRemoveMemberDialogOpen,
  errRef,
  errMsg,
  creatorEmail,
}) => {
  const initialEmails = members
    .map((m) => m.email)
    .filter((e) => e !== creatorEmail);

  const [emailList, setEmailList] = useState(initialEmails);
  const [markedForDelete, setMarkedForDelete] = useState([]);
  const { updateChannelMembers, getChannelData } = useContext(ChannelContext);
  const { channelId } = useParams();

  const toggleEmailMark = (email) => {
    setMarkedForDelete((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const resetEmailList = () => {
    setEmailList(initialEmails);
    setMarkedForDelete([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalList = emailList.filter(
      (email) => !markedForDelete.includes(email)
    );
    console.log("Send this to backend:", finalList);
    const res = await updateChannelMembers(channelId, finalList);
    if (res.success) {
      toast.success("Members updated!");
      setEmailList(finalList);
      setMarkedForDelete([]);
      setRemoveMemberDialogOpen(false);
      getChannelData();
    } else {
      toast.error(`Error: ${res.message}`);
    }
  };

  return (
    <Dialog
      open={removeMemberDialogOpen}
      onOpenChange={setRemoveMemberDialogOpen}
    >
      <Button
        type="button"
        variant={"blue"}
        onClick={() => setRemoveMemberDialogOpen(true)}
      >
        Remove Members
      </Button>

      <DialogContent className="text-black dark:text-white max-h-[90vh] overflow-y-auto">
        <p
          ref={errRef}
          className={errMsg ? "text-red-500 text-sm mb-2" : "hidden"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <DialogHeader>
          <DialogTitle>Remove Members</DialogTitle>
          <DialogDescription>
            Click the trash icon to mark members for deletion. Apply to confirm.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label className="dark:text-gray-300">Channel Members</Label>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {/* Creator */}
              <div className="flex items-center justify-between rounded-md p-2 bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage />
                    <AvatarFallback>
                      <CircleUser className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{creatorEmail}</p>
                </div>
                <span className="text-xs font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                  Creator
                </span>
              </div>

              {/* Other members */}
              {emailList.map((memberEmail, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                    markedForDelete.includes(memberEmail)
                      ? "bg-red-100 dark:bg-red-900"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage />
                      <AvatarFallback>
                        <CircleUser className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{memberEmail}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    type="button"
                    onClick={() => toggleEmailMark(memberEmail)}
                  >
                    <Trash
                      className={`w-4 h-4 transition-transform ${
                        markedForDelete.includes(memberEmail)
                          ? "text-red-500 scale-125"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <div className="w-full flex items-center justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetEmailList}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="destructive">
                Apply Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

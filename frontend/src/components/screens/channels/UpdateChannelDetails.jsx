import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const UpdateChannelDetails = ({
  open,
  setOpen,
  channelName,
  setChannelName,
  channelDescription,
  setChannelDescription,
  errMsg,
  errRef,
  handleUpdate,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant={"blue"} onClick={() => setOpen(true)}>
        Edit Channel Details
      </Button>
      <DialogContent className={"text-black "}>
        <p
          ref={errRef}
          className={errMsg ? "text-red-500 text-sm mb-2" : "hidden"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <DialogHeader>
          <DialogTitle className={"text-black dark:text-white"}>
            Update Channel
          </DialogTitle>
          <DialogDescription className={"text-black dark:text-white"}>
            Edit your channel details below. You can update the name and
            description of the channel.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleUpdate}>
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-1 dark:text-gray-200">
              Channel Name:
            </Label>
            <Input
              id="name"
              value={channelName}
              type="text"
              placeholder="Ex: General"
              onChange={(e) => {
                setChannelName(e.target.value);
              }}
              required
              className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
            ></Input>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-1 dark:text-gray-200">
              Description:
            </Label>
            <Textarea
              id="description"
              value={channelDescription}
              placeholder="Ex: For announcements only..."
              onChange={(e) => {
                e.preventDefault();
                setChannelDescription(e.target.value);
              }}
              required
              className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          <DialogFooter>
            <div className="w-full flex items-center justify-between">
              <DialogClose asChild>
                <Button variant="default">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="blue">
                Update Channel
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

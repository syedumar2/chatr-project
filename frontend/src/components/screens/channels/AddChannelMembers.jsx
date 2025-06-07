import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleAlert, CirclePlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
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
import { useState, useContext } from "react";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";

export const AddChannelMembers = ({
  members,
  membersDialogOpen,
  setMembersDialogOpen,
  errRef,
  errMsg,
}) => {
  const [email, setEmail] = useState(members.map((member) => member.email));
  const [emailField, setEmailField] = useState("");
  const { updateChannelMembers, getChannelData } = useContext(ChannelContext);
  const { channelId } = useParams();

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await updateChannelMembers(channelId, email);
    if (res.success) {
      toast.success("Channel Updated Successfully");
      setMembersDialogOpen(false);
      getChannelData();
    } else {
      toast.error(`Error: ${res.message}`);

      //TODO remove errRef and errMsg later
    }
  };

  const addEmail = () => {
    if (emailField.trim() !== "" && !email.includes(emailField)) {
      setEmail((prev) => [...prev, emailField.trim()]);
      setEmailField("");
    }
  };

  return (
    <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
      <Button
        type="button"
        variant={"blue"}
        onClick={() => setMembersDialogOpen(true)}
      >
        Add Members
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
            Add Members
          </DialogTitle>
          <DialogDescription className={"text-black dark:text-white"}>
            Add a new member by typing an email and clicking the "+" button.
            <br /> Click on Update Channel to submit changes.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleAdd}>
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-1 dark:text-gray-200">
              Members
            </Label>

            <div className="flex items-center gap-2">
              <Input
                id="emailField"
                type="email"
                onChange={(e) => setEmailField(e.target.value)}
                placeholder="example@gmail.com"
                className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
              <Button
                variant="secondary"
                type="button"
                onClick={() => addEmail()}
              >
                <CirclePlus />
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => console.log("Members here are", email)}
              >
                {" "}
                <CircleAlert />
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {email.map((email) => (
                <div className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {email}
                  <button className="ml-1 font-bold "></button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <div className="w-full flex items-center justify-between">
              <DialogClose asChild>
                <Button variant="default" onClick={() => setEmail(members)}>
                  Cancel
                </Button>
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

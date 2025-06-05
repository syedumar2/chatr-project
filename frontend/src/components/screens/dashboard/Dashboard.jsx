import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
 
  const { channelData, getChannelData, createChannel } =
    useContext(ChannelContext);

  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      await getChannelData();

    };
    fetchData();
  }, []);

  // Add member on Enter or button click
  const addMember = () => {
    if (email.trim() && !members.includes(email.trim())) {
      setMembers([...members, email.trim()]);
      setEmail("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || members.length === 0) {
      setErrMsg("Invalid Entry");
      return;
    }
    const res = await createChannel(name, description, members);

    if (res.success) {
      toast.success("Channel Created Successfully");
      setOpen(false);
      getChannelData();
    } else {
      toast.error(`Error: ${res.message}` )
      setErrMsg(res.message);
      errRef.current?.focus();
      //TODO remove errRef and errMsg later
    }
  };

  const removeMember = (emailToRemove) => {
    setMembers(members.filter((m) => m !== emailToRemove));
  };

  return (
    
    <div className="mx-auto my-10 bg-white text-black px-2 py-20 text-center min-h-screen dark:text-white dark:bg-black">
      <h1 className="mb-3 pb-2 text-4xl font-semibold md:text-7xl">
        <span className="font-light">Have a look </span>Around!
      </h1>
      <p className="mb-3 font-light ">
        You can start by creating your first channel or by messaging in ones
        you've already been added to
      </p>

      <hr className="mb-12 h-px border-0 opacity-25" />
      <div className="mx-auto flex max-w-screen-lg flex-wrap md:flex-nowrap md:space-x-3 md:px-20">
        <div className="mb-6 w-full max-w-full flex-shrink-0 rounded-lg bg-blue-600 py-2 text-white shadow md:w-1/3 md:py-8">
          <div className="mb-1 text-3xl font-semibold">
            {channelData?.length > 1
              ? `${channelData.length} Channels`
              : channelData?.length === 0
              ? "0 Channels "
              : " No Channels"}
          </div>
          <div className="mb-2 text-lg text-gray-100">
            {channelData?.length === 0
              ? "Available right now"
              : "Join or Create one"}
          </div>
        </div>
        <div className="mb-6 w-full max-w-full flex-shrink-0 rounded-lg bg-blue-600 py-2 text-white shadow md:w-1/3 md:py-8">
          <div className="mb-1 text-3xl font-semibold">4</div>
          <div className="mb-1 text-lg text-gray-100">
            Friends All Hardcoded rn
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <div
            className="mb-6 w-full max-w-full flex-shrink-0 rounded-lg bg-white py-2 text-blue-600 shadow border-blue-600 hover:cursor-pointer border-2 md:w-1/3 md:py-8"
            onClick={() => setOpen(true)}
          >
            <div>
              <div className="mb-1 text-4xl font-bold ">+</div>
              <div className="mb-1 text-lg text-blue-600">Create a Channel</div>
            </div>
          </div>
          <DialogContent className={"text-black space-y-4"}>
            <p
              ref={errRef}
              className={errMsg ? "text-red-500 text-sm mb-2" : "hidden"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <DialogHeader>
              <DialogTitle className={"text-black dark:text-white"}>
                Create a New Channel
              </DialogTitle>
              <DialogDescription className={"text-black dark:text-white"}>
                To create a new channel, enter the following details:
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="ml-1 dark:text-gray-200">
                  Channel Name:
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: General"
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="Ex: For announcements only..."
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="ml-1 dark:text-gray-200">
                  Members
                </Label>
                <div className="flex items-center gap-2 ">
                  <Input
                    id="members"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addMember();
                      }
                    }}
                    className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  />
                  <Button
                    variant={"secondary"}
                    type="button"
                    onClick={addMember}
                  >
                    <CirclePlus />
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {members.map((member) => (
                    <div
                      key={member}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm"
                    >
                      {member}
                      <button
                        className="ml-1 font-bold text-red-600"
                        onClick={() => removeMember(member)}
                        aria-label={`Remove ${member}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <div className="w-full flex items-center justify-between">
                  <DialogClose asChild>
                    <Button variant="default">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="blue"
                    disabled={
                      !name || !description || members.length === 0
                        ? true
                        : false
                    }
                  >
                    Add Channel
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;

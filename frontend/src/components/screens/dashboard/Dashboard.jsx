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
      toast.error(`Error: ${res.message}`);
      setErrMsg(res.message);
      errRef.current?.focus();
    }
  };

  const addMember = () => {
    if (email.trim() && !members.includes(email.trim())) {
      setMembers([...members, email.trim()]);
      setEmail("");
    }
  };

  const removeMember = (emailToRemove) => {
    setMembers(members.filter((m) => m !== emailToRemove));
  };

  return (
    <div className="mx-auto my-10 bg-white dark:bg-black text-black dark:text-white px-4 py-16 text-center min-h-screen ">
      <h1 className="mb-4 text-3xl sm:text-4xl md:text-6xl font-semibold">
        <span className="font-light">Have a look </span>Around!
      </h1>
      <p className="mb-6 font-light text-base sm:text-lg">
        You can start by creating your first channel or by messaging in ones
        you've already been added to
      </p>

      <hr className="mb-10 h-px border-0 bg-gray-400 dark:bg-gray-700 opacity-25" />

      <div className="mx-auto flex flex-col md:flex-row md:space-x-4 max-w-5xl">
        <div className="mb-6 w-full rounded-lg bg-blue-600 py-6 px-4 text-white shadow">
          <div className="mb-1 text-2xl sm:text-3xl font-semibold">
            {channelData?.length > 1
              ? `${channelData.length} Channels`
              : channelData?.length === 0
              ? "0 Channels"
              : "No Channels"}
          </div>
          <div className="text-base sm:text-lg text-gray-100">
            {channelData?.length === 0
              ? "Join or Create one"
              : "Available right now"}
          </div>
        </div>

        <div className="mb-6 w-full rounded-lg bg-blue-600 py-6 px-4 text-white shadow">
          <div className="mb-1 text-2xl sm:text-3xl font-semibold">4</div>
          <div className="text-base sm:text-lg text-gray-100">
            Friends All Hardcoded rn
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <div
            className="mb-6 w-full rounded-lg bg-white border-2 border-blue-600 py-6 px-4 text-blue-600 shadow hover:cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="text-3xl font-bold">+</div>
            <div className="text-base sm:text-lg">Create a Channel</div>
          </div>

          <DialogContent className="text-black dark:text-white space-y-4">
            <p
              ref={errRef}
              className={errMsg ? "text-red-500 text-sm mb-2" : "hidden"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <DialogHeader>
              <DialogTitle>Create a New Channel</DialogTitle>
              <DialogDescription>
                To create a new channel, enter the following details:
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="ml-1">
                  Channel Name:
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: General"
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="description" className="ml-1">
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

              <div>
                <Label htmlFor="members" className="ml-1">
                  Members:
                </Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
                  <Button variant="secondary" type="button" onClick={addMember}>
                    <CirclePlus />
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                  {members.map((member) => (
                    <div
                      key={member}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 text-sm text-black dark:text-white"
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
                <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2">
                  <DialogClose asChild>
                    <Button variant="default">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="blue"
                    disabled={!name || !description || members.length === 0}
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

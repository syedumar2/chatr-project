import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChevronLeft, CircleUser, DivideCircle } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { UpdateChannelDetails } from "./UpdateChannelDetails";
import { AddChannelMembers } from "./AddChannelMembers";
import { RemoveChannelMembers } from "./RemoveChannelMembers";

export const ChannelBar = ({
  members,
  open,
  setOpen,
  channelData,
  userId,
  channelName,
  setChannelName,
  channelDescription,
  setChannelDescription,
  errMsg,
  errRef,
  handleUpdate,
  memberDialogOpen,
  setMemberDialogOpen,
  removeMemberDialogOpen,
  setRemoveMemberDialogOpen,
  creatorEmail,
}) => {
  const [email, setEmail] = useState("");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="blue"
          className="fixed top-[60px] right-[-30px] hover:right-1 transition-all duration-300 z-50 rounded-xl"
        >
          <ChevronLeft />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-blue-900 text-white dark:text-white !max-w-[300px] dark:bg-gray-800">
        <SheetHeader>
          <SheetTitle className="font-medium  tracking-wide text-center text-white dark:text-white">
            {channelData?.name}
          </SheetTitle>
          <SheetDescription className="text-center text-white dark:text-white">
            {channelData?.members?.length} Members
          </SheetDescription>
        </SheetHeader>
        <div className="mx-2 p-4 rounded-md bg-blue-800 dark:bg-zinc-900 shadow-md space-y-4 text-sm">
          {/* Section: Members */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Members
            </h3>
            <div className="flex flex-col space-y-1 overfl">
              {channelData?.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-blue-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {/* Left side: icon + name */}
                  <div className="flex items-center gap-3">
                    <Avatar className={"size-10"}>
                      <AvatarImage />

                      <AvatarFallback className=" p-2 text-2xl bg-cyan-700 ">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white dark:text-white font-medium">
                      {member.name}
                    </p>
                  </div>

                  {/* Right side: admin label */}
                  {channelData?.createdBy === member._id && (
                    <span className="text-xs font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                      Creator
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Description */}
          {channelData?.description && (
            <div className="bg-blue-900 dark:bg-zinc-800 p-3 rounded-md">
              <h4 className="text-xs font-semibold text-white dark:text-gray-300 mb-1 uppercase tracking-wide">
                Channel Description
              </h4>
              <p className="text-sm text-gray-200 dark:text-gray-100">
                {channelData.description}
              </p>
            </div>
          )}

          {/* TODO Section (Commented) */}
          {/* Create functions like add members, delete channel, edit name/description/members */}
        </div>

        <SheetFooter>
          {channelData?.createdBy === userId ? (
            <>
              <UpdateChannelDetails
                open={open}
                setOpen={setOpen}
                channelName={channelName}
                setChannelName={setChannelName}
                channelDescription={channelDescription}
                setChannelDescription={setChannelDescription}
                errMsg={errMsg}
                errRef={errRef}
                handleUpdate={handleUpdate}
              />
              <AddChannelMembers
                members={members}
                membersDialogOpen={memberDialogOpen}
                setMembersDialogOpen={setMemberDialogOpen}
                errRef={errRef}
                errMsg={errMsg}
              />
              <RemoveChannelMembers
                members={members}
                removeMemberDialogOpen={removeMemberDialogOpen}
                setRemoveMemberDialogOpen={setRemoveMemberDialogOpen}
                errRef={errRef}
                errMsg={errMsg}
                creatorEmail={creatorEmail}
              />
            </>
          ) : (
            ""
          )}
          <SheetClose asChild>
            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

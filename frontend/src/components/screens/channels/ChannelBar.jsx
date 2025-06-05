import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const ChannelBar = ({ channelId }) => {
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
            {channelId}
          </SheetTitle>
          <SheetDescription className="text-center text-white dark:text-white">
            3 Members Hardcoded
          </SheetDescription>
        </SheetHeader>
        <div className="mx-2 p-4  dark:bg-zinc-900 text-sm shadow-sm space-y-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <CircleUser size={18} className="text-white" />
              <span className="text-white dark:text-white">Member 1</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <CircleUser size={18} className="text-white" />
              <span className="text-white dark:text-white">Member 2</span>
            </div>
            {/* Todo: create functions like add Members, Delete Channel, Edit Channel queries like name, desc, and members */}
          </div>
        </div>

        <SheetFooter>
          <Button type="button">Settings</Button>
          <SheetClose asChild>
            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

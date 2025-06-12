import { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import debounce from "lodash.debounce";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AuthContext from "@/utils/contexts/auth/AuthContext";

import { CirclePlus, CircleUserRound, Trash2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const SetContacts = ({
  user,
  toggleContact,
  addedContacts,
  setAddedContacts,
  contactsOpen,
  setContactsOpen,
  userId,
}) => {
  const { searchContacts, addFriends } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchUsers = debounce(async (searchTerm) => {
    if (!searchTerm) return setResults([]);
    const res = await searchContacts(searchTerm);
    setResults(res.filter((user) => user._id !== userId));
  });

  useEffect(() => {
    searchUsers(query);
  

    return () => {
      searchUsers.cancel();
    };
  }, [query]);

  const sendContacts = async () => {
    const list = await addFriends(addedContacts);
    if (list.success) {
      toast.success("Contacts added successfully");
      setContactsOpen(false);
    }
  };

  return (
    <Dialog open={contactsOpen} onOpenChange={setContactsOpen}>
      <DialogTrigger asChild>
        <Button className="w-xl h-12 text-2xl font-semibold p-4">
          Add/Remove Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Add and Remove Contacts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Search by Email..."
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />

          <div className="space-y-3">
            {results.map((u) => (
              <li
                key={u?._id}
                className="flex justify-between items-center border rounded px-4 py-2 dark:border-gray-700"
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex space-x-2">
                      <CircleUserRound />
                      <span>{u?.email}</span>
                    </div>
                  </HoverCardTrigger>
                  <Button
                    type="button"
                    variant={
                      addedContacts.includes(u?._id) ? "destructive" : "default"
                    }
                    onClick={() => {
                      toggleContact(u?._id);
                      console.log(addedContacts);
                    }}
                  >
                    {addedContacts.includes(u?._id) ? (
                      <Trash2 />
                    ) : (
                      <CirclePlus />
                    )}
                  </Button>
                  <HoverCardContent className={"w-64"}>
                    <div className="flex flex-col space-y-1">
                      <p className="font-semibold text-sm">{u?.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {u?.email}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </li>
            ))}
          </div>

          <DialogFooter>
            <Button variant="default" onClick={() => setContactsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => sendContacts()}>
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetContacts;

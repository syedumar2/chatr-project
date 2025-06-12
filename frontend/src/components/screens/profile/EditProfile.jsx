import { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AuthContext from "@/utils/contexts/auth/AuthContext";

const EditProfile = ({ user, editOpen, setEditOpen }) => {
  const { updateProfile } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Optional: keep inputs in sync when `user` changes
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(name, email);
    if (res.success) {
      toast.success("✅ Profile updated successfully!");
      setEditOpen(false);
    } else {
      toast.error(`❌ Error: ${res.message || "Failed to update profile."}`);
    }
  };

  return (
    <Dialog
      open={editOpen}
      onOpenChange={setEditOpen}
      className="dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
    >
      <DialogTrigger asChild>
        <Button variant="blue" className="w-xl h-12 text-2xl font-semibold p-4">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEdit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="mt-2">
              Submit Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;

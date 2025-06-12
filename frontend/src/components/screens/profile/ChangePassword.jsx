import { useState, useContext } from "react";
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

const ChangePassword = ({ passwordOpen, setPasswordOpen }) => {
  const { updateProfile, changePwd } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    const res = await changePwd(newPassword); // or use a dedicated updatePassword()
    if (res.success) {
      toast.success("🔒 Password updated successfully!");
      setPasswordOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(`❌ Error: ${res.message || "Failed to change password."}`);
    }
  };

  return (
    <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
      <DialogTrigger asChild>
        <Button className="w-xl h-12 text-2xl font-semibold p-4">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ChangePassword;

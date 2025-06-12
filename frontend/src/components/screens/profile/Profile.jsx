import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import SetContacts from "./SetContacts";

const ProfileCard = () => {
  const { user } = useContext(AuthContext);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  const [addedContacts, setAddedContacts] = useState([]);



  const toggleContact = (id) => {
    setAddedContacts((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    console.log(user);
    setAddedContacts(user?.contacts.map((u)=>u._id));
    console.log(addedContacts)
  }, [user]);

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Card className="w-[700px] min-h-fit py-8 max-w-full shadow-lg border-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
        <CardContent className="space-y-4 p-8 flex flex-col items-center">
          <h3 className="text-4xl tracking-wide font-semibold">Profile</h3>

          <Avatar className="size-32 text-5xl text-white">
            <AvatarImage />
            <AvatarFallback className="bg-purple-600">
              {user?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-medium text-gray-700 dark:text-gray-100">
              {user?.name}
            </h1>
            <p className="font-semibold text-gray-600 dark:text-gray-300 mt-3">
              {user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.contacts?.length} contact
              {user?.contacts?.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Edit Profile Dialog */}
          <EditProfile
            user={user}
            editOpen={editOpen}
            setEditOpen={setEditOpen}
          />

          {/* Change Password Dialog */}
          <ChangePassword
            setPasswordOpen={setPasswordOpen}
            passwordOpen={passwordOpen}
          />

          {/* Add/Remove Contacts Dialog */}
          <SetContacts
            user={user}
            addedContacts={addedContacts}
            setAddedContacts={setAddedContacts}
            contactsOpen={contactsOpen}
            setContactsOpen={setContactsOpen}
            toggleContact={toggleContact}
            userId = {user?._id}
          />


        </CardContent>
      </Card>
    </section>
  );
};

export default ProfileCard;

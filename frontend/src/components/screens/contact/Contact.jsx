import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/utils/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import { toast } from "sonner";

const Contact = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { createDmChannel, dmChannelData, getChannelData } = useContext(ChannelContext);
  const [contact, setContact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.contacts) {
      const foundContact = user.contacts.find((u) => u._id === id);
      setContact(foundContact);
    }
    console.log("user data appearing from server", user);
    console.log("all dm channelData", dmChannelData);
  }, [user, id]);

  const directMessage = async (memberId) => {
    const existingChannel = dmChannelData.find((channel) =>
      channel.members.some((member) => member._id === memberId)
    );
    if (existingChannel) {
      navigate(`/channel/dm/${existingChannel._id}`);
      return;
    }

    const res = await createDmChannel(memberId);
    if (res.success) {
      toast.success(res.message);
      await getChannelData();
      navigate(`/channel/dm/${res.data.id}`);
    } else {
      toast.error("Error", res.message);
    }
  };

  return (
    <div>
      <section className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl py-8 shadow-lg border-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white">
          <CardContent className="space-y-4 p-6 sm:p-8 flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl tracking-wide font-semibold">
              Contact
            </h3>

            <Avatar className="size-24 sm:size-28 md:size-32 text-4xl sm:text-5xl text-white">
              <AvatarImage />
              <AvatarFallback className="bg-purple-600">
                {contact?.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-100">
                {contact?.name || "Unknown"}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-300 mt-2">
                {contact?.email || "No email available"}
              </p>

              <Button
                variant="blue"
                className="w-full sm:w-md lg:w-xl md:w-lg h-12 text-2xl font-semibold p-4"
                //when clicked this will either redirect to dm channel or create one
                onClick={() => directMessage(contact._id)}
              >
                <Send />
                Direct Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;

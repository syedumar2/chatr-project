import { useEffect, useState, useContext } from "react";
import {
  Home,
  Inbox,
  CircleUser,
  Contact,
  ChevronDown,
  ChevronRight,
  Hash,
  UserPen,
  Send,
} from "lucide-react";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import AuthContext from "@/utils/contexts/auth/AuthContext";

const AppSidebar = () => {
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const { channelData, getChannelData } = useContext(ChannelContext);
  const { user } = useContext(AuthContext);

  const toggleContacts = () => setContactsOpen(!contactsOpen);
  const toggleChannels = () => setChannelsOpen(!channelsOpen);
  const toggleDm = () => setDmOpen(!dmOpen);

  useEffect(() => {
    const fetchData = async () => {
      await getChannelData();
    };
    fetchData();
  }, []);

  return (
    <Sidebar>
      <SidebarContent className="bg-blue-900 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-center text-white text-2xl py-10 font-semibold tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Channels (Collapsible) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleChannels}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Inbox size={18} />
                    <span>Channels</span>
                  </div>
                  {channelsOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Submenu - Hardcoded channels */}
              {channelsOpen &&
                (channelData ? (
                  <div className="ml-8 mt-1 space-y-1 text-sm">
                    {channelData.map((channel) => (
                      <div
                        className="flex items-center gap-2 hover:underline"
                        key={channel._id}
                      >
                        <Hash size={16} />
                        <Link to={`/channel/${channel._id}`}>
                          {" "}
                          {channel.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ml-8 mt-1 space-y-1 text-sm">
                    <Hash size={16} />
                    <span>Server Fetch failed</span>
                  </div>
                ))}
              {/* Direct Messages collapsible */}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleDm}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Send size={18} />
                    <span>Direct Messages</span>
                  </div>
                  {channelsOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </SidebarMenuButton>
                {dmOpen && (
                  <div className="ml-8 mt-1 space-y-1 text-sm">
                    <div className="flex items-center gap-2 hover:underline">
                      <Hash size={16} />
                      Dummy Channel
                    </div>
                  </div>
                )}
              </SidebarMenuItem>

              {/* Contacts */}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleContacts}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Contact size={18} />
                    <span>Contacts</span>
                  </div>
                  {contactsOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {contactsOpen && (
                <div className="ml-8 mt-1 space-y-1 text-sm">
                  {user?.contacts?.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <CircleUser size={20} />
                      <Link to={`/contact/${u?._id}`}>
                        <span className="hover:cursor-pointer">{u?.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <UserPen size={18} />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };

//TODO replace harcoded code with dynamic rest api query and dynamic channel component generation

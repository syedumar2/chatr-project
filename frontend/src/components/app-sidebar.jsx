import { useEffect, useState, useContext } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  CircleUser,
  Contact,
  ChevronDown,
  ChevronRight,
  Hash,
  UserPen,
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

const AppSidebar = () => {
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const { channelData, getChannelData } = useContext(ChannelContext);

  const toggleContacts = () => setContactsOpen(!contactsOpen);
  const toggleChannels = () => setChannelsOpen(!channelsOpen);

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
                  <a href="/dashboard" className="flex items-center gap-2">
                    <Home />
                    <span>Dashboard</span>
                  </a>
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
                    <a
                      href="/channel/general"
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Hash size={16} />
                      <span>general</span>
                    </a>
                    <a
                      href="/channel/random"
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Hash size={16} />
                      <span>random</span>
                    </a>
                    <a
                      href="/channel/dev"
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Hash size={16} />
                      <span>dev</span>
                    </a>
                  </div>
                ))}
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
                  <div className="flex items-center gap-2 hover:underline">
                    <CircleUser size={20} />
                    <span>Random User 1</span>
                  </div>
                  <div className="flex items-center gap-2 hover:underline">
                    <CircleUser size={20} />
                    <span>Random User 2</span>
                  </div>
                </div>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/profile" className="flex items-center gap-2">
                    <UserPen size={18} />
                    <span>Profile</span>
                  </a>
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

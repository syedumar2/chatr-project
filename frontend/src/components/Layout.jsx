import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthContext from "../utils/contexts/auth/AuthContext";
import ChannelContext from "@/utils/contexts/channel/ChannelContext";
import { useNavigate } from "react-router-dom";
import { Handshake, Moon, Sun, LoaderCircle } from "lucide-react";
import { useTheme } from "../utils/contexts/theme/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { accessToken, fetchUserData, logout } = useContext(AuthContext);
  const { getChannelData } = useContext(ChannelContext);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await fetchUserData();

      if (res?.success) {
        setUserData(res.userData);
      } else {
        console.error(res?.message);
      }
    };

    try {
      setLoading(true);
      getData();
      getChannelData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserData]);

  const logOut = async () => {
    const res = await logout();
    if (res.success) {
      setUserData(null);
      console.log(res.message);
      navigate("/signin");
    } else {
      alert(res.message);
    }
  };

  return !loading ? (
    <SidebarProvider className="p-0 mx-0 ">
      <AppSidebar />
      <main className="flex-1 p-0">
        <nav className="flex items-center justify-between gap-6 p-4  w-full h-14 bg-blue-900 dark:bg-gray-900">
          <div className="flex items-center gap-8 text-xl">
            <SidebarTrigger />

            {/* Icon container: white bg in light, gray-700 in dark */}
            <div className="flex items-center justify-between gap-4 ml-8 py-2">
              <div className="bg-white dark:bg-gray-700 rounded-full p-2">
                {/* Handshake icon: black in light, white in dark */}
                <Handshake className="w-6 h-6 text-black dark:text-white" />
              </div>
              {/* “Chatr” text: white in both modes */}
              <span className="pixel-text text-white">Chatr</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mr-20">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className=" flex items-center justify-center p-2 rounded-full bg-gray-700 text-white size-8  dark:bg-gray-700  transition-colors"
            >
              {theme === "dark" ? <Sun size={30} /> : <Moon size={30} />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className={"size-10"}>
                  <AvatarImage />
                  {userData ? (
                    <AvatarFallback className=" p-2 text-2xl bg-purple-600 ">
                      {userData?.fullname?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="...">
                      <LoaderCircle className="animate-spin" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className={"text-center"}>
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userData ? (
                  <div className="bg-accent rounded p-2">
                    <div className="flex-col items-center px-2 py-2 text-sm ">
                      <p>
                        <span> Name: {userData?.fullname} </span>{" "}
                      </p>
                    </div>
                    <div className="flex-col items-center px-2 py-2 text-sm ">
                      <p>
                        <span>Email: {userData?.email}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <LoaderCircle className="animate-spin" />
                )}

                <DropdownMenuItem className={"ml-1.5"}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="p-2 ml-1.5"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        {children}
      </main>
      <Toaster richColors position="top-center" />
    </SidebarProvider>
  ) : (
    <h3>Loading...</h3>
  );
};

export default Layout;

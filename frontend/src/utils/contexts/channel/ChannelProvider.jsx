import { useState, useEffect, useContext } from "react";
import ChannelContext from "./ChannelContext";
import { channelApi } from "@/utils/axios";
import AuthContext from "../auth/AuthContext";

const ChannelProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const [channelData, setChannelData] = useState(null);

  const getChannelData = async () => {
    try {
      const res = await channelApi.get("/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res?.data.success) {
        return setChannelData(res?.data?.channels);
        // return { success: true, channels: res.data?.channels }; //for testing remove later
      } else {
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      if (error.response?.data?.message) {
        return { success: false, message: error?.response?.data.message };
      } else {
        return { success: false, message: "An unexpected error occurred." };
      }
    }
  };

  const createChannel = async (name, description, members = []) => {
    try {
      const res = await channelApi.post("", {
        name,
        description,
        members,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res?.data.success) {
        return { success: true, message: "Channel created successfully" };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      if (error.response?.data?.message) {
        return { success: false, message: error?.response?.data.message };
      } else {
        return { success: false, message: "An unexpected error occurred." };
      }
    }
  };

  return (
    <ChannelContext.Provider
      value={{ getChannelData, channelData, createChannel }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelProvider;

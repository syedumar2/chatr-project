import axios from "axios";
import api, { messageApi } from "./axios";
import { channelApi } from "./axios";

export default async function refreshToken() {
  const baseUrl = import.meta.env.VITE_DEV_URL;

  //use for testing lan

  const res = await axios.post(
    `${baseUrl}api/auth/refresh`,
    {},
    { withCredentials: true } // Include cookies if refresh token is in a cookie
  );

  const newAccessToken = res.data.accessToken;
  localStorage.setItem("accessToken", newAccessToken); // optional
  channelApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${newAccessToken}`;
  api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
  messageApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${newAccessToken}`;

  return newAccessToken;
}

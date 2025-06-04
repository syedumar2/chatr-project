import axios from "axios";
import api from "./axios";
import { channelApi } from "./axios";

export default async function refreshToken() {
  const res = await axios.post(
    "http://localhost:3000/api/auth/refresh",
    {},
    { withCredentials: true } // Include cookies if refresh token is in a cookie
  );
  console.log(res);

  const newAccessToken = res.data.accessToken;
  localStorage.setItem("accessToken", newAccessToken); // optional
  channelApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${newAccessToken}`;
  api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

  return newAccessToken;
}

import axios from "axios";

import handle401Error from "./handle401";
const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true, //sends cookies
});

export const channelApi = axios.create({
  baseURL: "http://localhost:3000/api/channel",
  withCredentials: true, //sends cookies
});

export const messageApi = axios.create({
  baseURL: "http://localhost:3000/api/message",
  withCredentials: true, //sends cookies
})
// Interceptor: Automatically refresh token on 401

// Attach response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => handle401Error(error, api)
);

channelApi.interceptors.response.use(
  res => res,
  error => handle401Error(error, channelApi)
);
export default api;

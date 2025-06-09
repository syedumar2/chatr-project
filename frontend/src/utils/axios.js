import axios from "axios";

import handle401Error from "./handle401";

const baseUrl = import.meta.env.VITE_DEV_URL
//use for testing lan


const api = axios.create({
  baseURL: `${baseUrl}api/auth`,
  withCredentials: true, //sends cookies
});

export const channelApi = axios.create({
  baseURL: `${baseUrl}api/channel`,
  withCredentials: true, //sends cookies
});

export const messageApi = axios.create({
  baseURL: `${baseUrl}api/message`,
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
messageApi.interceptors.response.use(
   res => res,
  error => handle401Error(error, messageApi)
)
export default api;

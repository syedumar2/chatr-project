import axios from "axios";

import handle401Error from "./handle401";

const localhost = "http://localhost:3000/";
const lan = "http://192.168.1.5:3000/"
//use for testing lan


const api = axios.create({
  baseURL: `${localhost}api/auth`,
  withCredentials: true, //sends cookies
});

export const channelApi = axios.create({
  baseURL: `${localhost}api/channel`,
  withCredentials: true, //sends cookies
});

export const messageApi = axios.create({
  baseURL: `${localhost}api/message`,
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

import axios from "axios";
import refreshToken from "./refreshToken";
import handle401Error from "./handle401";
const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true, //sends cookies
});
// Interceptor: Automatically refresh token on 401

// Attach response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => handle401Error(error, api)
);

export default api;

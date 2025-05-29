import axios from "axios";

export default async function refreshToken() {
  const response = await axios.post(
    "http://localhost:3000/api/auth/refresh",
    {},
    { withCredentials: true } // Include cookies if refresh token is in a cookie
  );

  return response.data.accessToken;
}

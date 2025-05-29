import refreshToken from "./refreshToken";

export default async function handle401Error(error, apiInstance) {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshToken();

      // Update headers globally and for this specific request
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      return apiInstance(originalRequest); // Retry original request
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      window.location.href = "/signin"; // Redirect to login
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
}

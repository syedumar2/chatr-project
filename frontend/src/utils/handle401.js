import refreshToken from "./refreshToken";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

export default async function handle401Error(error, apiInstance) {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue the request until refresh is done
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(apiInstance(originalRequest));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshToken();

      apiInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken); // Retry all queued requests

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null); // Reject all queued requests
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
}

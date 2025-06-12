// Import the function that handles token refresh logic (usually sends refresh token to backend)
import refreshToken from "./refreshToken";

// Flag to track if a refresh operation is currently in progress
let isRefreshing = false;

// Queue to store failed requests that should retry once token is refreshed
let failedQueue = [];

/**
 * Processes all queued requests:
 * - If token refresh succeeded, resolves each promise with the new token
 * - If token refresh failed, rejects each queued promise
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

/**
 * Handles 401 Unauthorized responses by trying to refresh the token.
 * Retries the original request after a successful token refresh.
 */
export default async function handle401Error(error, apiInstance) {
  const originalRequest = error.config;

  // Check if the error is due to an expired access token and the request hasn't been retried yet
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // Mark this request as already retried to avoid infinite loops

    if (isRefreshing) {
      // If a refresh is already in progress, queue the request
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            // Once refresh completes, retry the request with the new token
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(apiInstance(originalRequest));
          },
          reject: (err) => {
            // If refresh fails, reject this request as well
            reject(err);
          },
        });
      });
    }

    // If no refresh is in progress, start one
    isRefreshing = true;

    try {
      // Attempt to get a new access token
      const newAccessToken = await refreshToken();

      // Set the new token globally on the API instance so future requests use it
      apiInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;

      // Retry all queued requests with the new token
      processQueue(null, newAccessToken);

      // Also retry the original request that caused the 401
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    } catch (refreshError) {
      // If token refresh fails, reject all queued requests
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      // Reset the flag whether refresh succeeded or failed
      isRefreshing = false;
    }
  }

  // If it's not a 401 or already retried, just forward the error
  return Promise.reject(error);
}

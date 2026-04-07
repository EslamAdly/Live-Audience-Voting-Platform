import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

console.log("API Base URL:", baseURL);

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

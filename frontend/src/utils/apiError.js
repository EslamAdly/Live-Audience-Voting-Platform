export const getApiErrorMessage = (error, fallbackMessage) => {
  const message = error?.response?.data?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    return "Cannot reach backend API. Make sure backend is running on port 5000.";
  }

  if (error?.response?.status) {
    return `Request failed with status ${error.response.status}.`;
  }

  return fallbackMessage;
};

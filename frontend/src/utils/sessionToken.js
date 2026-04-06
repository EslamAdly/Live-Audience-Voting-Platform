const KEY = "live_poll_session_token";

export const getSessionToken = () => {
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;

  const token = crypto.randomUUID();
  localStorage.setItem(KEY, token);
  return token;
};

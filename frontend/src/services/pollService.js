import { apiClient } from "./apiClient";

export const pollService = {
  getPolls(params = {}) {
    return apiClient.get("/polls", { params }).then((res) => res.data);
  },
  getPollById(id) {
    return apiClient.get(`/polls/${id}`).then((res) => res.data);
  },
  createPoll(payload) {
    return apiClient.post("/polls", payload).then((res) => res.data);
  },
  updatePoll(id, payload) {
    return apiClient.put(`/polls/${id}`, payload).then((res) => res.data);
  },
  deletePoll(id) {
    return apiClient.delete(`/polls/${id}`);
  },
  getResults(id) {
    return apiClient.get(`/polls/${id}/results`).then((res) => res.data);
  },
  vote(payload, sessionToken) {
    return apiClient
      .post("/vote", payload, {
        headers: sessionToken ? { "x-session-token": sessionToken } : {}
      })
      .then((res) => res.data);
  }
};

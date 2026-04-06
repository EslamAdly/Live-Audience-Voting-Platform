import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pollService } from "../services/pollService";
import { getApiErrorMessage } from "../utils/apiError";

export const AdminDashboardPage = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    pollService
      .getPolls({ page: 1, pageSize: 50 })
      .then((data) => setPolls(data.items))
      .catch((err) => setError(getApiErrorMessage(err, "Failed to fetch polls")));
  };

  useEffect(() => {
    load();
  }, []);

  const removePoll = async (id) => {
    try {
      await pollService.deletePoll(id);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Delete failed"));
    }
  };

  const toggleStatus = async (poll) => {
    try {
      await pollService.updatePoll(poll.id, {
        status: poll.status === "active" ? "inactive" : "active"
      });
      load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Status update failed"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link className="rounded bg-blue-600 px-3 py-2 text-white" to="/admin/new">
          Create Poll
        </Link>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="space-y-3">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-lg border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{poll.title}</h2>
                <p className="text-sm text-slate-600">{poll.description}</p>
                <p className="text-xs text-slate-500">
                  {new Date(poll.startTime).toLocaleString()} - {new Date(poll.endTime).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded border px-3 py-1" onClick={() => toggleStatus(poll)} type="button">
                  {poll.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <Link className="rounded border px-3 py-1" to={`/admin/${poll.id}/edit`}>
                  Edit
                </Link>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white"
                  onClick={() => removePoll(poll.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

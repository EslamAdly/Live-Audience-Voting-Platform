import { Link } from "react-router-dom";

export const PollCard = ({ poll }) => (
  <div className="rounded-lg border bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-semibold text-slate-900">{poll.title}</h3>
      <span
        className={`rounded px-2 py-1 text-xs ${
          poll.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {poll.status}
      </span>
    </div>
    <p className="mb-4 text-sm text-slate-600">{poll.description}</p>
    <div className="flex gap-2">
      <Link to={`/polls/${poll.id}`} className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
        Vote
      </Link>
      <Link to={`/results/${poll.id}`} className="rounded border px-3 py-1 text-sm">
        Results
      </Link>
    </div>
  </div>
);

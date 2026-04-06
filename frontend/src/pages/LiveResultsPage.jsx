import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ResultsCharts } from "../components/ResultsCharts";
import { usePollResults } from "../hooks/usePollResults";
import { pollService } from "../services/pollService";

export const LiveResultsPage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState("");
  const { results, chartData, isSocketConnected } = usePollResults(id);

  useEffect(() => {
    pollService
      .getPollById(id)
      .then(setPoll)
      .catch((err) => setError(err?.response?.data?.message || "Failed to load poll"));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!poll) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-2xl font-semibold">{poll.title}</h1>
        <p className="text-slate-600">{poll.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-slate-500">Total votes: {results.totalVotes}</p>
          <span className={`text-sm ${isSocketConnected ? "text-green-600" : "text-amber-600"}`}>
            {isSocketConnected ? "Live via WebSocket" : "Polling fallback (5s)"}
          </span>
        </div>
      </div>

      <ResultsCharts chartData={chartData} />

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Option Breakdown</h2>
        <ul className="space-y-1">
          {results.options.map((option) => (
            <li key={option.optionId} className="text-sm text-slate-700">
              {option.text}: {option.votes} votes ({option.percentage}%)
            </li>
          ))}
        </ul>
      </div>

      <Link className="text-blue-600 underline" to={`/polls/${id}`}>
        Back to voting
      </Link>
    </div>
  );
};

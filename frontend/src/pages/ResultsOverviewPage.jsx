import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pollService } from "../services/pollService";

export const ResultsOverviewPage = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    pollService
      .getPolls({ page: 1, pageSize: 50 })
      .then((data) => {
        console.log("API Response:", data);
        if (data && data.items) {
          setPolls(data.items);
        } else {
          setError("Invalid response format from API");
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(`Failed to fetch polls: ${err.message}`);
      });
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Live Results</h1>
      <div className="grid gap-3">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{poll.title}</h2>
                <p className="text-sm text-slate-600">{poll.description}</p>
              </div>
              <Link className="text-blue-600 underline" to={`/results/${poll.id}`}>
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

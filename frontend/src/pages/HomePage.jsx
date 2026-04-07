import { useEffect, useState } from "react";
import { PollCard } from "../components/PollCard";
import { pollService } from "../services/pollService";

export const HomePage = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    pollService
      .getPolls({ page: 1, pageSize: 50 })
      .then((data) => {
        console.log("API Response:", data);
        if (data && data.items) {
          setPolls(data.items.filter((poll) => poll.status === "active"));
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
      <h1 className="text-2xl font-semibold">Active Polls</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
};

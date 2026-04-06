import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pollService } from "../services/pollService";
import { getSessionToken } from "../utils/sessionToken";

export const PollVotingPage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pollService
      .getPollById(id)
      .then(setPoll)
      .catch((err) => setError(err?.response?.data?.message || "Failed to load poll"));
  }, [id]);

  const canVote = (currentPoll) => {
    const now = new Date();
    return (
      currentPoll?.status === "active" &&
      now >= new Date(currentPoll.startTime) &&
      now <= new Date(currentPoll.endTime)
    );
  };

  const handleVote = async () => {
    if (!selectedOption) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const sessionToken = getSessionToken();
      await pollService.vote({ pollId: Number(id), optionId: selectedOption }, sessionToken);
      setSuccess("Your vote was submitted successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Vote submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!poll) return <p>Loading...</p>;

  return (
    <div className="space-y-4 rounded-lg border bg-white p-5">
      <h1 className="text-2xl font-semibold">{poll.title}</h1>
      <p className="text-slate-600">{poll.description}</p>
      <p className="text-sm text-slate-500">
        Window: {new Date(poll.startTime).toLocaleString()} - {new Date(poll.endTime).toLocaleString()}
      </p>

      <div className="space-y-2">
        {poll.options.map((option) => (
          <label key={option.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="vote-option"
              value={option.id}
              onChange={() => setSelectedOption(option.id)}
            />
            {option.text}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleVote}
          disabled={loading || !selectedOption || !canVote(poll)}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Submitting..." : "Submit Vote"}
        </button>
        <Link className="text-blue-600 underline" to={`/results/${id}`}>
          View live results
        </Link>
      </div>

      {!canVote(poll) ? <p className="text-sm text-amber-600">Voting is not currently available.</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}
    </div>
  );
};

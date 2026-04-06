import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { pollService } from "../services/pollService";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const usePollResults = (pollId) => {
  const [results, setResults] = useState({ totalVotes: 0, options: [] });
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (!pollId) return;
    let intervalId = null;

    const fetchResults = async () => {
      const data = await pollService.getResults(pollId);
      setResults(data);
    };

    fetchResults();

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      setIsSocketConnected(true);
      socket.emit("poll:subscribe", Number(pollId));
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("poll:results:update", (payload) => {
      if (Number(payload.pollId) === Number(pollId)) {
        setResults(payload.results);
      }
    });

    intervalId = setInterval(() => {
      if (!socket.connected) {
        fetchResults();
      }
    }, 5000);

    return () => {
      socket.emit("poll:unsubscribe", Number(pollId));
      socket.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollId]);

  const chartData = useMemo(
    () =>
      results.options.map((option) => ({
        name: option.text,
        votes: option.votes,
        percentage: option.percentage
      })),
    [results]
  );

  return { results, chartData, isSocketConnected };
};

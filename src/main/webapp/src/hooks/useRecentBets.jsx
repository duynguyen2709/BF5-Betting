import { useEffect, useState } from "react";
import { getRecentBetHistory } from "../apis/BetHistoryApi";

export const useRecentBets = () => {
  const [playerRecentBets, setPlayerRecentBets] = useState({});
  const [recentBetLoading, setRecentBetLoading] = useState(false);

  useEffect(() => {
    setRecentBetLoading(true);
    getRecentBetHistory()
      .then((data) => setPlayerRecentBets(data))
      .finally(() => setRecentBetLoading(false));
  }, []);

  return {
    playerRecentBets,
    recentBetLoading,
  };
};

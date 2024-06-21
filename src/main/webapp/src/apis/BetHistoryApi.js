import { API_URL } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllBetHistory = () => axiosClient.get(API_URL.BetHistory);
const getRecentBetHistory = () =>
  axiosClient.get(`${API_URL.BetHistory}/recent`);

const getBetHistory = ({ playerId = "", startDate = "", endDate = "" }) => {
  return axiosClient.get(API_URL.BetHistory, {
    params: {
      playerId,
      startDate,
      endDate,
    },
  });
};

const insertBetHistory = (bet) => axiosClient.post(API_URL.BetHistory, bet);

const insertBetHistoryInBatch = (betList) =>
  axiosClient.post(`${API_URL.BetHistory}/batch`, betList);

const updateBetResult = (data) => {
  const url = `${API_URL.BetHistory}/${data.betId}/result`;
  return axiosClient.put(url, data);
};

export {
  getRecentBetHistory,
  getAllBetHistory,
  getBetHistory,
  insertBetHistory,
  insertBetHistoryInBatch,
  updateBetResult,
};

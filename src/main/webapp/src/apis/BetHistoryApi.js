import { ADMIN_USER_ID, API_URL, UNLOCK_DATA_KEY } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllBetHistory = () =>
  axiosClient.get(API_URL.BetHistory, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });

const getRecentBetHistory = () =>
  axiosClient.get(`${API_URL.BetHistory}/recent`, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });

const getBetHistory = ({ playerId = "", startDate = "", endDate = "" }) => {
  return axiosClient.get(API_URL.BetHistory, {
    params: {
      playerId,
      startDate,
      endDate,
    },
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });
};

const insertBetHistory = (bet) =>
  axiosClient.post(API_URL.BetHistory, bet, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });

const insertBetHistoryInBatch = (betList) =>
  axiosClient.post(`${API_URL.BetHistory}/batch`, betList, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });

const updateBetResult = (data) => {
  const url = `${API_URL.BetHistory}/${data.betId}/result`;
  return axiosClient.put(url, data, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });
};

export {
  getRecentBetHistory,
  getAllBetHistory,
  getBetHistory,
  insertBetHistory,
  insertBetHistoryInBatch,
  updateBetResult,
};

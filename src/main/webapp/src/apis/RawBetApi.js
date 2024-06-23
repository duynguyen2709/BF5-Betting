import { ADMIN_USER_ID, API_URL, UNLOCK_DATA_KEY } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getRawBetData = ({ sessionToken, startDate, endDate }) => {
  return axiosClient.get(API_URL.RawBet, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
    params: {
      sessionToken,
      startDate,
      endDate,
    },
  });
};

const getQuickRawBetData = ({ sessionToken }) => {
  return axiosClient.get(`${API_URL.RawBet}/quick`, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
    params: {
      sessionToken,
    },
  });
};

const updateResultFromRaw = (data) => {
  const url = `${API_URL.RawBet}/${data.betId}/result`;
  return axiosClient.put(url, data, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });
};

const updateBatchResultFromRaw = (betList) => {
  const url = `${API_URL.RawBet}/result/batch`;
  return axiosClient.put(url, betList, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });
};

export {
  getRawBetData,
  getQuickRawBetData,
  updateResultFromRaw,
  updateBatchResultFromRaw,
};

import { API_URL } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getRawBetData = ({ sessionToken, startDate, endDate }) => {
  return axiosClient.get(API_URL.RawBet, {
    params: {
      sessionToken,
      startDate,
      endDate,
    },
  });
};

const getQuickRawBetData = ({ sessionToken }) => {
  return axiosClient.get(`${API_URL.RawBet}/quick`, {
    params: {
      sessionToken,
    },
  });
};

const updateResultFromRaw = (data) => {
  const url = `${API_URL.RawBet}/${data.betId}/result`;
  return axiosClient.put(url, data);
};

const updateBatchResultFromRaw = (betList) => {
  const url = `${API_URL.RawBet}/result/batch`;
  return axiosClient.put(url, betList);
};

export {
  getRawBetData,
  getQuickRawBetData,
  updateResultFromRaw,
  updateBatchResultFromRaw,
};

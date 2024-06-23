import { ADMIN_USER_ID, API_URL, UNLOCK_DATA_KEY } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllStatistics = () =>
  axiosClient.get(API_URL.Statistics, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });

const getDetailStatistics = ({
  playerId = "",
  startDate = "",
  endDate = "",
}) => {
  return axiosClient.get(`${API_URL.Statistics}/detail`, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
    params: {
      playerId,
      startDate,
      endDate,
    },
  });
};

const doStatistic = ({ startDate, endDate, action }) =>
  axiosClient.post(
    API_URL.Statistics,
    {},
    {
      headers: {
        "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
      },
      params: {
        startDate,
        endDate,
        action,
      },
    }
  );

export { doStatistic, getAllStatistics, getDetailStatistics };

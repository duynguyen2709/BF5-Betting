import { API_URL } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllStatistics = () => axiosClient.get(API_URL.Statistics);

const getDetailStatistics = ({
  playerId = "",
  startDate = "",
  endDate = "",
}) => {
  return axiosClient.get(`${API_URL.Statistics}/detail`, {
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
      params: {
        startDate,
        endDate,
        action,
      },
    }
  );

export { doStatistic, getAllStatistics, getDetailStatistics };

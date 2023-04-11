import {API_URL} from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllStatistics = () => axiosClient.get(API_URL.Statistics);

const getDetailStatistics = ({playerId = '', startDate = '', endDate = ''}) => {
    return axiosClient.get(`${API_URL.Statistics}/detail`, {
        params: {
            playerId,
            startDate,
            endDate
        }
    })
}

export {getAllStatistics, getDetailStatistics};

import axiosClient from "../utils/ApiUtil";
import {API_URL} from "../common/Constant";

const getAllBetHistory = () => axiosClient.get(API_URL.BetHistory);

const getBetHistory = ({playerId = '', startDate = '', endDate = ''}) => {
    return axiosClient.get(API_URL.BetHistory, {
        params: {
            playerId,
            startDate,
            endDate
        }
    })
}

const insertBetHistory = (bet) => axiosClient.post(API_URL.BetHistory, bet)

const updateBetResult = (data) => {
    const url = `${API_URL.BetHistory}/${data.betId}/result`
    return axiosClient.put(url, data)
}

export {getAllBetHistory, getBetHistory, insertBetHistory, updateBetResult};

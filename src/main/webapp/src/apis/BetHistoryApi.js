import axiosClient from "../utils/ApiUtil";
import {API_URL} from "../common/Constant";

const getAllBetHistory = () => axiosClient.get(API_URL.BetHistory);

const getBetHistory = ({playerId = '', date = ''}) => {
    return axiosClient.get(API_URL.BetHistory, {
        params: {
            playerId,
            date
        }
    })
}

const updateBetResult = ({betId, result}) => {
    const url = `${API_URL.BetHistory}/${betId}/result`
    return axiosClient.put(url, {
        betId,
        result
    })
}

export {getAllBetHistory, getBetHistory, updateBetResult};

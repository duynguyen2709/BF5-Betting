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

const getRawBetInfo = ({sessionToken, startDate, endDate}) => {
    const url = `${API_URL.BetHistory}/raw`
    return axiosClient.get(url, {
        params: {
            sessionToken,
            startDate,
            endDate
        }
    })
}

const insertBetHistory = (bet) => axiosClient.post(API_URL.BetHistory, bet)

const updateBetResult = ({betId, result}) => {
    const url = `${API_URL.BetHistory}/${betId}/result`
    return axiosClient.put(url, {
        betId,
        result
    })
}

const updateBetResultFromRaw = (data) => {
    const betId = data.id
    const url = `${API_URL.BetHistory}/raw/${betId}/result`
    return axiosClient.put(url, data)
}

export {getAllBetHistory, getRawBetInfo, getBetHistory, insertBetHistory, updateBetResult, updateBetResultFromRaw};

import axiosClient from "../utils/ApiUtil";
import {API_URL} from "../common/Constant";

const getRawBetData = ({sessionToken, startDate, endDate}) => {
    return axiosClient.get(API_URL.RawBet, {
        params: {
            sessionToken,
            startDate,
            endDate
        }
    })
}

const updateResultFromRaw = (data) => {
    const betId = data.id
    const url = `${API_URL.RawBet}/${betId}/result`
    return axiosClient.put(url, data)
}

const updateBatchResultFromRaw = (betList) => {
    const url = `${API_URL.RawBet}/result/batch`
    return axiosClient.put(url, betList)
}

export {getRawBetData, updateResultFromRaw, updateBatchResultFromRaw}

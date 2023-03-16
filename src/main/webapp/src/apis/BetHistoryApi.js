import axiosClient from "../utils/ApiUtil";
import { API_URL } from "../common/Constant";

const getAllBetHistory = () => axiosClient.get(API_URL.GET_BET_HISTORY);

export { getAllBetHistory };

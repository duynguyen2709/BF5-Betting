import axiosClient from "../utils/ApiUtil";
import {API_URL} from "../common/Constant";

const getAllPlayers = () => axiosClient.get(API_URL.Players);

export { getAllPlayers };

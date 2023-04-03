import {API_URL} from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllPlayers = () => axiosClient.get(API_URL.Players);

export { getAllPlayers };

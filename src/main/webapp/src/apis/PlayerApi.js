import { ADMIN_USER_ID, API_URL, UNLOCK_DATA_KEY } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const getAllPlayers = () =>
  axiosClient.get(API_URL.Players, {
    headers: {
      "X-User-Id": localStorage.getItem(UNLOCK_DATA_KEY) || ADMIN_USER_ID,
    },
  });

export { getAllPlayers };

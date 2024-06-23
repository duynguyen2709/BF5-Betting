import { API_URL } from "../common/Constant";
import axiosClient from "../utils/ApiUtil";

const unlock = ({ key }) =>
  axiosClient.post(API_URL.Unlock, {
    key,
  });

export { unlock };

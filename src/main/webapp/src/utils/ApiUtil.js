import Axios from "axios";
import {message} from "antd";
import {MESSAGE} from "../common/Constant";

const axiosClient = Axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      if (response.data.data) {
        return response.data.data
      }
      return response.data;
    }
    return response;
  },
  (error) => {
    console.error(error);
    message.error(MESSAGE.DefaultErrorMessage, 4);

    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(MESSAGE.DefaultErrorMessage);
  }
);

export default axiosClient;

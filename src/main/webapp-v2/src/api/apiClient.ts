import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { BaseResponse } from '@/models';
import { MESSAGES } from '@/constants';

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env['VITE_BACKEND_API_URL'] as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    if (response && response.data) {
      return response.data.data || response.data;
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('AxiosError', error);

    if (error.response?.status === 403) {
      message.error(MESSAGES.TOKEN_EXPIRED, 4);
    } else if (error.response?.status === 400) {
      message.error((error.response.data as BaseResponse).message || MESSAGES.DEFAULT_ERROR, 4);
    } else {
      message.error(MESSAGES.DEFAULT_ERROR, 4);
    }
    return Promise.reject(error.response?.data || error.response || MESSAGES.DEFAULT_ERROR);
  }
);

export const apiGet = async <T>(url: string, params?: object): Promise<T> => {
  return axiosClient.get<T, T>(url, { params });
};

export const apiPost = async <T, D = any>(url: string, data?: D): Promise<T> => {
  return axiosClient.post<T, T, D>(url, data);
};

export default axiosClient;

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import jwt from 'jsonwebtoken';
import { IUserTokens } from '../../interfaces/interfaces';

const axiosAuth: AxiosInstance = axios.create();
axiosAuth.interceptors.request.use((requestConfig: AxiosRequestConfig): AxiosRequestConfig => {
  let tokenData: IUserTokens | null = null;
  if (localStorage.getItem('tokenData')) {
    tokenData = JSON.parse(localStorage.getItem('tokenData') || '');
  }
  if (tokenData) {
    const { token } = tokenData;
    const decodedToken = jwt.decode(token);
    if (decodedToken) {
      // eslint-disable-next-line no-param-reassign
      requestConfig.headers = requestConfig.headers ?? {};
      // eslint-disable-next-line no-param-reassign
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
  }
  return requestConfig;
});

export default axiosAuth;

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import jwt from 'jsonwebtoken';

const axiosAuth: AxiosInstance = axios.create();
axiosAuth.interceptors.request.use((requestConfig: AxiosRequestConfig) => {
  let tokenData: string | null =  null;
  if (localStorage.getItem('tokenData')) {
    tokenData = JSON.parse(localStorage.getItem('tokenData') || '');
  }
  if (tokenData) {
    const tokenDataParsed = JSON.parse(tokenData);
    const { token } = tokenDataParsed;
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
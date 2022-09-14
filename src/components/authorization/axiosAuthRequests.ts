import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import api, { StatusCodes } from '../../api/api';
import { IUserTokens } from '../../interfaces/interfaces';
import Authorization from '../../pages/authorization/authorization';
import Controller, { EPages } from '../controller/controller';
import saveToken from './saveToStorage';
import { hideUserLoggedMode } from './userLoggedMode';

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

axiosAuth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    // if access token is missing or invalid
    if (error.response.status === StatusCodes.UNAUTHORIZED) {
      let tokenData: IUserTokens | null = null;
      if (localStorage.getItem('tokenData')) {
        tokenData = await JSON.parse(localStorage.getItem('tokenData') || '');
      }
      if (tokenData) {
        const { token, refreshToken, userId } = tokenData;
        const decodedToken = jwt.decode(token);
        if (decodedToken) {
          // update tokens if user is logged in
          await api
            .getNewIUserTokens(refreshToken, userId)
            .then((newTokenData: IUserTokens) => {
              if (tokenData) {
                tokenData.token = newTokenData.token;
                tokenData.refreshToken = newTokenData.refreshToken;
                saveToken(tokenData);
              }
            })
            .catch((err: AxiosError) => {
              // if refreshToken expired
              if (err.response?.status === StatusCodes.FORBIDDEN || StatusCodes.UNAUTHORIZED) {
                localStorage.clear();
                hideUserLoggedMode();
                Controller.isLoggedIn = false;
                const authBtn = document.getElementById('authorization') as HTMLElement;
                Controller.currentPage = EPages.auth;
                Controller.setActiveMenuItem(authBtn);
                Controller.removePanels();
                const view = new Authorization();
              }
            });
        }
      }
    }
  }
);
export default axiosAuth;

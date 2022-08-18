import axios, { AxiosError } from 'axios';
import {
  saveExpDate,
  saveToken,
} from '../components/authorization/saveToStorage';
import { User } from '../components/interfaces/interfaces';

const BASE_URL = 'https://rs-lang-rsschool-task.herokuapp.com';

interface ResponseUser {
  id: string;
  email: string;
}

export const createUser = async (
  user: User,
): Promise<ResponseUser | undefined> => {
  // TODO: fix eslint error with return/void
  try {
    const response = await axios.post(`${BASE_URL}/users`, user);
    const content = response.data;
    console.log('user created');
    return content;
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    console.log(err.config);
  }
};

export const getUser = async (id: string): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${id}`);
    const content = response.data;
    console.log('user:');
    console.log(content);
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    console.log(err.config);
  }
};

export const getNewToken = async (id: string): Promise<void> => {
  console.log('getting new');
  try {
    const response = await axios.get(`${BASE_URL}/users/${id}/tokens`);
    const newToken = response.data;
    saveToken(JSON.stringify(newToken));
    saveExpDate(Date.now());
    console.log(newToken);
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    console.log(err.config);
  }
};

export const updateUser = async (
  id: string,
  user: Pick<User, 'email' | 'password'>,
): Promise<void> => {
  try {
    const response = await axios.put(`${BASE_URL}/users/${id}`, user);
    if (response.status === 200) {
      console.log(`user with id ${id} updated`);
    }
    const updatedUser = response.data;
    console.log(updatedUser);
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    console.log(err.config);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/${id}`);
    if (response.status === 204) {
      console.log(`user with id ${id} deleted`);
    }
  } catch (error: unknown) {
    const err = error as AxiosError;
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log('Error', err.message);
    }
    console.log(err.config);
  }
};

/* ------------- ADD JWT TO HEADERS ------------- */

axios.interceptors.request.use(async (config) => {
  let tokenData = null;
  if (localStorage.getItem('tokenData')) {
    tokenData = JSON.parse(localStorage.getItem('tokenData') || '');
  }
  console.log(tokenData);
  if (tokenData) {
    const tokenDataParsed = JSON.parse(tokenData);
    const { token, userId } = tokenDataParsed;
    const expDate = JSON.parse(localStorage.getItem('exp') || '');
    if (Date.now() >= expDate) {
      getNewToken(userId);
    }
    if (config.headers) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log(`${config.method} is sent`);
  console.log(config);
  return config;
});

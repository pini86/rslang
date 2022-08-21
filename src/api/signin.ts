import axios, { AxiosError } from 'axios';
import { IUser } from '../interfaces/interfaces';
import {
  saveExpDate,
  saveToken,
} from '../components/authorization/saveToStorage';

const BASE_URL = 'https://rs-lang-rsschool-task.herokuapp.com';

async function signIn(user: Pick<IUser, 'email' | 'password'>): Promise<void> {
  try {
    const response = await axios.post(`${BASE_URL}/signin`, user);
    const content = response.data;
    console.log('signed in');
    if (response.status === 200) {
      const tokenData = response.data;
      saveToken(JSON.stringify(tokenData));
      saveExpDate(Date.now());
    }
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
}

export default signIn;

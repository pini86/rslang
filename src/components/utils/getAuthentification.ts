/* eslint-disable import/no-cycle */
import { IUserTokens } from '../../interfaces/interfaces';
import Controller from '../controller/controller';

export default function getAuthentification(): IUserTokens | null {
  if (Controller.isLoggedIn) {
    return JSON.parse(localStorage.getItem('tokenData') as string);
  }
  return null;
}

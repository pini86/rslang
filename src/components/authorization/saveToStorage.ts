import { IUserTokens } from '../../interfaces/interfaces';

export default function saveToken(token: IUserTokens): void {
  localStorage.setItem('tokenData', JSON.stringify(token));
}

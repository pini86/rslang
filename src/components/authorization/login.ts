import { IUser } from '../../interfaces/interfaces';
import api from '../../api/api';
import saveToken from './saveToStorage';
import { showUserLoggedMode } from './userLoggedMode';
import Main from '../../pages/main/main';

type LoginFields = Pick<IUser, 'email' | 'password'>;

const getLoginFields = (): LoginFields => ({
  email: (document.querySelector('#email-log') as HTMLInputElement).value,
  password: (document.querySelector('#password-log') as HTMLInputElement).value,
});

export default function activateLogin() {
  const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
    loginBtn.addEventListener('click', async () => {
      const loginFields: LoginFields = getLoginFields();

      await api.signIn(loginFields.email, loginFields.password).then((tokenData) => {
        saveToken(tokenData);
        showUserLoggedMode(tokenData.name);
        const view = new Main();
      });
    });
}

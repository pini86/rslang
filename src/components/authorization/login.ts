import { IUser } from '../../interfaces/interfaces';
import api from '../../api/api';
import saveToken from './saveToStorage';
import { showUserLoggedMode } from './userLoggedMode';
import Main from '../../pages/main/main';
// eslint-disable-next-line import/no-cycle
import Controller from '../controller/controller';

type LoginFields = Pick<IUser, 'email' | 'password'>;

const getLoginFields = (emailInput: HTMLInputElement, passwordInput: HTMLInputElement): LoginFields => ({
  email: emailInput.value,
  password: passwordInput.value,
});

export default function activateLogin() {
  const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    const emailInput = document.querySelector('#email-log') as HTMLInputElement;
    const passwordInput = (document.querySelector('#password-log') as HTMLInputElement);
    if (emailInput.checkValidity() && passwordInput.checkValidity()) {
      const loginFields: LoginFields = getLoginFields(emailInput, passwordInput);
      await api.signIn(loginFields.email, loginFields.password).then((tokenData) => {
        saveToken(tokenData);
        showUserLoggedMode(tokenData.name);
        const view = new Main();
        Controller.isLoggedIn = true;
      });
    }
  });
}

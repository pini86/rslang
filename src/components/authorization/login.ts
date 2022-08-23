import { IUser } from '../../interfaces/interfaces';
import { hideAuthModal } from '../contentLoaded/materialize';
import api from '../../api/api';
import saveToken from './saveToStorage';
import { showUserLoggedMode } from './userLoggedMode';

type LoginFields = Pick<IUser, 'email' | 'password'>;

class Login {
  form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.signOnSubmit();
  }

  static getLoginFields = (): LoginFields => ({
    email: (document.querySelector('#email-log') as HTMLInputElement).value,
    password: (document.querySelector('#password-log') as HTMLInputElement).value,
  });

  signOnSubmit(): void {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const loginFields: LoginFields = Login.getLoginFields();

      await api.signIn(loginFields.email, loginFields.password).then((tokenData) => {
        saveToken(tokenData);
        showUserLoggedMode(tokenData.name);
        hideAuthModal();
      });
    });
  }
}
export default Login;

import { IUser } from '../../interfaces/interfaces';
import { hideAuthModal } from '../contentLoaded/materialize';
import api from '../../api/api';
import { saveToken } from './saveToStorage';

type LoginFields = Pick<IUser, 'email'| 'password'>;

class Login {
  form: HTMLFormElement;

  fields: string[];

  constructor(form: HTMLFormElement, fields: string[]) {
    this.form = form;
    this.fields = fields;
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
        saveToken(JSON.stringify(tokenData));
        hideAuthModal();
      });
    });
  }
}
export default Login;

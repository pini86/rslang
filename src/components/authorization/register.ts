import { IUser } from '../../interfaces/interfaces';
import api from '../../api/api';
import saveToken from './saveToStorage';
import { showUserLoggedMode } from './userLoggedMode';

type RegisterFields = IUser;

class Register {
  form: HTMLFormElement;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.signOnSubmit();
  }

  static getRegisterFields = (): RegisterFields => ({
    name: (document.querySelector('#name-reg') as HTMLInputElement).value,
    email: (document.querySelector('#email-reg') as HTMLInputElement).value,
    password: (document.querySelector('#password-reg') as HTMLInputElement).value,
  });

  signOnSubmit(): void {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const registerFields: RegisterFields = Register.getRegisterFields();
      const { email, password } = registerFields;

      await api.createNewUser(registerFields).then(() => {
        api.signIn(email, password).then((tokenData) => {
          saveToken(tokenData);
          showUserLoggedMode(tokenData.name);
        });
      });
    });
  }
}
export default Register;

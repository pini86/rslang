import { createUser } from '../../api/users';
import { hideAuthModal } from '../contentLoaded/materialize';
import { IUser } from '../../interfaces/interfaces';
import api from '../../api/api';
import { saveToken } from './saveToStorage';

type RegisterFields = IUser;

class Register {
  form: HTMLFormElement;

  fields: string[];

  constructor(form: HTMLFormElement, fields: string[]) {
    this.form = form;
    this.fields = fields;
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
      const {email, password} = registerFields;
      
    await createUser(registerFields).then(() => {
      api.signIn( email, password ).then((tokenData) => {
        saveToken(JSON.stringify(tokenData));
        hideAuthModal();
      });
    });
  });
}
}
export default Register;

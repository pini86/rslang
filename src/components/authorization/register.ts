import signIn from '../../api/signin';
import { createUser } from '../../api/users';
import { hideAuthModal } from '../contentLoaded/materialize';
import { IUser } from '../../interfaces/interfaces';

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
      signIn({ email, password }).then(() => {
        hideAuthModal();
      });
    });
  });
}
}
export default Register;

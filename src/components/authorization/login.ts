import signIn from '../../api/signin';
import { IUser } from '../../interfaces/interfaces';
import { hideAuthModal } from '../contentLoaded/materialize';

class Login {
  form: HTMLFormElement;

  fields: string[];

  constructor(form: HTMLFormElement, fields: string[]) {
    this.form = form;
    this.fields = fields;
    this.signOnSubmit();
  }

  signOnSubmit(): void {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputValues: [string, string][] = [];

      this.fields.forEach((field) => {
        const input = document.querySelector(`#${field}`) as HTMLInputElement;
        const fieldName = field.slice(0, -4);
        inputValues.push([fieldName, input.value]);
      });

      const user: Pick<IUser, 'email' | 'password'> = inputValues.reduce(
        (a, v) => ({ ...a, [v[0]]: v[1] }),
        { password: '', email: '' }
      );
      const { email, password } = user;

      await signIn({ email, password }).then(() => {
        hideAuthModal();
      });
    });
  }
}
export default Login;

import { IUser } from '../../interfaces/interfaces';
import api from '../../api/api';
import saveToken from './saveToStorage';
import { showUserLoggedMode } from './userLoggedMode';
import Main from '../../pages/main/main';

type RegisterFields = IUser;

const getRegisterFields = (): RegisterFields => ({
  name: (document.querySelector('#name-reg') as HTMLInputElement).value,
  email: (document.querySelector('#email-reg') as HTMLInputElement).value,
  password: (document.querySelector('#password-reg') as HTMLInputElement).value,
});

export default function activateRegister() {
  const registerBtn = document.querySelector('.register-btn') as HTMLButtonElement;

  registerBtn.addEventListener('click', async () => {
    const registerFields: RegisterFields = getRegisterFields();
    const { email, password } = registerFields;

    await api.createNewUser(registerFields).then(() => {
      api.signIn(email, password).then((tokenData) => {
        saveToken(tokenData);
        showUserLoggedMode(tokenData.name);
        const view = new Main();
      });
    });
  });
}

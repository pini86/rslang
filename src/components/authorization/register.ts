import { IUser } from '../../interfaces/interfaces';
import api from '../../api/api';
import saveToken from './saveToStorage';
import { showUserLoggedMode } from './userLoggedMode';
import Main from '../../pages/main/main';
import Controller, { EPages } from '../controller/controller';

type RegisterFields = IUser;

const getRegisterFields = (
  nameInput: HTMLInputElement,
  emailInput: HTMLInputElement,
  passwordInput: HTMLInputElement
): RegisterFields => ({
  name: nameInput.value,
  email: emailInput.value,
  password: passwordInput.value,
});

export default function activateRegister() {
  const registerBtn = document.querySelector('.register-btn') as HTMLButtonElement;

  registerBtn.addEventListener('click', async () => {
    const emailInput = document.querySelector('#email-reg') as HTMLInputElement;
    const passwordInput = document.querySelector('#password-reg') as HTMLInputElement;
    const nameInput = document.querySelector('#name-reg') as HTMLInputElement;
    if (emailInput.checkValidity() && passwordInput.checkValidity() && nameInput.checkValidity()) {
      const registerFields: RegisterFields = getRegisterFields(
        nameInput,
        emailInput,
        passwordInput
      );
      const { email, password } = registerFields;

      await api.createNewUser(registerFields).then(() => {
        api.signIn(email, password).then((tokenData) => {
          saveToken(tokenData);
          showUserLoggedMode(tokenData.name);
          const view = new Main();
          const mainBtn = document.getElementById('main') as HTMLElement;

          Controller.isLoggedIn = true;
          Controller.setActiveMenuItem(mainBtn);
          Controller.currentPage = EPages.main;
          Controller.setSessionStorage();
        });
      });
    }
  });
}
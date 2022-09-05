/* eslint-disable import/no-cycle */
import activateLogin from '../authorization/login';
import activateRegister from '../authorization/register';
import { hideUserLoggedMode } from '../authorization/userLoggedMode';
import Controller from '../controller/controller';
import Main from '../../pages/main/main';

export function activateAuthentification(): void {
  const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
  if (loginBtn) {
    activateLogin();
  }

  const registerBtn = document.querySelector('.register-btn') as HTMLButtonElement;
  if (registerBtn) {
    activateRegister();
  }
}
export function activateLogOut(): void {
  const logout = document.querySelector('.authorization__logout') as HTMLElement;
  logout.addEventListener('click', (event) => {
    localStorage.removeItem('tokenData');
    event.stopPropagation();
    hideUserLoggedMode();
    Controller.isLoggedIn = false;

    const mainBtn = document.getElementById('main') as HTMLElement;
    const eventClick = new Event('click');
    mainBtn.dispatchEvent(eventClick);
  });
}

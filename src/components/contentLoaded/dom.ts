import api from '../../api/api';
import Login from '../authorization/login';
import Register from '../authorization/register';
import { hideUserName } from '../authorization/userName';
import { hideAuthModal } from './materialize';

const authHeaderReg = document.querySelector('.auth-header-reg') as HTMLElement;
const authHeaderLog = document.querySelector('.auth-header-log') as HTMLElement;

export function activateHeaders(): void {
  const authHeadersDiv = document.querySelector('.auth-headers') as HTMLDivElement;
  authHeadersDiv.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('auth-header-reg')) {
      target.classList.add('active');
      authHeaderLog.classList.remove('active');
    } else if (target.classList.contains('auth-header-log')) {
      target.classList.add('active');
      authHeaderReg.classList.remove('active');
    }
  });
}

export function activateForms(): void {
  const registerForm = document.querySelector('.register-form') as HTMLFormElement;
  if (registerForm) {
    const auth = new Register(registerForm);
  }

  const loginForm = document.querySelector('.login-form') as HTMLFormElement;
  if (loginForm) {
    const auth = new Login(loginForm);
  }
}

export function activateLogOut(): void {
  const logout = document.querySelector('.authorization__logout') as HTMLElement;
  logout.addEventListener('click', (event) => {
    localStorage.clear();
    event.stopPropagation();
    hideUserName();
  });
}

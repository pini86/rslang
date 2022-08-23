import api from '../../api/api';
import Login from '../authorization/login';
import Register from '../authorization/register';

export function activateHeaders(): void {
  const authHeadersDiv = document.querySelector('.auth-headers') as HTMLDivElement;
  const authHeaders = document.querySelectorAll('.auth-header') as NodeListOf<HTMLElement>;

  authHeadersDiv.addEventListener('click', () => {
    authHeaders.forEach((header) => {
      header.classList.toggle('active');
    });
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
  logout.addEventListener('click', () => {
    localStorage.clear();
  });
}

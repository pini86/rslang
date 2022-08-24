import Login from '../authorization/login';
import Register from '../authorization/register';
import { hideUserLoggedMode } from '../authorization/userLoggedMode';

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
    hideUserLoggedMode();
  });
}

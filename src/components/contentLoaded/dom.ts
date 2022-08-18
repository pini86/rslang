import Login from '../authorization/login';
import Register from '../authorization/register';

export function activateHeaders(): void {
  const authHeadersDiv = document.querySelector(
    '.auth-headers',
  ) as HTMLDivElement;
  const authHeaders = document.querySelectorAll(
    '.auth-header',
  ) as NodeListOf<HTMLElement>;

  authHeadersDiv.addEventListener('click', () => {
    authHeaders.forEach((header) => {
      header.classList.toggle('active');
    });
  });
}

export function activateForms(): void {
  const registerForm = document.querySelector(
    '.register-form',
  ) as HTMLFormElement;
  if (registerForm) {
    const fields = ['name-reg', 'email-reg', 'password-reg'];
    const auth = new Register(registerForm, fields);
  }

  const loginForm = document.querySelector('.login-form') as HTMLFormElement;
  if (loginForm) {
    const fields = ['email-log', 'password-log'];
    const auth = new Login(loginForm, fields);
  }
}

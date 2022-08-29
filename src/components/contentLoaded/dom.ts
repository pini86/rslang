import activateLogin from '../authorization/login';
import activateRegister from '../authorization/register';
import { hideUserLoggedMode } from '../authorization/userLoggedMode';


export function activateAuthentification(): void {
  const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
  if (loginBtn) {
   activateLogin();
  }

  const registerBtn = document.querySelector('.register-btn') as HTMLButtonElement;
  if(registerBtn){
    activateRegister();
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

import Main from '../../pages/main/main';

export function showUserLoggedMode(name: string): void {
  const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
  const logout = document.querySelector('.authorization__logout') as HTMLElement;
  greetText.innerHTML = name;
  logout.style.display = 'inline';
  const view = new Main();
  const authBtn = document.querySelector('#authorization') as HTMLButtonElement;
  authBtn.disabled = true;
}
export function hideUserLoggedMode(): void {
  const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
  const logout = document.querySelector('.authorization__logout') as HTMLElement;
  greetText.innerHTML = 'Войти';
  logout.style.display = 'none';
  const view = new Main();
  const authBtn = document.querySelector('#authorization') as HTMLButtonElement;
  authBtn.disabled = false;
}

const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
const logout = document.querySelector('.authorization__logout') as HTMLElement;
const auth = document.querySelector('#authorization') as HTMLAnchorElement;
export function showUserLoggedMode(name: string): void {
  greetText.innerHTML = name;
  logout.style.display = 'inline';
  auth.href = '#';
  auth.classList.remove('waves-effect', 'waves-light');
}
export function hideUserLoggedMode(): void {
  greetText.innerHTML = 'Войти';
  logout.style.display = 'none';
  auth.href = '#modalAuth';
  auth.classList.add('waves-effect', 'waves-light');
}

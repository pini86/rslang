const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
const logout = document.querySelector('.authorization__logout') as HTMLElement;

export function showUserName(name: string): void {
  greetText.innerHTML = name;
  logout.style.display = 'inline';
}
export function hideUserName(): void {
  greetText.innerHTML = 'Войти';
  logout.style.display = 'none';
}

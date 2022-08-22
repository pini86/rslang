export function showUserName(name: string): void {
  const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
  greetText.innerHTML = name;
}
export function hideUserName(): void {
  const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
  greetText.innerHTML = 'Войти';
}

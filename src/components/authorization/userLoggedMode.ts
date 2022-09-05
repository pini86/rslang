import Main from "../../pages/main/main";
import Controller, { EPages } from "../controller/controller";

export function showUserLoggedMode(name: string): void {
  const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
  const logout = document.querySelector('.authorization__logout') as HTMLElement;
  greetText.innerHTML = name;
  logout.style.display = 'inline';
  const authBtn = document.querySelector('#authorization') as HTMLButtonElement;
  authBtn.disabled = true;
}
export function hideUserLoggedMode(): void {
  const greetText = document.querySelector('.authorization__greet') as HTMLSpanElement;
  const logout = document.querySelector('.authorization__logout') as HTMLElement;
  greetText.innerHTML = 'Войти';
  logout.style.display = 'none';
  const authBtn = document.querySelector('#authorization') as HTMLButtonElement;
  authBtn.disabled = false;
  const mainBtn = document.getElementById('main') as HTMLElement;
  Controller.currentPage = EPages.main;
  Controller.setActiveMenuItem(mainBtn);
  const view = new Main();
}

export function showUserAuthentification() {
  let tokenData;
  if (localStorage.getItem('tokenData')) {
    tokenData = JSON.parse(localStorage.getItem('tokenData') || '');
    Controller.isLoggedIn = true;
  }
  if (tokenData) {
    const { name } = tokenData;
    showUserLoggedMode(name);
  }
}
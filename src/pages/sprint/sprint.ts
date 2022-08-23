export default class Sprint{
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = 'This is Sprint page !!!';
  }
}
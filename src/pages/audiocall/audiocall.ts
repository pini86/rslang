export default class Audiocall {
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = 'This is Audiocall page !!!';
  }
}

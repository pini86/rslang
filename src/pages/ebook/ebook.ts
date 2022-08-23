export default class Ebook{
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = 'This is ElectronBook page !!!';
  }
}
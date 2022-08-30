export default class StartFromEbookMode {
  gameContent!: HTMLElement;

  constructor() {
    this.gameContent = document.querySelector('main div.container') as HTMLElement;
    this.gameContent.innerHTML = `<div class="audiocall"><div class="audiocall__wrapper">
    <h5 class="audiocall__start-header">Игра начнется со словами из выбранной страницы словаря</h5>
    <button class="audiocall__start-btn waves-effect waves-light btn">начать</button>
  </div>
  </div>`;
  }
}
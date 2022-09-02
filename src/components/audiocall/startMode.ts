export default class StartMode {
  gameContent!: HTMLElement;

  constructor() {
    this.gameContent = document.querySelector('main div.container') as HTMLElement;
    this.gameContent.innerHTML = `<div class="audiocall"><div class="audiocall__wrapper">
    <h5 class="audiocall__start-header">Выбери уровень, чтобы начать игру</h5>
  
    <div class="audiocall__levels">
      <button class="audiocall__level waves-light waves-effect yellow active">A1</button>
      <button class="audiocall__level waves-light waves-effect red darken-1">A2</button>
      <button class="audiocall__level waves-light waves-effect pink lighten-3">B1</button>
      <button class="audiocall__level waves-light waves-effect cyan darken">B2</button>
      <button class="audiocall__level waves-light waves-effect light-green accent-1">C1</button>
      <button class="audiocall__level waves-light waves-effect indigo darken-3">C2</button>
    </div>
    <button class="audiocall__start-btn waves-effect waves-light btn">начать</button>
    <p class="audiocall__start-header">Используй мышку или клавиши 1-5 и пробел</p>
  </div>
  </div>`;
  }
}

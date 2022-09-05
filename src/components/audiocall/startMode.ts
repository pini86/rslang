export default class StartMode {
  gameContent!: HTMLElement;

  constructor() {
    this.gameContent = document.querySelector('main div.container') as HTMLElement;
    this.gameContent.innerHTML = `<div class="audiocall"><div class="audiocall__wrapper">
    <h5 class="audiocall__start-header">Выбери уровень, чтобы начать игру</h5>

    <ul class="collection audiocall__levels">
      <li class="collection-item">
        <button class="audiocall__level btn green lighten-1 active">A1</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn light-green darken-3">A2</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn cyan darken-1">B1</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn teal darken-2">B2</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn orange">C1</button>
      </li>
      <li class="collection-item">
      <button class="audiocall__level btn pink lighten-3">C2</button>
      </li>
    </ul>
    <button class="audiocall__start-btn waves-effect waves-light btn">начать</button>
    <p class="audiocall__start-header">Используй мышку или клавиши 1-5 и пробел</p>
  </div>
  </div>`;
  }
}
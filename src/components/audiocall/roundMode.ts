export default class RoundMode{
  gameContent!: HTMLElement;

  constructor() {
    this.gameContent = document.querySelector('main div.container') as HTMLElement;
    this.gameContent.innerHTML = `<div class="audiocall"><div class="audiocall__wrapper">
    <img class="audiocall__word-image" src="" alt="Word picture"></img>
    <button class="audiocall__play-btn">
      <i class="material-icons play-btn__icon">volume_up</i>
      <span class="audiocall__play-word">agree</span>
    </button>
    <div class="audiocall__words"></div>
    <button class="audiocall__continue-btn waves-effect waves-light btn">продолжить</button>
    </div>
  </div>`;
  }
}
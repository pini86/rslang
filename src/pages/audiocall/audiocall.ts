// eslint-disable-next-line import/no-cycle
import AudioCall from "../../components/audiocall/audiocall";

export default class Audiocall {
  mainContent!: HTMLElement;

  audiocall!: AudioCall;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = `<div class="audiocall"><div class="audiocall__wrapper">
    <button class="audiocall__play-btn">
      <i class="large material-icons play-btn__icon">volume_up</i>
    </button>
    <div class="audiocall__words"></div>
    </div>
  </div>`;
  this.audiocall = new AudioCall();
  this.audiocall.initGame();
  }
}

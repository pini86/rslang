/* eslint-disable import/no-cycle */
import { IWord } from '../../interfaces/interfaces';
import { activateNextAudiocallBtn, activatePlayAudioBtns } from './audiocallUtils';

export default class ResultsMode {
  gameContent!: HTMLElement;

  constructor() {
    this.gameContent = document.querySelector('main div.container') as HTMLElement;
    this.gameContent.innerHTML = `<div class="audiocall">
    <div class="audiocall__wrapper">
    <div class="audiocall__results">
      <h5 class="audiocall__start-header">Результаты игры</h5>
      <div class="audiocall__word-list">
        <div class="word-list__wrong">
          <p class="word-list__title">Ошибок<span class="word-counter wrong-counter">3</span></p>
        </div>
        <div class="word-list__correct">
          <p class="word-list__title">Знаю<span class="word-counter correct-counter">5</span></p>
        </div>
      </div>
  </div>
  <div class="audiocall__next ">
  <button class="next__play waves-effect waves-light btn">Сыграть еще</button>
  </div>
  </div>
</div>`;
  }

  static showResults(wrongWords: IWord[], correctWords: IWord[], gameWords: IWord[]) {
    const correctCount = document.querySelector('.correct-counter') as HTMLElement;
    correctCount.innerHTML = correctWords.length.toString();
    const correctWordsList = document.querySelector('.word-list__correct') as HTMLElement;
    correctWords.forEach((word: IWord) => {
      correctWordsList.innerHTML += `<div class="word-item">
      <span class="word-item__sound">
      <i class="material-icons icon-green">volume_up</i>
      </span>
      <span class="word-item__word">${word.word}</span>
      <span> — </span>
      <span class="word-item__translate">${word.wordTranslate}</span>
    </div>`;
    });

    const wrongCount = document.querySelector('.wrong-counter') as HTMLElement;
    wrongCount.innerHTML = wrongWords.length.toString();
    const wrongWordsList = document.querySelector('.word-list__wrong') as HTMLElement;
    wrongWords.forEach((word: IWord) => {
      wrongWordsList.innerHTML += `<div class="word-item">
      <span class="word-item__sound icon-blue">
      <i class="material-icons">volume_up</i>
      </span>
      <span class="word-item__word">${word.word}</span>
      <span> — </span>
      <span class="word-item__translate">${word.wordTranslate}</span>
    </div>`;
    });
    activateNextAudiocallBtn();
    activatePlayAudioBtns(gameWords);
  }
}

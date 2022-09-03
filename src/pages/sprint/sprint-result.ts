/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import { IWord, IUserTokens, IWordData, ISprintResult } from '../../interfaces/interfaces';
import api from '../../api/api';
import Sprint from './sprint';
import getAuthentification from '../../components/utils/getAuthentification';
import Controller from '../../components/controller/controller';

export default class SprintResult {
  start: void | Sprint;

  mainContent!: HTMLElement;

  sprintResult: ISprintResult;

  authObj: IUserTokens | null;

  constructor(sprintResult: ISprintResult) {
    this.sprintResult = sprintResult;
    this.authObj = getAuthentification();
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = SprintResult.getHTML();
    this.start = this.showStatWords();
  }

  private static getHTML(): string {
    return `
  <div class="sprint__statistics">
   <div class="sprint__statistics__short" id="sprint-stat-short">
   <p class="sprint__statistics__title">Ваш результат в игре Спринт</[]>
   <div class="sprint__statistics__circle">
     <div class="sprint__statistics__wave"></div>
     <div class="sprint__statistics__percent"></div>
   </div>
   <div class="sprint__statistics__result">
     <div class="sprint__statistics__score" id="sprint-score-stat"></div>
     <div class="sprint__statistics__correct" id="sprint-correct-stat"></div>
     <div class="sprint__statistics__streak" id="sprint-streak-stat"></div>
     <p>  </p>
     <div class="sprint__statistics__incorrect" id="sprint-incorrect-stat"></div>
   </div>
   <div class="sprint__statistics__buttons">
    <button class="sprint__statistics__button" id="sprint-details-button">Детали</button>
    <button class="sprint__statistics__button" id="sprint-repeat-button">Играть снова</button>
   </div> 
   </div>
   <div class="sprint__statistics__full hidden" id="sprint-stat-full">
    <div class="sprint__statistics__result__words" id="sprint-result-stat">
  </div>
    <div class="sprint__statistics__return__button" id="sprint-return-button">Назад</div>
   </div>
  </div>
  `;
  }

  private showStatWords(): void {
    const streakSection = document.getElementById('sprint-streak-stat') as HTMLElement;
    const scoreSection = document.getElementById('sprint-score-stat') as HTMLElement;
    const rightSection = document.getElementById('sprint-correct-stat') as HTMLElement;
    const wrongSection = document.getElementById('sprint-incorrect-stat') as HTMLElement;

    document.onkeyup = null;
    if (Controller.isLoggedIn) {
      this.changeStatistics();
    }

    streakSection.innerHTML = `Максимальное количество верных ответов подряд: ${this.sprintResult.sprintStatData.maxStreak.toString()}`;
    scoreSection.innerHTML = `Общий счет за игру: ${this.sprintResult.sprintScore}`;
    rightSection.innerHTML = `Правильных ответов: ${this.sprintResult.sprintStatData.correctWords.length}`;
    wrongSection.innerHTML = `Ошибок: ${this.sprintResult.sprintStatData.incorrectWords.length}`;
    this.rotateWave();
    SprintResult.showWords(this.sprintResult.sprintStatData.correctWords, true);
    SprintResult.showWords(this.sprintResult.sprintStatData.incorrectWords, false);
    this.setAudioListeners();
    this.setRepeatBtnListener();
  }

  private rotateWave(): void {
    const wave = document.querySelector('.sprint__statistics__wave') as HTMLElement;
    const waveNumber = document.querySelector('.sprint__statistics__percent') as HTMLElement;
    const lengthOfWords =
      this.sprintResult.sprintStatData.correctWords.length +
      this.sprintResult.sprintStatData.incorrectWords.length;
    const percentOfCorrectAnswers =
      Math.floor((this.sprintResult.sprintStatData.correctWords.length * 100) / lengthOfWords) || 0;

    waveNumber.innerHTML = `${percentOfCorrectAnswers}%`;
    wave.animate([{ top: '100%' }, { top: `${100 - percentOfCorrectAnswers}%` }], {
      duration: 2000,
      fill: 'forwards',
    });
  }

  private async changeStatistics(): Promise<void> {
    let statistic = await api.getStatistics();

    if (!statistic) {
      statistic = {
        learnedWords: this.sprintResult.sprintStatData.learnedWords,
        optional: {
          audiocall: {
            correctWords: 0,
            incorrectWords: 0,
            streak: 0,
            newWords: +0,
          },
          sprint: {
            correctWords: this.sprintResult.sprintStatData.correctWords.length,
            incorrectWords: this.sprintResult.sprintStatData.incorrectWords.length,
            streak: this.sprintResult.sprintStatData.maxStreak,
            newWords: this.sprintResult.sprintNewWords,
          },
        },
      };
    } else {
      delete statistic.id;
      statistic.learnedWords += this.sprintResult.sprintStatData.learnedWords;
      statistic.optional.sprint.correctWords +=
        this.sprintResult.sprintStatData.correctWords.length;
      statistic.optional.sprint.incorrectWords +=
        this.sprintResult.sprintStatData.incorrectWords.length;
      if (statistic.optional.sprint.streak < this.sprintResult.sprintStatData.maxStreak) {
        statistic.optional.sprint.streak = this.sprintResult.sprintStatData.maxStreak;
      }
      statistic.optional.sprint.newWords += this.sprintResult.sprintNewWords;
    }
    api.upsertStatistics(statistic);
  }

  private static showWords(arrayWords: IWord[], valid: boolean): void {
    if (arrayWords.length === 0) return;
    const wordsSection = document.getElementById('sprint-result-stat') as HTMLElement;

    wordsSection.innerHTML += valid ? '<h2>Правильные ответы</h2>' : '<h2>Неправильные ответы</h2>';
    arrayWords.forEach((elem) => {
      wordsSection.innerHTML += `<div class="sprint__statistics__words">
        <button class="sprint__statistics__audio" id="${
          !Controller.isLoggedIn ? (elem as IWordData).id : (elem as IWord)._id
        }"></button>
        <div class="property_word">${elem.word}</div>
        <div class="property_word_tr">${elem.transcription}</div>
        <div class="property_word_lang">${elem.wordTranslate}</div>
        <div id="check-answer" class="check__answer ${valid ? `valid` : `novalid`}"> 
        </div>`;
    });
  }

  private setAudioListeners(): void {
    const answerAudioBtn = document.querySelectorAll('.sprint__statistics__audio');
    const resultArrayWords = [
      ...this.sprintResult.sprintStatData.correctWords,
      ...this.sprintResult.sprintStatData.incorrectWords,
    ];
    answerAudioBtn.forEach((elem) => {
      const audio = new Audio();
      audio.src = `${api.baseUrl}/${
        (
          resultArrayWords.find((el) => el._id === elem.id || el.id === elem.id) as
            | IWordData
            | IWord
        ).audio
      }`;
      elem.addEventListener('click', () => {
        audio.play();
      });
    });
  }

  private setRepeatBtnListener(): void {
    const repeatBtn = document.getElementById('sprint-repeat-button') as HTMLElement;
    const detailsBtn = document.getElementById('sprint-details-button') as HTMLElement;
    const returnBtn = document.getElementById('sprint-return-button') as HTMLElement;
    const shortStat = document.getElementById('sprint-stat-short') as HTMLElement;
    const fullStat = document.getElementById('sprint-stat-full') as HTMLElement;

    repeatBtn.addEventListener('click', () => {
      this.start = new Sprint();
    });

    detailsBtn.addEventListener('click', () => {
      shortStat.classList.add('hidden');
      fullStat.classList.remove('hidden');
    });

    returnBtn.addEventListener('click', () => {
      fullStat.classList.add('hidden');
      shortStat.classList.remove('hidden');
    });
  }
}

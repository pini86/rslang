/* eslint-disable import/no-cycle */
import api from '../../api/api';
import { IWord } from '../../interfaces/interfaces';
import {
  colorIncorrectElement,
  displayWords,
  getRandomArrElem,
  getRandomNumber,
  getUserSelectedLevel,
  showGameStyles,
  playAudio,
  shuffleArray,
  pauseAudio,
} from './audiocallUtils';
import ResultsMode from './resultsMode';
import RoundMode from './roundMode';
import StartMode from './startMode';

export default class AudioCall {
  private currentView = new StartMode();

  private gameWords: IWord[] = [];

  private mainWordId!: string;

  private mainWordTranslate!: string;

  private round = 0;

  private wordsInRound: IWord[] = [];

  private correctWords: IWord[] = [];

  private wrongWords: IWord[] = [];

  static isAudioPlaying = false;

  static audio: HTMLAudioElement;

  initGame(): void {
    this.currentView = new StartMode();
    const selectedLevel = getUserSelectedLevel();
    const startAudiocallBtn = document.querySelector('.audiocall__start-btn') as HTMLButtonElement;

    startAudiocallBtn.addEventListener('click', () => {
      api.getWords(selectedLevel, getRandomNumber(0, 30)).then((words) => {
        this.gameWords = [...words];
        shuffleArray(this.gameWords);
        this.currentView = new RoundMode();
        this.playRound();
      });
    });
  }

  async playRound(): Promise<void> {
    this.currentView = new RoundMode();
    this.wordsInRound = [];

    const mainWord = this.gameWords[this.round];
    const image = document.querySelector('.audiocall__word-image') as HTMLImageElement;
    image.src = `https://react-learnwords-example.herokuapp.com/${mainWord.image}`;

    this.mainWordId = mainWord.id;
    this.mainWordTranslate = mainWord.wordTranslate;
    this.wordsInRound.push(mainWord);

    for (let i = 0; this.wordsInRound.length < 5; i++) {
      const randomWord: IWord = getRandomArrElem(this.gameWords);
      if (randomWord.id !== this.mainWordId && this.wordsInRound.indexOf(randomWord) < 0) {
        this.wordsInRound.push(randomWord);
      }
    }
    shuffleArray(this.wordsInRound);
    displayWords(this.wordsInRound);

    const audioUrl = `https://react-learnwords-example.herokuapp.com/${mainWord.audio}`;
    AudioCall.audio = new Audio(audioUrl);
    playAudio();
    const playBtn = document.querySelector('.audiocall__play-btn') as HTMLElement;
    playBtn.addEventListener('click', () => {
      playAudio();
    });

    const wrongAudio = new Audio('../../assets/sounds/bad.mp3');
    const correctAudio = new Audio('../../assets/sounds/good.mp3');


    const wordsContainer = document.querySelector('.audiocall__words') as HTMLElement;

    const wordsMouseListener = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      image.style.display = 'block';
      if (
        target.classList.contains('audiocall__word') ||
        (target.parentNode as HTMLElement).classList.contains('audiocall__word')
      ) {
        showGameStyles(mainWord);

        const selectedWord = (
          (target.closest('.word__text') as HTMLSpanElement) ||
          (target.querySelector('.word__text') as HTMLSpanElement) ||
          (target as HTMLSpanElement)
        ).innerText;

        if (selectedWord.toLowerCase() !== this.mainWordTranslate.toLowerCase()) {
          colorIncorrectElement(target.closest('.audiocall__word') as HTMLElement);
          this.wrongWords.push(mainWord);
          wrongAudio.play();
        } else {
          this.correctWords.push(mainWord);
          correctAudio.play();
        }

        wordsContainer.removeEventListener('click', wordsMouseListener);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        document.removeEventListener('keydown', wordsKeyboardListener);
        document.removeEventListener('keydown', this.keyboardListenerContinueBtn);
        this.activateContinueBtn();
      }
    };
    const wordsKeyboardListener = (event: KeyboardEvent): void => {
      const keys: string[] = ['1', '2', '3', '4', '5'];
      if (keys.includes(event.key)) {
        showGameStyles(mainWord);

        const numbers: HTMLElement[] = Array.from(
          document.querySelectorAll('.word__number') as NodeListOf<HTMLElement>
        );
        const number = numbers.find(
          (el: HTMLElement) => el.innerText === `${event.key}`
        ) as HTMLElement;
        const button = number.parentNode as HTMLElement;
        const selectedWord = (number.nextElementSibling as HTMLSpanElement).innerText;

        if (selectedWord.toLowerCase() !== this.mainWordTranslate.toLowerCase()) {
          colorIncorrectElement(button);
          this.wrongWords.push(mainWord);
          wrongAudio.play();
        } else {
          this.correctWords.push(mainWord);
          correctAudio.play();
        }
        document.removeEventListener('keydown', wordsKeyboardListener);
        this.activateContinueBtn();
      }
    };
    wordsContainer.addEventListener('click', wordsMouseListener);
    document.addEventListener('keydown', wordsKeyboardListener);
  }

  activateContinueBtn(): void {
    const continueBtn = document.querySelector('.audiocall__continue-btn') as HTMLElement;
    continueBtn.style.display = 'block';
    continueBtn.addEventListener('click', this.clickListenerContinueBtn);
    document.addEventListener('keydown', this.keyboardListenerContinueBtn);
  }

  clickListenerContinueBtn = () => {
    this.checkIfGameFinished();
    pauseAudio();
    const continueBtn = document.querySelector('.audiocall__continue-btn') as HTMLElement;
    continueBtn.removeEventListener('click', this.clickListenerContinueBtn);
  };

  keyboardListenerContinueBtn = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === ' ') {
      this.checkIfGameFinished();
      pauseAudio();
    }
    document.removeEventListener('keydown', this.keyboardListenerContinueBtn);
  };

  checkIfGameFinished = (): void => {
    if (this.round < this.gameWords.length - 1) {
      this.round += 1;
      this.playRound();
    } else {
      this.currentView = new ResultsMode();
      ResultsMode.showResults(this.wrongWords, this.correctWords, this.gameWords);
    }
  };
}

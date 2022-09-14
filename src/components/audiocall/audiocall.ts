/* eslint-disable no-underscore-dangle */
import api from '../../api/api';
import {
  IAudiocallResult,
  IUserTokens,
  IUserWord,
  IWord,
  IWordData,
} from '../../interfaces/interfaces';
import Controller from '../controller/controller';
import getAuthentification from '../utils/getAuthentification';
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
import StartFromEbookMode from './startFromEbookMode';
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

  private audiocall: IAudiocallResult;

  private authObj: IUserTokens | null;

  private streak = 0;

  private maxStreak = 0;

  static isAudioPlaying = false;

  static audio: HTMLAudioElement;

  constructor() {
    this.audiocall = {
      audiocallNewWords: 0,
      audiocallStatData: {
        correctWords: [],
        incorrectWords: [],
        learnedWords: 0,
        maxStreak: 0,
      },
    };
    this.authObj = getAuthentification();
  }

  initGame(wordsFromEbook?: IWord[]): void {
    // game launched from ebook
    if (wordsFromEbook) {
      this.currentView = new StartFromEbookMode();
      const startAudiocallBtn = document.querySelector(
        '.audiocall__start-btn'
      ) as HTMLButtonElement;

      startAudiocallBtn.addEventListener('click', () => {
        this.gameWords = [...wordsFromEbook];
        shuffleArray(this.gameWords);
        this.currentView = new RoundMode();
        this.playRound();
      });
    } else {
      // default launch
      this.currentView = new StartMode();
      const selectedLevel = getUserSelectedLevel();
      const startAudiocallBtn = document.querySelector(
        '.audiocall__start-btn'
      ) as HTMLButtonElement;

      startAudiocallBtn.addEventListener('click', () => {
        if (Controller.isLoggedIn) {
          api
            .getAllAggregatedUserWords(
              api.userId,
              selectedLevel.toString(),
              getRandomNumber(0, 30).toString()
            )
            .then((words) => {
              this.gameWords = [...words];
              shuffleArray(this.gameWords);
              this.currentView = new RoundMode();
              this.playRound();
            });
        } else {
          api.getWords(selectedLevel, getRandomNumber(0, 30)).then((words) => {
            this.gameWords = [...words];
            shuffleArray(this.gameWords);
            this.currentView = new RoundMode();
            this.playRound();
          });
        }
      });
    }
  }

  async playRound(): Promise<void> {
    this.currentView = new RoundMode();
    this.wordsInRound = [];

    const mainWord = this.gameWords[this.round];
    const image = document.querySelector('.audiocall__word-image') as HTMLImageElement;
    image.src = `${api.baseUrl}/${mainWord.image}`;

    this.mainWordId = mainWord.id || (mainWord._id as string);
    this.mainWordTranslate = mainWord.wordTranslate;
    this.wordsInRound.push(mainWord);

    for (let i = 0; this.wordsInRound.length < 5; i++) {
      const randomWord: IWord = getRandomArrElem(this.gameWords);
      if (
        randomWord.id !== this.mainWordId &&
        randomWord._id !== this.mainWordId &&
        this.wordsInRound.indexOf(randomWord) < 0
      ) {
        this.wordsInRound.push(randomWord);
      }
    }
    shuffleArray(this.wordsInRound);
    displayWords(this.wordsInRound);

    const audioUrl = `${api.baseUrl}/${mainWord.audio}`;
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
      if (
        target.classList.contains('audiocall__word') ||
        (target.parentNode as HTMLElement).classList.contains('audiocall__word')
      ) {
        image.style.display = 'block';
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
          this.streak = 0;
          if (Controller.isLoggedIn) {
            this.updateIncorrectUserWord(mainWord);
          }
        } else {
          this.correctWords.push(mainWord);
          correctAudio.play();
          this.streak += 1;
          if (Controller.isLoggedIn) {
            this.updateCorrectUserWord(mainWord);
          }
          if (this.streak > this.maxStreak) {
            this.maxStreak = this.streak;
          }
        }

        wordsContainer.removeEventListener('click', wordsMouseListener);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        document.removeEventListener('keydown', wordsKeyboardListener);
        this.activateContinueBtn();
      }
    };
    const wordsKeyboardListener = (event: KeyboardEvent): void => {
      const keys: string[] = ['1', '2', '3', '4', '5'];
      if (keys.includes(event.key)) {
        image.style.display = 'block';
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
          this.streak = 0;
          if (Controller.isLoggedIn) {
            this.updateIncorrectUserWord(mainWord);
          }
        } else {
          if (Controller.isLoggedIn) {
            this.updateCorrectUserWord(mainWord);
          }
          this.correctWords.push(mainWord);
          correctAudio.play();
          this.streak += 1;
          if (this.streak > this.maxStreak) {
            this.maxStreak = this.streak;
          }
        }
        document.removeEventListener('keydown', wordsKeyboardListener);
        wordsContainer.removeEventListener('click', wordsMouseListener);
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
    if (continueBtn) {
      continueBtn.removeEventListener('click', this.clickListenerContinueBtn);
    }
    document.removeEventListener('keydown', this.keyboardListenerContinueBtn);
  };

  keyboardListenerContinueBtn = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === ' ') {
      this.checkIfGameFinished();
      pauseAudio();
      document.removeEventListener('keydown', this.keyboardListenerContinueBtn);
    }
  };

  checkIfGameFinished = (): void => {
    if (this.round < this.gameWords.length - 1) {
      this.round += 1;
      this.playRound();
    } else {
      if (Controller.isLoggedIn) {
        AudioCall.changeStatistics(
          this.wrongWords,
          this.correctWords,
          this.gameWords,
          this.maxStreak
        );
      }
      this.currentView = new ResultsMode();
      ResultsMode.showResults(this.wrongWords, this.correctWords, this.gameWords);
    }
  };

  private updateCorrectUserWord(word: IWord | IWordData | undefined): void {
    if (!(word as IWord).userWord) {
      this.audiocall.audiocallNewWords++;
      const userWordData: IUserWord = {
        difficulty: 'normal',
        optional: {
          correctCount: 1,
          totalCorrectCount: 1,
          totalIncorrectCount: 0,
        },
      };
      api.createUserWord(
        (word as IWord)._id as string,
        userWordData,
        (this.authObj as IUserTokens).userId
      );
    } else {
      const userWordOptional = (word as IWord).userWord as IUserWord;
      if (
        Boolean((word as IWord).userWord?.optional.totalCorrectCount) === false &&
        Boolean((word as IWord).userWord?.optional.totalIncorrectCount) === false
      ) {
        this.audiocall.audiocallNewWords++;
        userWordOptional.optional.totalIncorrectCount = 0;
        userWordOptional.optional.totalCorrectCount = 0;
      }

      (userWordOptional.optional.correctCount as number)++;
      (userWordOptional.optional.totalCorrectCount as number)++;
      if (
        userWordOptional.difficulty === 'normal' &&
        (userWordOptional.optional.correctCount as number) >= 3
      ) {
        this.audiocall.audiocallStatData.learnedWords++;
        userWordOptional.difficulty = 'easy';
      } else if (
        userWordOptional.difficulty === 'hard' &&
        (userWordOptional.optional.correctCount as number) >= 5
      ) {
        this.audiocall.audiocallStatData.learnedWords++;
        userWordOptional.difficulty = 'easy';
      }
      if (Boolean(userWordOptional.optional.correctCount) === false) {
        userWordOptional.optional.correctCount = 0;
      }
      api.updateUserWord(
        (word as IWord)._id as string,
        userWordOptional,
        (this.authObj as IUserTokens).userId
      );
    }
  }

  private updateIncorrectUserWord(word: IWord | IWordData | undefined): void {
    if (!(word as IWord).userWord) {
      this.audiocall.audiocallNewWords++;
      const userWordData: IUserWord = {
        difficulty: 'normal',
        optional: {
          correctCount: 0,
          totalCorrectCount: 0,
          totalIncorrectCount: 1,
        },
      };
      api.createUserWord(
        (word as IWord)._id as string,
        userWordData,
        (this.authObj as IUserTokens).userId
      );
    } else {
      const userWordOptional = (word as IWord).userWord as IUserWord;
      if (
        Boolean((word as IWord).userWord?.optional.totalCorrectCount) === false &&
        Boolean((word as IWord).userWord?.optional.totalIncorrectCount) === false
      ) {
        this.audiocall.audiocallNewWords++;
        userWordOptional.optional.totalIncorrectCount = 0;
        userWordOptional.optional.totalCorrectCount = 0;
      }

      (userWordOptional.optional.totalIncorrectCount as number)++;
      if (userWordOptional.difficulty === 'easy') {
        userWordOptional.difficulty = 'normal';
        userWordOptional.optional.correctCount = 0;
      }
      if (Boolean(userWordOptional.optional.correctCount) === false) {
        userWordOptional.optional.correctCount = 0;
      }
      api.updateUserWord(
        (word as IWord)._id as string,
        userWordOptional,
        (this.authObj as IUserTokens).userId
      );
    }
  }

  private static async changeStatistics(
    wrongWords: IWord[],
    correctWords: IWord[],
    gameWords: IWord[],
    streak: number
  ): Promise<void> {
    let statistic = await api.getStatistics();

    if (!statistic) {
      statistic = {
        learnedWords: gameWords.length,
        optional: {
          audiocall: {
            correctWords: correctWords.length,
            incorrectWords: wrongWords.length,
            streak,
            newWords: gameWords.length,
          },
          sprint: {
            correctWords: 0,
            incorrectWords: 0,
            streak: 0,
            newWords: +0,
          },
        },
      };
    } else {
      delete statistic.id;
      statistic.learnedWords += correctWords.length;
      statistic.optional.audiocall.correctWords += correctWords.length;
      statistic.optional.audiocall.incorrectWords += wrongWords.length;
      if (statistic.optional.audiocall.streak < streak) {
        statistic.optional.audiocall.streak = streak;
      }
      statistic.optional.audiocall.newWords += gameWords.length;
    }
    api.upsertStatistics(statistic);
  }
}

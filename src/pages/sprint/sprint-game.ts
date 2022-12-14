/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import {
  IWord,
  ISprintWord,
  IWordData,
  IUserWord,
  IUserTokens,
  ISprintResult,
} from '../../interfaces/interfaces';
import SprintResult from './sprint-result';
import api from '../../api/api';
import getRandomNumber from '../../components/utils/getRandomNumber';
import getAuthentification from '../../components/utils/getAuthentification';
import Controller from '../../components/controller/controller';
import { SPRINT_TIMER } from '../../constants/constants';

export default class SprintGame {
  start: void;

  mainContent!: HTMLElement;

  sprintWordsArray: IWord[];

  authObj: IUserTokens | null;

  private sprintCorrectness: boolean;

  private streak: number;

  private index: number;

  sprint: ISprintResult;

  static sprintTimerId1: NodeJS.Timeout;

  static sprintTimerId2: NodeJS.Timeout;

  constructor(sprintWordsArray: IWord[]) {
    this.sprint = {
      sprintNewWords: 0,
      sprintStatData: {
        correctWords: [],
        incorrectWords: [],
        learnedWords: 0,
        maxStreak: 0,
      },
      sprintTimer: SPRINT_TIMER,
      sprintScore: '0',
      sprintWordsArray,
    };
    this.sprintCorrectness = true;
    this.streak = 0;
    this.index = 0;
    this.authObj = getAuthentification();
    this.sprintWordsArray = sprintWordsArray;
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = SprintGame.getHTML();
    this.start = this.startSprint();
  }

  private startSprint(): void {
    this.resetProperties();
    this.startTimer();
    this.setCheckListeners();
  }

  private stopSprint(): void {
    clearTimeout(SprintGame.sprintTimerId1);
    clearTimeout(SprintGame.sprintTimerId2);
    const view = new SprintResult(this.sprint);
  }

  static getHTML(): string {
    return `
      <div class="sprint">
        <div class="sprint__count__wrapper" id="sprint-count-wrapper">
          <div class="sprint__current-count" id="sprint-current-count">0</div>
          <div class="sprint__streak" id="sprint-streak"></div>
          <div class="sprint__score" id="sprint-score">0</div>
        </div>
        <div class="sprint__timer" id="sprint-timer">60</div>
        <div class="sprint__word__wrapper">
          <div class="sprint__word" id="sprint-word"></div>
          <div class="sprint__transcription" id="sprint-translation"></div>
        </div>
        <div class="sprint__answer__wrapper">
          <button class="sprint__wrong-answer red" id="sprint-wrong">??????</button>
          <button class="sprint__right-answer green" id="sprint-right">????</button>
        </div>
      </div>`;
  }

  private resetProperties(): void {
    this.sprint.sprintNewWords = 0;
    this.sprint.sprintStatData = {
      correctWords: [],
      incorrectWords: [],
      learnedWords: 0,
      maxStreak: 0,
    };
    this.sprint.sprintTimer = SPRINT_TIMER;
    this.streak = 0;
    this.sprint.sprintScore = '0';
    this.index = 0;
  }

  private static createRandomNumber(): number {
    return Math.random() < 0.5 ? -1 : 1;
  }

  private sortWords(): IWord[] {
    return [...this.sprint.sprintWordsArray].sort(() => SprintGame.createRandomNumber());
  }

  private createQuestionsArray(): Array<ISprintWord> {
    const sortedArray = this.sortWords();
    const questionsArray: Array<number> = new Array(this.sprint.sprintWordsArray.length).fill(0);

    return questionsArray.map((el, index): ISprintWord => {
      const element = { word: '', wordTranslate: '', correct: true };
      element.word = sortedArray[index].word;
      if (SprintGame.createRandomNumber() > 0) {
        element.wordTranslate = sortedArray[index].wordTranslate;
        element.correct = true;
      } else {
        element.wordTranslate = sortedArray.filter((elem) => elem.word !== element.word)[
          getRandomNumber(sortedArray.length - 1)
        ].wordTranslate;
        element.correct = false;
      }
      return element;
    });
  }

  private setWord(
    word: HTMLElement,
    translation: HTMLElement,
    questionsArray: Array<ISprintWord>
  ): void {
    if (this.index === questionsArray.length) {
      this.stopSprint();
      return;
    }
    // eslint-disable-next-line no-param-reassign
    word.innerHTML = questionsArray[this.index].word;
    // eslint-disable-next-line no-param-reassign
    translation.innerHTML = questionsArray[this.index].wordTranslate;
    this.sprintCorrectness = questionsArray[this.index].correct;
  }

  private countCorrectAnswer(word: HTMLElement): void {
    let multiply = 0;
    const rightAudio = new Audio();
    rightAudio.src = '../../assets/sounds/good.mp3';
    const wordName = word.innerHTML;
    const correctWord = this.sprint.sprintWordsArray.find((elem) => elem.word === wordName);

    switch (this.streak) {
      case 0:
      case 1:
      case 2:
        multiply = 1;
        this.correctAnswerDisplay(multiply);
        break;

      case 3:
      case 4:
      case 5:
        multiply = 2;
        this.correctAnswerDisplay(multiply);
        break;

      case 6:
      case 7:
      case 8:
        multiply = 3;
        this.correctAnswerDisplay(multiply);
        break;

      case 9:
      case 10:
      case 11:
        multiply = 4;
        this.correctAnswerDisplay(multiply);
        break;

      default:
        multiply = 5;
        this.correctAnswerDisplay(multiply);
        break;
    }
    if (Controller.isLoggedIn) {
      this.updateCorrectUserWord(correctWord);
    }
    this.updateSprintStatData(correctWord);
    rightAudio.play();
  }

  private countIncorrectAnswer(word: HTMLElement): void {
    const currentCount = document.getElementById('sprint-current-count') as HTMLElement;
    const streak = document.getElementById('sprint-streak') as HTMLElement;
    const wrongAudio = new Audio();
    wrongAudio.src = '../../assets/sounds/bad.mp3';
    const wordName = word.innerHTML;
    const incorrectWord = this.sprint.sprintWordsArray.find((elem) => elem.word === wordName);

    if (Controller.isLoggedIn) {
      this.updateIncorrectUserWord(incorrectWord);
    }

    this.updateSprintStatData(null, incorrectWord, this.sprint.sprintStatData.learnedWords);
    this.streak = 0;
    wrongAudio.play();
    currentCount.innerHTML = '+0';
    streak.innerHTML = '<span class="str0">??????????????!</span>';
  }

  private updateCorrectUserWord(word: IWord | IWordData | undefined): void {
    if (!(word as IWord).userWord) {
      this.sprint.sprintNewWords++;
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
        this.sprint.sprintNewWords++;
        userWordOptional.optional.totalIncorrectCount = 0;
        userWordOptional.optional.totalCorrectCount = 0;
      }

      (userWordOptional.optional.correctCount as number)++;
      (userWordOptional.optional.totalCorrectCount as number)++;
      if (
        userWordOptional.difficulty === 'normal' &&
        (userWordOptional.optional.correctCount as number) >= 3
      ) {
        this.sprint.sprintStatData.learnedWords++;
        userWordOptional.difficulty = 'easy';
      } else if (
        userWordOptional.difficulty === 'hard' &&
        (userWordOptional.optional.correctCount as number) >= 5
      ) {
        this.sprint.sprintStatData.learnedWords++;
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
      this.sprint.sprintNewWords++;
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
        this.sprint.sprintNewWords++;
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

  private correctAnswerDisplay(multiply: number): void {
    const ratingsArray = [
      '',
      '<span class="str0">??????????????!</span>',
      '<span class="str1">????????????!</span>',
      '<span class="str2">??????????????!</span>',
      '<span class="str3">??????????????!</span>',
      '<span class="str4">??????????!</span>',
    ];
    const currentCount = document.getElementById('sprint-current-count') as HTMLElement;
    const score = document.getElementById('sprint-score') as HTMLElement;
    const streak = document.getElementById('sprint-streak') as HTMLElement;
    const cloneCurrentCount = currentCount.cloneNode() as HTMLElement;
    const cloneScore = score.cloneNode() as HTMLElement;
    const baseScore = 50;
    this.streak += 1;
    cloneCurrentCount.innerHTML = `+${baseScore * multiply}`;
    currentCount.parentNode?.replaceChild(cloneCurrentCount, currentCount);
    cloneScore.innerHTML = (+score.innerHTML + baseScore * multiply).toString();
    score.parentNode?.replaceChild(cloneScore, score);
    streak.innerHTML = ratingsArray[multiply];
    this.sprint.sprintScore = cloneScore.innerHTML;
  }

  private setCheckListeners(): void {
    const word = document.getElementById('sprint-word') as HTMLElement;
    const translation = document.getElementById('sprint-translation') as HTMLElement;
    const questionsArray = this.createQuestionsArray();
    const correctButton = document.getElementById('sprint-right') as HTMLElement;
    const incorrectButton = document.getElementById('sprint-wrong') as HTMLElement;

    this.setWord(word, translation, questionsArray);

    correctButton.addEventListener('click', () => {
      this.correctListener(word, translation, questionsArray);
    });

    incorrectButton.addEventListener('click', () => {
      this.incorrectListener(word, translation, questionsArray);
    });

    document.onkeyup = (event) => this.keyboardListeners(event, word, translation, questionsArray);
  }

  private correctListener(
    word: HTMLElement,
    translation: HTMLElement,
    questionsArray: ISprintWord[]
  ): void {
    this.index++;
    if (this.sprintCorrectness) {
      this.countCorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    } else if (!this.sprintCorrectness) {
      this.countIncorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    }
  }

  private incorrectListener(
    word: HTMLElement,
    translation: HTMLElement,
    questionsArray: ISprintWord[]
  ): void {
    this.index++;
    if (!this.sprintCorrectness) {
      this.countCorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    } else if (this.sprintCorrectness) {
      this.countIncorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    }
  }

  private keyboardListeners(
    event: KeyboardEvent,
    word: HTMLElement,
    translation: HTMLElement,
    questionsArray: ISprintWord[]
  ): void {
    if (event.code === 'ArrowLeft') {
      this.incorrectListener(word, translation, questionsArray);
    }
    if (event.code === 'ArrowRight') {
      this.correctListener(word, translation, questionsArray);
    }
  }

  private setTimer(timer: HTMLElement): void {
    // eslint-disable-next-line no-param-reassign
    timer.innerHTML = this.sprint.sprintTimer.toString();
    this.sprint.sprintTimer--;
    if (this.sprint.sprintTimer <= -1) {
      this.stopSprint();
      return;
    }
    SprintGame.sprintTimerId2 = setTimeout(() => {
      this.setTimer(timer);
    }, 1000);
  }

  private startTimer(): void {
    const timer = document.getElementById('sprint-timer') as HTMLElement;
    SprintGame.sprintTimerId1 = setTimeout(() => {
      this.setTimer(timer);
    }, 1000);
  }

  private updateSprintStatData(
    correctWord: IWordData | IWord | null = null,
    incorrectWord: IWordData | IWord | null = null,
    learnedWord = 0
  ): void {
    if (correctWord) {
      this.sprint.sprintStatData.correctWords.push(correctWord as IWordData);
    }
    if (incorrectWord) {
      this.sprint.sprintStatData.incorrectWords.push(incorrectWord as IWordData);
    }
    if (learnedWord) {
      this.sprint.sprintStatData.learnedWords = learnedWord;
    }
    this.sprint.sprintStatData.maxStreak =
      this.streak > this.sprint.sprintStatData.maxStreak
        ? this.streak
        : this.sprint.sprintStatData.maxStreak;
  }
}

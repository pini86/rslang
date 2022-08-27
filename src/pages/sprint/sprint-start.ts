import { IWord, IUserTokens } from '../../interfaces/interfaces';
import API from '../../api/api';
import getRandomNumber from '../../components/utils/getRandomNumber';

// eslint-disable-next-line import/no-cycle
import SprintGame from './sprint-game';

export default class SprintStart {
  selectDiff: void;

  mainContent!: HTMLElement;

  isLoggedIn = false;

  userId!: string;

  static sprintWordsArray: IWord[];

  authObj: IUserTokens | null;

  constructor() {
    this.authObj = null;
    this.isLoggedIn = this.getAuthentification();
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = SprintStart.getHTML();
    this.selectDiff = this.setDifficultyListeners();
  }

  private static getHTML(): string {
    return `
    <div class="sprint__start">
      <h2 class="sprint-title">Мини-игра "Спринт"</h2>
      <div class="sprint__start__icon"></div>
      <p>Игра на время. Вам необходимо правильно перевести как можно больше слов за 1 минуту.</p>
      <p>За каждый правильный ответ начисляются баллы.</p>
      <p></p>
      <p>Выберите уровень сложности:</p>
      <p> от 1 - легкий, до 6 - сложный</p>
      <p></p>
      <div class="sprint__difficulty">
        <button class="btn" id="diff0">1</button>
        <button class="btn" id="diff1">2</button>
        <button class="btn" id="diff2">3</button>
        <button class="btn" id="diff3">4</button>
        <button class="btn" id="diff4">5</button>
        <button class="btn" id="diff5">6</button>
      </div>
      `;
  }

  private setDifficultyListeners(): void {
    const buttonsContainer = document.querySelector('.sprint__difficulty') as HTMLElement;
    buttonsContainer.addEventListener('click', (btn) => {
      if ((btn.target as HTMLElement).classList.contains('btn')) {
        (btn.target as HTMLElement).classList.add('select');
        setTimeout(() => {
          (btn.target as HTMLElement).classList.remove('select');
          this.startSprintGame(+((btn.target as HTMLElement).id.slice(4) as string));
        }, 200);
      }
    });
    document.onkeyup = (btn) => {
      if (+btn.key >= 1 && +btn.key <= 6) {
        this.startSprintGame(+(btn.key as string) - 1);
      }
    };
  }

  private async setWordsArray(group: number): Promise<void> {
    try {
      const page = getRandomNumber(30);
      if (!this.isLoggedIn) {
        const response = await API.getWords(group, page);
        SprintStart.sprintWordsArray = response as IWord[];
      } else {
        const response = await API.getAllAggregatedUserWords(
          (this.authObj as IUserTokens).userId,
          '0',
          `${page}`,
          '20'
        );
        SprintStart.sprintWordsArray = response as IWord[];
      }
    } catch (err) {
      throw new Error(err as string);
    }
  }

  private async startSprintGame(group: number): Promise<void> {
    try {
      this.setWordsArray(group).then(() => {
        const view = new SprintGame(SprintStart.sprintWordsArray);
      });
    } catch (err) {
      throw new Error(err as string);
    }
  }

  private getAuthentification(): boolean {
    const authBtn = document.querySelector('#authorization') as HTMLButtonElement;
    this.isLoggedIn = authBtn.disabled;
    if (this.isLoggedIn) {
      this.authObj = JSON.parse(localStorage.getItem('tokenData') as string);
      return true;
    }
    return false;
  }
}

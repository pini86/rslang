/* eslint-disable import/no-cycle */
import { IWord, IUserTokens } from '../../interfaces/interfaces';
import API from '../../api/api';
import getRandomNumber from '../../components/utils/getRandomNumber';
import Controller from '../../components/controller/controller';
import SprintGame from './sprint-game';
import getAuthentification from '../../components/utils/getAuthentification';

export default class SprintStart {
  selectDiff: void;

  mainContent!: HTMLElement;

  static sprintWordsArray: IWord[];

  authObj: IUserTokens | null;

  constructor(wordsFromEbook? :IWord[]) {
    this.authObj = getAuthentification();
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    if (wordsFromEbook) {
      // game started from ebook
      this.mainContent.innerHTML = SprintStart.getHTMLEbookStart();
        const startSprintBtn = document.querySelector('.sprint__start-btn') as HTMLButtonElement;
        startSprintBtn.addEventListener('click', () => {
          const view = new SprintGame(wordsFromEbook);
        });
    } else {
      this.mainContent.innerHTML = SprintStart.getDefaultHTML();
      this.selectDiff = this.setDifficultyListeners();
    }
  }

  private static getDefaultHTML(): string {
    return `
    <div class="sprint__start">
      <h5 class="sprint-title">Мини-игра "Спринт"</h5>
      <p>Твоя задача: перевести как можно больше слов за 1 минуту.</з>
      <p>За каждый правильный ответ начисляются баллы.</p>
      <h5>Выбери уровень сложности:</h5>
      <ul class="collection audiocall__levels sprint__difficulty">
      <li class="collection-item">
        <button class="audiocall__level btn green lighten-1 active" id="diff0">A1</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn light-green darken-3" id="diff1">A2</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn cyan darken-1" id="diff2">B1</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn teal darken-2" id="diff3">B2</button>
      </li>
      <li class="collection-item">
        <button class="audiocall__level btn orange" id="diff4">C1</button>
      </li>
      <li class="collection-item">
      <button class="audiocall__level btn pink lighten-3" id="diff5">C2</button>
      </li>
    </ul>
      <p class="audiocall__start-header">Используй мышку или стрелки на клавиатуре</p>
      `;
  }

  private static getHTMLEbookStart(): string {
    return `
    <div class="sprint__start">
      <h2 class="sprint-title">Мини-игра "Спринт"</h2>
      <div class="sprint__start__icon"></div>
      <p>Игра на время. Вам необходимо правильно перевести как можно больше слов за 1 минуту.</p>
      <p>За каждый правильный ответ начисляются баллы.</p>
      <p>Игра начнется со словами из выбранной страницы словаря</p>
      <button class="sprint__start-btn waves-effect waves-light btn">начать</button>
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
      if (!Controller.isLoggedIn) {
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
}

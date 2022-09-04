/* eslint-disable no-param-reassign */
import Controller from '../../components/controller/controller';
import Main from '../main/main';
import api from '../../api/api';
import { ISettings } from '../../interfaces/interfaces';

export default class Statistics {
  mainContent!: HTMLElement;

  view = new Main();

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.initStatistics();
  }

  private initStatistics(): void {
    if (Controller.isLoggedIn) {
      this.mainContent.innerHTML = Statistics.getHTMLWithAuth();
      Statistics.fillContent();
    } else {
      this.mainContent.innerHTML = Statistics.getHTMLWithoutAuth();
      const btnBack = document.getElementById('statistic-btn-back') as HTMLElement;
      btnBack.onclick = () => {
        this.view = new Main();
      };
    }
  }

  private static getHTMLWithoutAuth(): string {
    return `
    <div class="statistics">
    <h2> Cтатистика </h2>
    <div class="statistics__icon"></div>
    <p class="statistics__message">  Статистика недоступна для неавторизованного пользователя !</p>
    <button id="statistic-btn-back" class="btn"> На главную </button>
    </div>
    `;
  }

  private static getHTMLWithAuth(): string {
    return `
    <div class="statistics__auth">
      <h2 class="statistics__auth__header"> Cтатистика за сегодня ( ${new Date().toLocaleDateString(
        'ru-RU',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      )} )</h2>
      <div class="statistics__auth__wrapper">
        <div class="statistics__auth__column1">
          <div class="statistics__auth__card__new">
            <p id="new-words" class="statistics__auth__words__value">0</p>
            <p class="statistics__auth__words__text">новых слов</p>
          </div>
          <div class="statistics__auth__card__learn">
            <div class="statistics__auth__learn__wrapper">
            <p id="learn-words" class="statistics__auth__words__value">0</p>
            <p class="statistics__auth__words__text">слов изучено в мини-играх</p>
            </div>
            <div class="statistics__auth__learn__wrapper">
            <p id="learn-words-ebook" class="statistics__auth__words__value">0</p>
            <p class="statistics__auth__words__text">всего слов изучено в учебнике</p>
            </div>
          </div>
          <div class="statistics__auth__card__percent">
            <div id="statistic_circle" class="sprint__statistics__circle">
              <div id="statistic_circle-wave" class="sprint__statistics__wave"></div>
              <div id="statistic_circle-percent" class="sprint__statistics__percent">0%</div>
            </div>
            <p class="statistics__auth__words__text">правильных ответов</p>
          </div>
        </div>
        <div class="statistics__auth__column2">
          <div class="statistics__auth__card__audio">
            <div class="statistics__auth__card__audio__wraper">
              <div></div>
              <p>Аудиовызов</p>
            </div>
          <p class="game__text"><span id="audio-new-words" class="game__value">0</span>  новых слов</p>
          <p   class="game__text"><span  id="audio-correct-words" class="game__value">0</span>  % правильных ответов</p>
          <p  class="game__text"><span id="audio-in-row"  class="game__value">0</span>  cамая длинная серия<BR> правильных ответов</p>
          </div> 
          <div class="statistics__auth__card__sprint">
            <div class="statistics__auth__card__sprint__wraper">
              <div></div>
              <p>Спринт</p>
            </div>
            <p class="game__text"><span id="sprint-new-words"  class="game__value">0</span>  новых слов</p>
            <p  class="game__text"><span id="sprint-correct-words" class="game__value">0</span>  % правильных ответов</p>
            <p class="game__text"><span id="sprint-in-row"  class="game__value">0</span>  cамая длинная серия<BR> правильных ответов</p>
          </div>          
        </div>
      </div>   
    </div>
    `;
  }

  private static fillContent(): void {
    const newWords = document.getElementById('new-words') as HTMLElement;
    const learnedWords = document.getElementById('learn-words') as HTMLElement;
    const audioNew = document.getElementById('audio-new-words') as HTMLElement;
    const audioCorrect = document.getElementById('audio-correct-words') as HTMLElement;
    const audioInRow = document.getElementById('audio-in-row') as HTMLElement;
    const sprintNew = document.getElementById('sprint-new-words') as HTMLElement;
    const sprintCorrect = document.getElementById('sprint-correct-words') as HTMLElement;
    const sprintInRow = document.getElementById('sprint-in-row') as HTMLElement;
    const textStatisticProgress = document.getElementById(
      'statistic_circle-percent'
    ) as HTMLElement;
    const animateElementProgress = document.getElementById('statistic_circle-wave') as HTMLElement;
    const learnWordsEbook = document.getElementById('learn-words-ebook') as HTMLElement;

    api
      .getStatistics()
      .then((data) => {
        if (data) {
          newWords.innerText = `${
            data.optional.audiocall.newWords + data.optional.sprint.newWords
          }`;
          learnedWords.innerHTML = `${data.learnedWords}`;

          const totalAnswersAudio =
            data.optional.audiocall.correctWords + data.optional.audiocall.incorrectWords;

          audioNew.innerText = `${data.optional.audiocall.newWords}`;
          audioCorrect.innerHTML = `${
            Math.round((data.optional.audiocall.correctWords * 100) / totalAnswersAudio) || 0
          }`;
          audioInRow.innerText = `${data.optional.audiocall.streak}`;

          const totalAnswersSprint =
            data.optional.sprint.correctWords + data.optional.sprint.incorrectWords;

          sprintNew.innerText = `${data.optional.sprint.newWords}`;
          sprintCorrect.innerHTML = `${
            Math.round((data.optional.sprint.correctWords * 100) / totalAnswersSprint) || 0
          }`;
          sprintInRow.innerText = `${data.optional.sprint.streak}`;

          const totalAnswers = totalAnswersAudio + totalAnswersSprint;
          const totalCorrectAnswer =
            data.optional.audiocall.correctWords + data.optional.sprint.correctWords;
          const totalPercent = Math.round((totalCorrectAnswer * 100) / totalAnswers) || 0;

          textStatisticProgress.innerText = `${Math.round(totalPercent)}%`;
          animateElementProgress.dataset.total = Math.round(totalPercent).toString();
        }
      })
      .then(async () => {
        await api.getSettings().then((data) => {
          if (data) {
            learnWordsEbook.innerHTML = data.optional.learnedWords.toString();
          } else {
            learnWordsEbook.innerHTML = '0';
          }
        });
      })
      .then(() => {
        this.getSavedStatistics();
        const wave = document.querySelector('#statistic_circle-wave') as HTMLElement;

        wave.animate(
          [{ top: '100%' }, { top: `${100 - +((wave as HTMLElement).dataset.total as string)}%` }],
          {
            duration: 2000,
            fill: 'forwards',
          }
        );
      });
  }

  private static async getSavedStatistics(): Promise<void> {
    const savedStatistics = await api.getSettings();
    if (savedStatistics) {
      const keysArray = Object.keys((savedStatistics as ISettings).optional.dayStats);
      const statisticsPage = document.querySelector('.statistics__auth') as HTMLElement;

      if (keysArray.length > 1) {
        const statArray = Object.entries((savedStatistics as ISettings).optional.dayStats);
        const miniStatArray = Object.entries((savedStatistics as ISettings).optional.dayLearnWords);

        statisticsPage.innerHTML += `<h2 class="statistics__auth__header"> Сохранённая статистика : </h2>`;
        statArray.forEach(([key, value]) => {
          if (key !== 'start') {
            const totalWords =
              value.optional.audiocall.correctWords +
              value.optional.audiocall.incorrectWords +
              value.optional.sprint.correctWords +
              value.optional.sprint.incorrectWords;
            const totalCorrect =
              value.optional.audiocall.correctWords + value.optional.sprint.correctWords;
            const sprintPercent = Math.round(
              (value.optional.sprint.correctWords * 100) /
                (value.optional.sprint.correctWords + value.optional.sprint.incorrectWords)
            );
            const audiocallPercent = Math.floor(
              (value.optional.audiocall.correctWords * 100) /
                (value.optional.audiocall.correctWords + value.optional.audiocall.incorrectWords)
            );
            statisticsPage.innerHTML += `<h2 class="statistics__auth__header"> Cтатистика за ${key}</h2>
       <div class="statistics__auth__wrapper">
  <div class="statistics__auth__column1">
    <div class="statistics__auth__card__new">
      <p id="new-words" class="statistics__auth__words__value">${
        value.optional.audiocall.newWords + value.optional.sprint.newWords
      }</p>
      <p class="statistics__auth__words__text">новых слов</p>
    </div>
    <div class="statistics__auth__card__learn">
      <div class="statistics__auth__learn__wrapper">
      <p id="learn-words" class="statistics__auth__words__value">${value.learnedWords}</p>
      <p class="statistics__auth__words__text">слов изучено в мини-играх</p>
      </div>
      <div class="statistics__auth__learn__wrapper">
      <p id="learn-words-ebook-prev" class="statistics__auth__words__value" data-day="${key}">0</p>
      <p class="statistics__auth__words__text">всего слов изучено в учебнике</p>
      </div>
    </div>
    <div class="statistics__auth__card__percent">
      <div id="statistic_circle" class="sprint__statistics__circle">
        <div id="statistic_circle-wave" class="sprint__statistics__wave" data-total="${Math.round(
          (totalCorrect * 100) / totalWords
        )}"></div>
        <div id="statistic_circle-percent" class="sprint__statistics__percent">${
          Math.round((totalCorrect * 100) / totalWords) || '0'
        }%</div>
      </div>
      <p class="statistics__auth__words__text">правильных ответов</p>
    </div>
  </div>
  <div class="statistics__auth__column2">
    <div class="statistics__auth__card__audio">
      <div class="statistics__auth__card__audio__wraper">
        <div></div>
        <p>Аудиовызов</p>
      </div>
    <p class="game__text"><span id="audio-new-words" class="game__value">${
      value.optional.audiocall.newWords
    }</span>  новых слов</p>
    <p   class="game__text"><span  id="audio-correct-words" class="game__value">${
      Number.isNaN(audiocallPercent) ? 0 : audiocallPercent
    }</span>  % правильных ответов</p>
    <p  class="game__text"><span id="audio-in-row"  class="game__value">${
      value.optional.audiocall.streak
    }</span>  cамая длинная серия<BR> правильных ответов</p>
    </div> 
    <div class="statistics__auth__card__sprint">
      <div class="statistics__auth__card__sprint__wraper">
        <div></div>
        <p>Спринт</p>
      </div>
      <p class="game__text"><span id="sprint-new-words"  class="game__value">${
        value.optional.sprint.newWords
      }</span>  новых слов</p>
      <p  class="game__text"><span id="sprint-correct-words" class="game__value">${
        Number.isNaN(sprintPercent) ? 0 : sprintPercent
      }</span>  % правильных ответов</p>
      <p class="game__text"><span id="sprint-in-row"  class="game__value">${
        value.optional.sprint.streak
      }</span>  cамая длинная серия<BR> правильных ответов</p>
    </div>          
  </div>
</div>   `;
          }

          const learnedWords = document.querySelectorAll('#learn-words-ebook-prev');

          learnedWords.forEach((words) => {
            miniStatArray.forEach(([keyMini, valueMini]) => {
              if (keyMini === (words as HTMLElement).dataset.day) {
                (words as HTMLElement).innerHTML = valueMini.toString();
              }
            });
          });
        });
      }

      const waves = document.querySelectorAll('#statistic_circle-wave');

      waves.forEach((wave) => {
        wave.animate(
          [{ top: '100%' }, { top: `${100 - +((wave as HTMLElement).dataset.total as string)}%` }],
          {
            duration: 2000,
            fill: 'forwards',
          }
        );
      });
    }
  }
}

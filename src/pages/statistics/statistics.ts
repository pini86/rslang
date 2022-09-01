import Controller from '../../components/controller/controller';
import Main from '../main/main';

export default class Statistics {
  mainContent!: HTMLElement;

  view = new Main();

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    // this.mainContent.innerHTML = 'This is Statistics page !!!';
    this.initStatistics();
  }

  private initStatistics(): void {
    console.log(Controller.isLoggedIn);
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
    <div class="statistics mt-10">
    <h2> Cтатистика </h2>
    <div class="statistics__icon"></div>
    <p>  Статистика недоступна для неавторизованного пользователя </p>
    <button id="statistic-btn-back" class="btn btn-blue"> На главную </button>
    </div>
    `;
  }

  private static getHTMLWithAuth(): string {
    return `
    <div class="statistics-auth mt-10">
      <h2> Cтатистика за ${new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</h2>
      <div class="statistics-auth__wrapper">
        <div class="statistics-auth__column1">
          <div class="statistics-auth__card_new">
            <p id="new-words" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">новых слов</p>
          </div>
          <div class="statistics-auth__card_learn">
            <div class="statistics-auth__learn-wrapper">
            <p id="learn-words" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">слов изучено в мини-играх</p>
            </div>
            <div class="statistics-auth__learn-wrapper">
            <p id="learn-words-EB" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">слов изучено в учебнике</p>
            </div>
          </div>
          <div class="statistics-auth__card_percent">
            <div id="statistic_circle" class="audiocall__statistic_circle">
              <div id="statistic_circle-wive-total" class="audiocall__statistic_circle-wive"></div>
              <div id="text-statistic-total" class="audiocall__statistic_text"></div>
            </div>
            <p class="statistics-auth__words_text">правильных ответов</p>
          </div>
        </div>
        <div class="statistics-auth__column2">
          <div class="statistics-auth__card_audio">
            <div class="statistics-auth__card_audio-wr">
              <div></div>
              <p>Аудиовызов</p>
            </div>
          <p class="game_text"><span id="audio-new-words" class="game_value">0</span>  новых слов</p>
          <p   class="game_text"><span  id="audio-correct-words" class="game_value">0</span>  % правильных ответов</p>
          <p  class="game_text"><span id="audio-in-row"  class="game_value">0</span>  cамая длинная серия правильных ответов</p>
          </div> 
          <div class="statistics-auth__card_sprint">
            <div class="statistics-auth__card_sprint-wr">
              <div></div>
              <p>Спринт</p>
            </div>
            <p class="game_text"><span id="sprint-new-words"  class="game_value">0</span>  новых слов</p>
            <p  class="game_text"><span id="sprint-correct-words" class="game_value">0</span>  % правильных ответов</p>
            <p class="game_text"><span id="sprint-in-row"  class="game_value">0</span>  cамая длинная серия правильных ответов</p>
          </div>          
        </div>
      </div>   
    </div>
    `;
  }

  private static fillContent(): void {
    
  }
}

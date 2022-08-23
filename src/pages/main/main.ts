export default class Main{
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main') as HTMLElement;
    this.mainContent.innerHTML = `<div class="container">
    <div class="main__info">
    <div class="info__left">
      <img class="info__logo" src="assets/images/logo.png" alt="RS Lang logotype" />
      <p class="info__text">
        — это приложение для изучения английского языка в игровой форме
      </p>
    </div>
    <div class="info__right">
      <img class="info__main-image" src="assets/images/main-pic.png" alt="Learn, play, enjoy, progress" />
    </div>
  </div>
  <div class="main__about">
    <h3 class="center main__subtitle">О приложении</h3>
    <p>
      RS Lang – приложение, созданное командой начинающих разработчиков. Поможем тебе выучить английский. Почему выбирают нас? Ответ очевиден - только наше приложение предлагает сбалансированный набор инструментов для эффективного изучения английского языка!
    </p>
    <div class="about__cards">
      <div class="card__wrapper">
        <a href="#"><i class="material-icons card__icon yellow">chat</i></a>
        <p class="card__text">
          Коллекция из 4000 наиболее используемых в речи слов
        </p>
      </div>
      <div class="card__wrapper">
        <a href="#"><i class="material-icons card__icon red darken-1">library_books</i></a>
        <p class="card__text">
          Электронный учебник с аудио, транскрипцией и переводом слов в контексте
        </p>
      </div>
      <div class="card__wrapper">
        <a href="#"><i class="material-icons card__icon pink lighten-3">extension</i></a>
        <p class="card__text">
          Мини-игры для повторения изученных слов: Аудиовызов и Спринт
        </p>
      </div>
      <div class="card__wrapper">
        <a href="#"><i class="material-icons card__icon cyan darken">show_chart</i></a>
        <p class="card__text">
          Статистика для отслеживания прогресса во время обучения
        </p>
      </div>
    </div>
  </div>
  <div class="main__team">
    <h3 class="center main__subtitle">Наша команда</h3>
    <div class="team__cards">
      <div class="team__card card-yellow">
        <div>
          <img src="https://avatars.githubusercontent.com/u/94520585?v=4" alt="Developer's avatar" class="team__img" />
        </div>
        <h5>
          <a class="team__name" href="https://github.com/pini86">@pini86</a>
        </h5>
        <div class="team__tasks">
          <span class="team__task yellow">Аудиовызов</span>
          <span class="team__task pink lighten-3">Спринт</span>
          <span class="team__task cyan darken">Учебник</span>
          <span class="team__task red darken-1">Верстка</span>
        </div>
      </div>
      <div class="team__card card-blue">
        <div>
          <img src="https://avatars.githubusercontent.com/u/25122117?v=4" alt="Developer's avatar" class="team__img" />
        </div>
        <h5>
          <a class="team__name" href="https://github.com/user0k">@user0k</a>
        </h5>
        <div class="team__tasks">
          <span class="team__task cyan darken">Аудиовызов</span>
          <span class="team__task red darken-1">Спринт</span>
          <span class="team__task pink lighten-3">Учебник</span>
          <span class="team__task yellow">Верстка</span>
        </div>
      </div>
      <div class="team__card card-pink">
        <div>
          <img src="https://avatars.githubusercontent.com/u/96010768?v=4" alt="Developer's avatar" class="team__img" />
        </div>
        <h5>
          <a class="team__name" href="https://github.com/natashapridanova">@natashapridanova</a>
        </h5>
        <div class="team__tasks">
          <span class="team__task red darken-1">Аудиовызов</span>
          <span class="team__task yellow">Спринт</span>
          <span class="team__task cyan darken">Учебник</span>
          <span class="team__task pink lighten-3">Верстка</span>
        </div>
      </div>
    </div>
  </div>
  </div>`;
  }
}
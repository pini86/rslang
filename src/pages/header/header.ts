export default class Header {
  headerContent!: HTMLElement;

  constructor() {
    this.headerContent = document.querySelector('header') as HTMLElement;
    this.headerContent.innerHTML = `<div class="container">
    <nav class="nav">
      <div class="nav-wrapper">
        <div id="icon-menu" class="icon-menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul id="body-menu" class="row body-menu">
          <li class="nav__link" id="main">Главная</li>
          <li class="nav__link" id="ebook">Учебник</li>
          <li class="nav__link" id="audiocall">Аудиовызов</li>
          <li class="nav__link" id="sprint">Спринт</li>
          <li class="nav__link" id="statistics">Статистика</li>
        </ul>
        <button id="authorization" class="authorization">
          <span class="authorization__greet">Войти</span><i class="material-icons authorization__icon">account_box</i>
          <span class="authorization__logout">Выйти</span></a>
        </button>
      </div>
    </nav>
  </div>`;
  }
}

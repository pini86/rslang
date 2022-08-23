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
          <li id="main">Главная</li>
          <li id="ebook">Учебник</li>
          <li id="audiocall">Аудиовызов</li>
          <li id="sprint">Спринт</li>
          <li id="statistics">Статистика</li>
        </ul>
        <button id="authorization" class="authorization">
          <span>Войти</span><i class="material-icons authorization__icon">account_box</i>
        </button>
      </div>
    </nav>
  </div>`;
  }
}

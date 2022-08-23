export default class Footer {
  footerContent!: HTMLElement;

  constructor() {
    this.footerContent = document.querySelector('footer') as HTMLElement;
    this.footerContent.innerHTML = `<div class="container">
    <div class="footer__info center">
      <a class="team__name" href="https://github.com/natashapridanova">@natashapridanova</a>
      <a href="https://rs.school/js/" class="footer__rs"></a>
      <p class="footer__year">2022</p>
      <a class="team__name" href="https://github.com/user0k">@user0k</a>
      <a class="team__name" href="https://github.com/pini86">@pini86</a>
    </div>
  </div>`;
  }
}

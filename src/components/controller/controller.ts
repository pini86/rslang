/* eslint-disable import/no-cycle */
import Main from '../../pages/main/main';
import Ebook from '../../pages/ebook/ebook';
import Audiocall from '../../pages/audiocall/audiocall';
import Sprint from '../../pages/sprint/sprint';
import Statistics from '../../pages/statistics/statistics';
import Authorization from '../../pages/authorization/authorization';
import Header from '../../pages/header/header';
import Footer from '../../pages/footer/footer';

enum EPages {
  auth = 'Auth',
  main = 'Main',
  ebook = 'Ebook',
  audiocall = 'Audiocall',
  sprint = 'Sprint',
  statistics = 'Statistics',
}

export default class Controller {
  private currentPage = EPages.main;

  keyStorage = 'currentPage';

  header = new Header();

  mainView = new Main();

  footer = new Footer();

  static isLoggedIn = false;

  initApp(): void {
    this.createView();
  }

  createView(): void {
    const mainBtn = document.getElementById('main') as HTMLElement;
    const ebookBtn = document.getElementById('ebook') as HTMLElement;
    const audiocallBtn = document.getElementById('audiocall') as HTMLElement;
    const sprintBtn = document.getElementById('sprint') as HTMLElement;
    const authBtn = document.getElementById('authorization') as HTMLElement;
    const statisticsBtn = document.getElementById('statistics') as HTMLElement;
    const iconMenu = document.getElementById('icon-menu') as HTMLElement;

    iconMenu.addEventListener('click', () => {
      if (iconMenu.classList.contains('icon-menu--active')) {
        Controller.toggleHeaderMenu('close');
      } else {
        Controller.toggleHeaderMenu('open');
      }
    });

    authBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.auth, new Authorization(), authBtn)
    );

    mainBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.main, new Main(), mainBtn)
    );

    ebookBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.ebook, new Ebook(), ebookBtn)
    );

    audiocallBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.audiocall, new Audiocall(), audiocallBtn)
    );

    sprintBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.sprint, new Sprint(), sprintBtn)
    );

    statisticsBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.statistics, new Statistics(), statisticsBtn)
    );

    this.checkSessionStorage();

    switch (this.currentPage) {
      case 'Auth':
        this.setActiveMenuItem(authBtn);
        this.mainView = new Authorization();
        break;
      case 'Ebook':
        this.setActiveMenuItem(ebookBtn);
        this.mainView = new Ebook();
        break;
      case 'Audiocall':
        this.setActiveMenuItem(audiocallBtn);
        this.mainView = new Audiocall();
        break;
      case 'Sprint':
        this.setActiveMenuItem(sprintBtn);
        this.mainView = new Sprint();
        break;
      case 'Statistics':
        this.setActiveMenuItem(statisticsBtn);
        this.mainView = new Statistics();
        break;
      default:
        this.setActiveMenuItem(mainBtn);
    }
  }

  addBtnListener(
    page: EPages,
    PageClass: Main | Ebook | Audiocall | Sprint | Statistics | Authorization,
    btn: HTMLElement
  ): void {
    if (this.currentPage === page) return;
    this.currentPage = page;
    this.mainView = PageClass;
    Controller.toggleHeaderMenu('close');
    this.setActiveMenuItem(btn);
    document.onkeyup = null;
  }

  setActiveMenuItem(menuItem: HTMLElement): void {
    const bodyMenu = document.querySelector('.body-menu') as HTMLElement;
    const menuItems = [...bodyMenu.children] as HTMLElement[];
    menuItems.forEach((li) => li.classList.remove('active'));
    menuItem.classList.add('active');
    this.setSessionStorage();
  }

  static toggleHeaderMenu(action: string): void {
    const iconMenu = document.getElementById('icon-menu') as HTMLElement;
    const bodyMenu = document.getElementById('body-menu') as HTMLElement;
    if (action === 'close') {
      iconMenu.classList.remove('icon-menu--active');
      bodyMenu.classList.remove('body-menu--active');
    } else {
      iconMenu.classList.add('icon-menu--active');
      bodyMenu.classList.add('body-menu--active');
    }
  }

  checkSessionStorage(): void {
    const getKey = sessionStorage.getItem(this.keyStorage) as EPages;
    if (getKey) {
      this.currentPage = getKey;
    }
  }

  setSessionStorage(): void {
    sessionStorage.setItem(this.keyStorage, this.currentPage);
  }
}

/* eslint-disable import/no-cycle */
import Main from '../../pages/main/main';
import { Ebook, initEbook } from '../../pages/ebook/ebook';
import Audiocall from '../../pages/audiocall/audiocall';
import Sprint from '../../pages/sprint/sprint';
import Statistics from '../../pages/statistics/statistics';
import Authorization from '../../pages/authorization/authorization';
import Header from '../../pages/header/header';
import Footer from '../../pages/footer/footer';
import { showUserAuthentification } from '../authorization/userLoggedMode';
import { activateAuthentification } from '../contentLoaded/dom';
import SprintGame from '../../pages/sprint/sprint-game';

export enum EPages {
  auth = 'Auth',
  main = 'Main',
  ebook = 'Ebook',
  audiocall = 'Audiocall',
  sprint = 'Sprint',
  statistics = 'Statistics',
}

export default class Controller {
  static isLoggedIn = false;

  static currentPage = EPages.main;

  static keyStorage = 'currentPage';

  header = new Header();

  mainView = new Main();

  footer = new Footer();

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

    showUserAuthentification();

    iconMenu.addEventListener('click', () => {
      if (iconMenu.classList.contains('icon-menu--active')) {
        Controller.toggleHeaderMenu('close');
      } else {
        Controller.toggleHeaderMenu('open');
      }
    });

    authBtn.addEventListener('click', (): void => {
      this.addBtnListener(EPages.auth, new Authorization(), authBtn);
      activateAuthentification();
    });

    mainBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.main, new Main(), mainBtn)
    );

    ebookBtn.addEventListener('click', (): void => {
      this.removePanels();
      this.addBtnListener(EPages.ebook, new Ebook(), ebookBtn);
      initEbook();
    });

    audiocallBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.audiocall, new Audiocall(), audiocallBtn)
    );

    sprintBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.sprint, new Sprint(), sprintBtn)
    );

    statisticsBtn.addEventListener('click', (): void =>
      this.addBtnListener(EPages.statistics, new Statistics(), statisticsBtn)
    );

    Controller.checkSessionStorage();

    switch (Controller.currentPage) {
      case 'Auth':
        Controller.setActiveMenuItem(authBtn);
        this.mainView = new Authorization();
        break;
      case 'Ebook':
        Controller.setActiveMenuItem(ebookBtn);
        this.mainView = new Ebook();
        initEbook();
        break;
      case 'Audiocall':
        Controller.setActiveMenuItem(audiocallBtn);
        this.mainView = new Audiocall();
        break;
      case 'Sprint':
        Controller.setActiveMenuItem(sprintBtn);
        this.mainView = new Sprint();
        break;
      case 'Statistics':
        Controller.setActiveMenuItem(statisticsBtn);
        this.mainView = new Statistics();
        break;
      default:
        Controller.setActiveMenuItem(mainBtn);
    }
  }

  addBtnListener(
    page: EPages,
    PageClass: Main | Ebook | Audiocall | Sprint | Statistics | Authorization,
    btn: HTMLElement
  ): void {
    clearTimeout(SprintGame.sprintTimerId1);
    clearTimeout(SprintGame.sprintTimerId2);
    if (Controller.currentPage === page) return;
    Controller.currentPage = page;
    this.mainView = PageClass;
    Controller.toggleHeaderMenu('close');
    Controller.setActiveMenuItem(btn);
    this.removePanels();
    if (page !== 'Ebook') {
      document.querySelector('main')?.classList.remove('learned-page');
    }
    document.onkeyup = null;
  }

  static setActiveMenuItem(menuItem: HTMLElement): void {
    const bodyMenu = document.querySelector('.body-menu') as HTMLElement;
    const menuItems = [...bodyMenu.children] as HTMLElement[];
    menuItems.forEach((li) => li.classList.remove('active'));
    menuItem.classList.add('active');
    this.setSessionStorage();
  }

  // eslint-disable-next-line class-methods-use-this
  removePanels(): void {
    const gamePanel = document.querySelector('.game-panel');
    const levels = document.querySelector('.textbook-levels');
    const pagination = document.querySelector('.pagination');
    if (gamePanel) {
      gamePanel.remove();
    }
    if (levels) {
      levels.remove();
    }
    if (pagination) {
      pagination.remove();
    }
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

  static checkSessionStorage(): void {
    const getKey = sessionStorage.getItem(this.keyStorage) as EPages;
    if (getKey) {
      Controller.currentPage = getKey;
    }
  }

  static setSessionStorage(): void {
    sessionStorage.setItem(Controller.keyStorage, Controller.currentPage);
  }
}

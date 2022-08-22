import Main from '../../pages/main/main';
import Ebook from '../../pages/ebook/ebook';
import Audiocall from '../../pages/audiocall/audiocall';
import Sprint from '../../pages/sprint/sprint';
import Statistics from '../../pages/statistics/statistics';
import Authorization from '../../pages/authorization/authorization';

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

  mainView = new Main();

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

    authBtn.addEventListener('click', (): void => {
      if (this.currentPage === EPages.auth) return;
      this.currentPage = EPages.auth;
      this.setActiveMenuItem(authBtn);
      this.mainView = new Authorization();
    });

    mainBtn.addEventListener('click', (): void => {
      if (this.currentPage === EPages.main) return;
      this.currentPage = EPages.main;
      this.mainView = new Main();
      Controller.toggleHeaderMenu('close');
      this.setActiveMenuItem(mainBtn);
    });

    ebookBtn.addEventListener('click', (): void => {
      if (this.currentPage === EPages.ebook) return;
      this.currentPage = EPages.ebook;
      this.mainView = new Ebook();
      Controller.toggleHeaderMenu('close');
      this.setActiveMenuItem(ebookBtn);
    });

    audiocallBtn.addEventListener('click', (): void => {
      if (this.currentPage === EPages.audiocall) return;
      this.currentPage = EPages.audiocall;
      this.mainView = new Audiocall();
      Controller.toggleHeaderMenu('close');
      this.setActiveMenuItem(audiocallBtn);
    });

    sprintBtn.addEventListener('click', (): void => {
      if (this.currentPage === EPages.sprint) return;
      this.currentPage = EPages.sprint;
      this.mainView = new Sprint();
      Controller.toggleHeaderMenu('close');
      this.setActiveMenuItem(sprintBtn);
    });

    statisticsBtn.addEventListener('click', (): void => {
      if (this.currentPage === EPages.statistics) return;
      this.currentPage = EPages.statistics;
      this.mainView = new Statistics();
      Controller.toggleHeaderMenu('close');
      this.setActiveMenuItem(statisticsBtn);
    });

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

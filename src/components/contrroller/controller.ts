import Main from '../../pages/main/main';
import Ebook from '../../pages/ebook/ebook';
import Audiocall from '../../pages/audiocall/audiocall';
import Sprint from '../../pages/sprint/sprint';
import Statistics from '../../pages/statistics/statistics';
import Authorization from '../../pages/authorization/authorization';

enum EPages {
  auth = 'auth',
  main = 'main',
  electronBook = 'electronBook',
  audiocall = 'audiocall',
  sprint = 'sprint',
  statistics = 'statistics',
}

export default class Controller {
  private currentPage = EPages.main;

  keyStorage = 'currentPage';

  mainView = new Main();

  /* constructor() {
   
  } */

  initApp(): void {
    this.addHeaderListeners(); // сюда добавить проверку в sessionstorage на предмет сохраненной страницы
  }

  addHeaderListeners(): void {
    const mainBtn = document.getElementById('main') as HTMLElement;
    const electronBookBtn = document.getElementById('ebook') as HTMLElement;
    const audioCallBtn = document.getElementById('audiocall') as HTMLElement;
    const sprintBtn = document.getElementById('sprint') as HTMLElement;
    const autBtn = document.getElementById('authorization') as HTMLElement;
    const statisticsBtn = document.getElementById('statistics') as HTMLElement;
    const iconMenu = document.getElementById('icon-menu') as HTMLElement;

    // console.log( iconMenu);

    Controller.setActiveMenuItem(mainBtn);

    iconMenu.addEventListener('click', () => {
      if (iconMenu.classList.contains('icon-menu--active')) {
        Controller.toggleHeaderMenu('close');
      } else {
        Controller.toggleHeaderMenu('open');
      }
    });

    autBtn.addEventListener('click', (): void => {
      this.currentPage = EPages.auth;
      Controller.setActiveMenuItem(autBtn);
      this.mainView = new Authorization();
    });

    mainBtn.addEventListener('click', (): void => {
      this.currentPage = EPages.main;
      this.mainView = new Main();
      Controller.toggleHeaderMenu('close');
      Controller.setActiveMenuItem(mainBtn);
    });

    electronBookBtn.addEventListener('click', (): void => {
      this.currentPage = EPages.electronBook;
      this.mainView = new Ebook();
      Controller.toggleHeaderMenu('close');
      Controller.setActiveMenuItem(electronBookBtn);
    });

    audioCallBtn.addEventListener('click', (): void => {
      this.currentPage = EPages.audiocall;
      this.mainView = new Audiocall();
      Controller.toggleHeaderMenu('close');
      Controller.setActiveMenuItem(audioCallBtn);
    });

    sprintBtn.addEventListener('click', (): void => {
      this.currentPage = EPages.sprint;
      this.mainView = new Sprint();
      Controller.toggleHeaderMenu('close');
      Controller.setActiveMenuItem(sprintBtn);
    });

    statisticsBtn.addEventListener('click', (): void => {
      this.currentPage = EPages.statistics;
      this.mainView = new Statistics();
      Controller.toggleHeaderMenu('close');
      Controller.setActiveMenuItem(statisticsBtn);
    });
  }

  static setActiveMenuItem(menuItem: HTMLElement): void {
    const bodyMenu = document.querySelector('.body-menu') as HTMLElement;
    const menuItems = [...bodyMenu.children] as HTMLElement[];
    menuItems.forEach((li) => li.classList.remove('active'));
    menuItem.classList.add('active');
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
}

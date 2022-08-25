import createDiffPanel from '../../components/textbook/difficulty-panel';
import renderCards from '../../components/textbook/cards';
import initPagination from '../../components/textbook/pagination';

export class Ebook {
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = '';
  }
}

export function initEbook() {
  createDiffPanel();
  renderCards();
  initPagination();
}

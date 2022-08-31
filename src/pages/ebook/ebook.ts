import state from './state';
import createDiffPanel from '../../components/ebook/difficulty-panel';
import renderCards from '../../components/ebook/cards';
import { initPagination } from '../../components/ebook/pagination';
import renderDifficultCards from '../../components/ebook/difficult-cards';

export class Ebook {
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = '';
  }
}

export function initEbook() {
  createDiffPanel();
  if (state.curGroup !== 6) {
    renderCards();
    initPagination();
  } else {
    renderDifficultCards();
  }
}

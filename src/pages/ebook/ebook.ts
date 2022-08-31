import state from './state';
import createDiffPanel from '../../components/ebook/difficulty-panel';
import renderCards from '../../components/ebook/cards';
import { initPagination } from '../../components/ebook/pagination';

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
  if (state.curGroup !== 6) {
    initPagination();
  }
}

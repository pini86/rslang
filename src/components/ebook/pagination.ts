import { TOTAL_PAGES_AMOUNT, WORDS_PER_PAGE } from '../../constants/constants';
import state from '../../pages/ebook/state';
import api from '../../api/api';
import renderCards from './cards';
import { removeLearnedPage } from '../../pages/ebook/helpers';

const main = document.querySelector('main') as HTMLElement;
let { curPage } = state;

const pagination = document.createElement('ul');
pagination.classList.add('pagination');

async function setActivePage(el: HTMLElement, page: number) {
  el.classList.add('active-page');
  el.classList.remove('pagination-learned-page');
  const easyCount = (
    await api.getAllAggregatedUserWords(`${state.curGroup}`, `${page}`, `${WORDS_PER_PAGE}`, 'easy')
  )?.length;
  if (easyCount === WORDS_PER_PAGE) {
    el.classList.add('pagination-learned-page');
  }
}

function createPaginationPages(page: number) {
  const arrowLeft = document.createElement('li');
  const arrowRight = document.createElement('li');
  arrowLeft.innerHTML =
    '<a class="arrow-left" href="#"><i class="material-icons prev">chevron_left</i></a>';
  arrowRight.innerHTML =
    '<a class="arrow-right" href="#"><i class="material-icons next">chevron_right</i></a>';

  if (page === 0) {
    arrowLeft.classList.add('disabled');
  }

  pagination.append(arrowLeft);

  // conditions on 38 - 49 lines will insert '...' between page numbers
  for (let i = 0, liCount = 1; i < TOTAL_PAGES_AMOUNT; i++, liCount++) {
    const li = document.createElement('li');

    if (page === i) {
      setActivePage(li, page);
    }

    li.innerHTML = `<a id="${i}" href="#">${i + 1}</a>`;
    pagination.append(li);

    // this condition will insert '...' after page 1 if the current page >= 4, and count '...' as li element (to decrease amount of li)
    // if we want to see previous page after '...' we should do i = page - 2 because page - 1 equals to current page
    if (page >= 3 && i < 2) {
      i = page - 2;
      pagination.insertAdjacentHTML('beforeend', '<li><a class="cursor-def">...</a></li>');
      liCount++;

      // amount of li === 5 means that the next page after the current is created and we want to insert '...' after that
      // i = totalPages will not render the last page if we are on 26 page or below
      // i = totalPages - 2 will render extra page before the last page; i = totalPages - 1 works fine for the tail of pagination
    } else if (liCount === 5 && i < TOTAL_PAGES_AMOUNT - 3) {
      pagination.insertAdjacentHTML('beforeend', '<li><a class="cursor-def">...</a></li>');
      i = TOTAL_PAGES_AMOUNT - 2;
    }
  }

  if (page === TOTAL_PAGES_AMOUNT - 1) {
    arrowRight.classList.add('disabled');
  }

  pagination.append(arrowRight);
}

function renderPagination(page: number) {
  pagination.innerHTML = '';
  createPaginationPages(page);
  main.append(pagination);
}

export function initPagination() {
  const page = sessionStorage.getItem('page') ?? 0;
  renderPagination(+page);
}

export function removePagination() {
  pagination.remove();
}

function togglePage() {
  state.curPage = curPage;
  sessionStorage.setItem('page', `${curPage}`);
  renderCards(state.curGroup, curPage);
  renderPagination(curPage);
}

pagination.addEventListener('click', (e) => {
  const el = e.target as HTMLElement;

  if (
    (el.classList.contains('arrow-left') && curPage) ||
    (el.classList.contains('prev') && curPage)
  ) {
    curPage--;
    togglePage();
    removeLearnedPage(main);
  } else if (
    (el.classList.contains('arrow-right') && curPage !== TOTAL_PAGES_AMOUNT) ||
    (el.classList.contains('next') && curPage !== TOTAL_PAGES_AMOUNT)
  ) {
    curPage++;
    togglePage();
    removeLearnedPage(main);
  } else {
    const id = el.getAttribute('id');

    if (id && +id !== curPage) {
      curPage = +id;
      togglePage();
      removeLearnedPage(main);
    }
  }
});

import renderCards from './cards';
import state from '../../pages/ebook/state';

const main = document.querySelector('main') as HTMLElement;
const { totalPages } = state;
let { curPage } = state;

const pagination = document.createElement('ul');
pagination.classList.add('pagination');

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
  for (let i = 0, liCount = 1; i <= totalPages; i++, liCount++) {
    const li = document.createElement('li');

    if (page === i) {
      li.classList.add('active-page');
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
    } else if (liCount === 5 && i < totalPages - 2) {
      pagination.insertAdjacentHTML('beforeend', '<li><a class="cursor-def">...</a></li>');
      i = totalPages - 1;
    }
  }

  if (page === totalPages) {
    arrowRight.classList.add('disabled');
  }

  pagination.append(arrowRight);
}

function renderPagination(page: number) {
  pagination.innerHTML = '';
  createPaginationPages(page);
  main.append(pagination);
}

export default function initPagination() {
  const page = sessionStorage.getItem('page') ?? 0;
  renderPagination(+page);
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
  } else if (
    (el.classList.contains('arrow-right') && curPage !== totalPages) ||
    (el.classList.contains('next') && curPage !== totalPages)
  ) {
    curPage++;
    togglePage();
  } else {
    const id = el.getAttribute('id');

    if (id && +id !== curPage) {
      curPage = +id;
      togglePage();
    }
  }
});

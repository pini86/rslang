import renderCards from './cards';
import state from './state';

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

  for (let i = 0, liCount = 1; i <= totalPages; i++, liCount++) {
    const li = document.createElement('li');

    if (page === i) {
      li.classList.add('active-page');
    }

    li.innerHTML = `<a id="${i}" href="#">${i + 1}</a>`;
    pagination.append(li);

    if (page >= 3 && i < 2) {
      i = page - 2;
      pagination.insertAdjacentHTML('beforeend', '<li><a class="cursor-def" href="#">...</a></li>');
      liCount++;
    } else if (liCount === 5 && i < totalPages - 2) {
      pagination.insertAdjacentHTML('beforeend', '<li><a class="cursor-def" href="#">...</a></li>');
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
  sessionStorage.setItem('page', `${curPage}`);
  renderCards(state.curGroup, curPage);
  renderPagination(curPage);
}

pagination.addEventListener('click', (e) => {
  const el = e.target as HTMLElement;

  if (
    (el.classList.contains('arrow-left') && curPage !== 0) ||
    (el.classList.contains('prev') && curPage !== 0)
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

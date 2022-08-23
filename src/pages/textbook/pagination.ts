const main = document.querySelector('#textbook') as HTMLElement;
const totalPages = 29;

const pagination = document.createElement('ul');
pagination.classList.add('pagination');
const arrowLeft = document.createElement('li');
const arrowRight = document.createElement('li');
arrowLeft.innerHTML = '<a href="#"><i class="material-icons arrow-left">chevron_left</i></a>';
arrowRight.innerHTML = '<a href="#"><i class="material-icons arrow-right">chevron_right</i></a>';

function createPaginationPages (page: number) {
  if (page === 0) {
    arrowLeft.classList.add('disabled');
  }

  pagination.append(arrowLeft);

  for (let i = 0, liCount = 1; i <= totalPages; i++, liCount++) {
    const li = document.createElement('li');
    li.setAttribute('id', `${i}`);

    if (page === i ) {
      li.classList.add('active-page');
    }

    li.innerHTML = `<a href="#">${i + 1}</a>`;
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

export function renderPagination(page: number) {
  createPaginationPages(page)
  main.append(pagination);
}

export function initPagination() {
  const page = sessionStorage.getItem('page') || 0;
  renderPagination(+page);
}

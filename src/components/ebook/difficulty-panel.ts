import cardLevels from '../../pages/ebook/card-levels';
import state from '../../pages/ebook/state';
import renderCards from './cards';
import renderDifficultCards from './difficult-cards';
import { initPagination, removePagination } from './pagination';

const main = document.querySelector('main') as HTMLElement;
let { curGroup, curPage } = state;

export default function createDiffPanel() {
  const textBookLevels = document.createElement('ul');
  textBookLevels.classList.add('collection', 'textbook-levels');
  let levelsToRender = '';

  cardLevels.forEach(({ color, difficultyId }, i) => {
    const isActive = i === curGroup ? 'level-active' : '';
    levelsToRender += `
      <li class="collection-item">
        <span id="${difficultyId}" class="btn ${color} ${isActive}">${difficultyId}</span>
      </li>
    `;
  });

  textBookLevels.innerHTML = levelsToRender;

  textBookLevels.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    const elId = el.getAttribute('id');
    let curId = cardLevels[curGroup].difficultyId;

    if (el.classList.contains('btn') && elId !== curId && elId !== 'u') {
      textBookLevels.querySelector(`#${curId}`)?.classList.remove('level-active');
      el.classList.add('level-active');
      curId = el.getAttribute('id') as string;
      curGroup = cardLevels.findIndex((level) => level.difficultyId === curId);
      curPage = 0;
      state.curPage = curPage;
      state.curGroup = curGroup;
      sessionStorage.setItem('page', `${curPage}`);
      sessionStorage.setItem('group', `${curGroup}`);
      renderCards(curGroup, curPage);
      initPagination();
    } else if (elId === 'u') {
      textBookLevels.querySelector(`#${curId}`)?.classList.remove('level-active');
      el.classList.add('level-active');
      curId = el.getAttribute('id') as string;
      curGroup = 6;
      curPage = 0;
      state.curPage = curPage;
      state.curGroup = curGroup;
      sessionStorage.setItem('page', `${curPage}`);
      sessionStorage.setItem('group', `${curGroup}`);
      renderDifficultCards();
      removePagination();
    }
  });

  main.prepend(textBookLevels);
}

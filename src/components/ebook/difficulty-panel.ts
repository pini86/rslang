import cardLevels from '../../pages/ebook/card-levels';
import state from '../../pages/ebook/state';
import renderCards from './cards';
import initPagination from './pagination';

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
    let curId = cardLevels[curGroup].difficultyId;

    if (el.classList.contains('btn') && el.getAttribute('id') !== curId) {
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
    }
  });

  main.prepend(textBookLevels);
}

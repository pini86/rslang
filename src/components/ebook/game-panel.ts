import { TOTAL_PAGES_AMOUNT } from '../../constants/constants';
import state from '../../pages/ebook/state';

const main = document.querySelector('main') as HTMLElement;

export default function createGamePanel() {
  const gamePanel = document.createElement('ul');
  gamePanel.classList.add('collection', 'game-panel');
  const isActive = state.easyCount === TOTAL_PAGES_AMOUNT - 1 ? 'disabled' : '';
  gamePanel.innerHTML = `
    <li class="collection-item avatar btn ${isActive}">
      <a href="#">
        <img src="../../assets/icons/audiocall.png" alt="audiocall" class="circle">
      </a>
    </li>
    <li class="collection-item avatar btn ${isActive}">
      <a href="#">
        <img src="../../assets/icons/sprint.svg" alt="audiocall" class="circle">
      </a>
    </li>
  `
  main.prepend(gamePanel);
}

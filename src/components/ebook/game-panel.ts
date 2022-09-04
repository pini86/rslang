import { WORDS_PER_PAGE } from '../../constants/constants';
import state from '../../pages/ebook/state';

const main = document.querySelector('main') as HTMLElement;

export default function createGamePanel() {
  const gamePanel = document.createElement('ul');
  gamePanel.classList.add('collection', 'game-panel');
  const isActive = state.easyCount === WORDS_PER_PAGE ? 'disabled' : '';
  gamePanel.innerHTML = `
    <button class="btn cyan darken-1 btn-audiocall ${isActive}">
      <i class="material-icons">music_note</i>
    </button>
    <button class="btn cyan darken-1 btn-sprint ${isActive}">
      <i class="material-icons">directions_run</i>
    </button>
  `
  main.prepend(gamePanel);
}

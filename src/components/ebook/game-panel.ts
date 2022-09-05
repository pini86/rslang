import api from '../../api/api';
import { WORDS_PER_PAGE } from '../../constants/constants';
import Audiocall from '../../pages/audiocall/audiocall';
import state from '../../pages/ebook/state';
import SprintStart from '../../pages/sprint/sprint-start';
import Controller from '../controller/controller';

const main = document.querySelector('main') as HTMLElement;

function activateGameBtns() {
  const btnAudiocall = document.querySelector('.btn-audiocall') as HTMLElement;
  const btnSprint = document.querySelector('.btn-sprint') as HTMLElement;
  btnAudiocall.addEventListener('click', () => {
    const page: string = sessionStorage.getItem('page') || '0';
    const group: string = sessionStorage.getItem('group') || '0';
    const audiocallBtn = document.getElementById('audiocall') as HTMLElement;
    Controller.removePanels();
    Controller.setActiveMenuItem(audiocallBtn);
    if (Controller.isLoggedIn) {
      api.getAllAggregatedUserWords(api.userId, group, page, '20').then((words) => {
        const view = new Audiocall(words);
      });
    } else {
      api.getWords(+group, +page).then((words) => {
        const view = new Audiocall(words);
      });
    }
  });
  btnSprint.addEventListener('click', () => {
    const page = sessionStorage.getItem('page') || '0';
    const group = sessionStorage.getItem('group') || '0';
    const sprintBtn = document.getElementById('sprint') as HTMLElement;
    Controller.removePanels();
    Controller.setActiveMenuItem(sprintBtn);
    if (Controller.isLoggedIn) {
      api.getAllAggregatedUserWords(api.userId, group, page, '20').then((words) => {
        const view = new SprintStart(words);
      });
    } else {
      api.getWords(+group, +page).then((words) => {
      const view = new SprintStart(words);
      });
    }
  });
}

export default function createGamePanel() {
  const gamePanel = document.createElement('ul');
  gamePanel.classList.add('collection', 'game-panel');
  gamePanel.innerHTML = `
    <button class="btn cyan darken-1 btn-audiocall">
      <i class="material-icons">music_note</i>
    </button>
    <button class="btn cyan darken-1 btn-sprint">
      <i class="material-icons">directions_run</i>
    </button>
  `;
  main.prepend(gamePanel);
  activateGameBtns();
}

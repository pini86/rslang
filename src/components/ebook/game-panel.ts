import api from '../../api/api';
import { WORDS_PER_PAGE } from '../../constants/constants';
import Audiocall from '../../pages/audiocall/audiocall';
import state from '../../pages/ebook/state';
import Sprint from '../../pages/sprint/sprint';
import SprintStart from '../../pages/sprint/sprint-start';
import Controller from '../controller/controller';

const main = document.querySelector('main') as HTMLElement;

function activateGameBtns() {
  const btnAudiocall = document.querySelector('.btn-audiocall') as HTMLElement;
  const btnSprint = document.querySelector('.btn-sprint') as HTMLElement;
  btnAudiocall.addEventListener('click', () => {
    const page: number = +(sessionStorage.getItem('page') || '0');
    const group: number = +(sessionStorage.getItem('group') || '0');

    api.getWords(group, page).then((words) => {
      const audiocallBtn = document.getElementById('audiocall') as HTMLElement;
      Controller.removePanels();
      Controller.setActiveMenuItem(audiocallBtn);
      const view = new Audiocall(words);
    });
  });
  btnSprint.addEventListener('click', () => {
    const page: number = +(sessionStorage.getItem('page') || '0');
    const group: number = +(sessionStorage.getItem('group') || '0');
    api.getWords(group, page).then((words) => {
    const sprintBtn = document.getElementById('sprint') as HTMLElement;
      Controller.removePanels();
      Controller.setActiveMenuItem(sprintBtn);
      words.map((word)=>{
      // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        word._id = word.id; 
        return word;
      })
      const view = new SprintStart(words);
    });
  });
}

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
  `;
  main.prepend(gamePanel);
  activateGameBtns();
}

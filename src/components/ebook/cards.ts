import { Difficulty } from '../../interfaces/interfaces';
import api from '../../api/api';
import cardLevels from '../../pages/ebook/card-levels';
import state from '../../pages/ebook/state';
import soundHandler from '../../pages/ebook/sound-handler';
import preloader from './preloader';
import { getUserWordIds, provideDifficulty, updateWordDifficulty, checkLearnedPage } from '../../pages/ebook/helpers';
import setLearnedWordsEbook from "../utils/setLearnedWordsEbook";

const main = document.querySelector('main') as HTMLElement;
const container = main.querySelector('.container') as HTMLElement;
let { curPage, curGroup } = state;

function generateCard(
  group: number,
  id: string,
  image: string,
  word: string,
  transcription: string,
  translation: string,
  textExample: string,
  textTranslate: string,
  meaning: string,
  meaningTranslate: string,
  difficulty: Difficulty
) {
  const btnHard =
    difficulty === 'hard'
      ? `<button id="${id}" class="btn ${cardLevels[group].color} btn-hard disabled">В трудные</button>`
      : `<button id="${id}" class="btn ${cardLevels[group].color} btn-hard">В трудные</button>`;
  const btnLearned =
    difficulty === 'easy'
      ? `<button id="${id}" class="btn ${cardLevels[group].color} btn-to-learn">Из изученных</button>`
      : `<button id="${id}" class="btn ${cardLevels[group].color} btn-learned">Изучено</button>`;

  const userButtons = state.isAuth ? `${btnHard} ${btnLearned}` : '';

  return `
    <div class="row d-flex">
      <div id="${id}" class="col d-flex m10 s12 white card-wrapper ${difficulty}">
        <div class="col image-wrapper">
          <div class="card">
            <div class="card-image z-depth-3">
              <img src=${api.baseUrl}/${image}>
              <div class="card-title">
                <div>
                  <span class="word">${word}</span>
                  <span class="transcription">${transcription}</span>
                </div>
                <span class="translation">(${translation})</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-content d-flex">
          <div class="content-example">
            <p class="content-phrase">${textExample}</p>
            <p class="content-translation grey-text darken-3">${textTranslate}</p>
          </div>
          <div class="content-example">
            <p class="content-phrase">${meaning}</p>
            <p class="content-translation grey-text darken-3">${meaningTranslate}</p>
          </div>
          <div class="card-action">
            <button id="${id}" class="btn ${cardLevels[group].color} btn-listen">
              <i id="${id}" class="material-icons">volume_up</i>
            </button>
            ${userButtons}
          </div>
        </div>
      </div>
    </div>
  `;
}

export default async function renderCards(group?: number, page?: number) {
  container.innerHTML = preloader;
  if (page !== undefined) {
    curPage = page;
  }
  if (group !== undefined) {
    curGroup = group;
  }

  state.isAuth = localStorage.getItem('tokenData');
  state.easyCount = 0;
  const words = await api.getWords(group ?? curGroup, page ?? curPage);
  const userWords = state.isAuth ? await getUserWordIds(words) : [];

  let cardsToRender = '';
  words.forEach((w) => {
    let difficulty: Difficulty = 'normal';
    const {
      id,
      image,
      word,
      transcription,
      wordTranslate,
      textExample,
      textExampleTranslate,
      textMeaning,
      textMeaningTranslate,
    } = w;

    if (state.isAuth) {
      const idIndex = state.userWordIds.indexOf(id);
      if (idIndex !== -1) {
        difficulty = userWords[idIndex].difficulty;
        if (difficulty === 'easy') {
          state.easyCount++;
        }
      }
    }

    cardsToRender += generateCard(
      group ?? curGroup,
      id,
      image,
      word,
      transcription,
      wordTranslate,
      textExample,
      textExampleTranslate,
      textMeaning,
      textMeaningTranslate,
      difficulty
    );
  });

  if (cardsToRender) {
    container.innerHTML = cardsToRender;
  }
  checkLearnedPage(main);
}

function getIdGetCard(el: HTMLElement) {
  const id = el.getAttribute('id') as string;
  const card = container.querySelector(`[id='${id}'].card-wrapper`) as HTMLElement;
  return {
    id,
    card,
  };
}

container.addEventListener('click', async (e) => {
  const el = e.target as HTMLElement;
  if (el.closest('.btn-listen')) {
    await soundHandler(el);
  } else if (el.classList.contains('btn-hard')) {
    el.classList.add('disabled');
    const { id, card } = getIdGetCard(el);
    const response = await updateWordDifficulty(id, 'hard');
    if (response) {
      card.classList.add('hard');
      card.classList.remove('easy');
      const btnEasy = el.nextElementSibling as HTMLElement;
      if (btnEasy.classList.contains('btn-to-learn')) {
        btnEasy.classList.remove('btn-to-learn');
        btnEasy.classList.add('btn-learned');
        btnEasy.textContent = 'Изучено';
      }
    }
  } else if (el.classList.contains('btn-to-learn')) {
    const { id, card } = getIdGetCard(el);
    card.classList.remove('easy');
    state.easyCount--;
    setLearnedWordsEbook();
    main.classList.remove('learned-page');
    await updateWordDifficulty(id, 'normal');

  } else if (el.classList.contains('btn-learned')) {
    const { id, card } = getIdGetCard(el);
    card.classList.add('easy');
    card.classList.remove('hard');
    card.querySelector('.btn-hard')?.classList.remove('disabled');
    state.easyCount++;
    setLearnedWordsEbook();
    checkLearnedPage(main);
    await updateWordDifficulty(id, 'easy');

  } else if (el.classList.contains('btn-hard-remove')) {
    const { id, card } = getIdGetCard(el);
    const response = await api.updateUserWord(id, provideDifficulty('normal', id));
    if (response) {
      const parent = card.parentElement as HTMLElement;
      parent.remove();
      if (!container.children.length) {
        container.innerHTML =
          '<h5 class="center-align">Сложные слова отсутствуют в вашем словаре.</h5>';
      }
    }
  }
});

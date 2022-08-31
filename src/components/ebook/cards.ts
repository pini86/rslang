import { IWord } from '../../interfaces/interfaces';
import api from '../../api/api';
import cardLevels from '../../pages/ebook/card-levels';
import state from '../../pages/ebook/state';
import soundHandler from '../../pages/ebook/sound-handler';
import preloader from './preloader';

const { baseUrl } = api;
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
  difficulty: string
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
              <img src=${baseUrl}/${image}>
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

async function getUserWordIds(words: IWord[]) {
  const allUserWords = await api.getAllUserWords();
  const userWords = allUserWords.filter(word => words.map(w => w.id).includes(word.wordId));
  const userWordIds = userWords.map(word => word.wordId);
  state.userWordIds = userWordIds;
  return userWords;
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
  const words = await api.getWords(group ?? curGroup, page ?? curPage);
  const userWords = state.isAuth ? await getUserWordIds(words) : [];

  let cardsToRender = '';
  words.forEach((w) => {
    let difficulty = 'normal';
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

    const idIndex = state.userWordIds.indexOf(id);
    if (idIndex !== -1) {
      difficulty = userWords[idIndex].difficulty;
      if (difficulty === 'easy') {
        state.easyCount++;
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
}

function provideDifficulty(userDifficulty: string, id: string) {
  return {
    difficulty: userDifficulty,
    optional: { wordId: id },
  };
}

async function updateWordDifficulty(id: string, difficulty: string) {
  if (state.userWordIds.includes(id)) {
    await api.updateUserWord(id, provideDifficulty(difficulty, id));
  } else {
    await api.createUserWord(id, provideDifficulty(difficulty, id));
  }
}

function checkLearnedPage() {
  if (state.easyCount === 20) {
    document.querySelector('active-page')?.classList.add('learned-page');
  }
}

function getIdGetCard(el: HTMLElement) {
  const id = el.getAttribute('id') as string;
  const card = container.querySelector(`[id='${id}'].card-wrapper`) as HTMLElement;
  return {
    id,
    card,
  }
}

container.addEventListener('click', async (e) => {
  const el = e.target as HTMLElement;
  if (el.closest('.btn-listen')) {
    await soundHandler(el);

  } else if (el.classList.contains('btn-hard')) {
    el.classList.add('disabled');
    const { id, card } = getIdGetCard(el);
    card.classList.add('hard');
    card.classList.remove('easy');
    await updateWordDifficulty(id, 'hard');

  } else if (el.classList.contains('btn-to-learn')) {
    el.classList.add('btn-learned');
    el.classList.remove('btn-to-learn');
    el.textContent = 'Изучено';
    const { id, card } = getIdGetCard(el);
    card.classList.remove('easy');
    state.easyCount--;
    await updateWordDifficulty(id, 'normal');

  } else if (el.classList.contains('btn-learned')) {
    el.classList.add('btn-to-learn');
    el.classList.remove('btn-learned');
    el.textContent = 'Из изученных';
    const { id, card } = getIdGetCard(el);
    card.classList.add('easy');
    card.classList.remove('hard');
    card.querySelector('.btn-hard')?.classList.remove('disabled');
    state.easyCount++;
    checkLearnedPage();
    await updateWordDifficulty(id, 'easy');

  } else if (el.classList.contains('btn-hard-remove')) {
    const { id, card } = getIdGetCard(el);
    card.remove();
    await api.updateUserWord(id, provideDifficulty('normal', id));
  }
});

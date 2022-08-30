import api from '../../api/api';
import cardLevels from '../../pages/ebook/card-Levels';
import state from '../../pages/ebook/state';
import soundHandler from '../../pages/ebook/sound-handler';
import preloader from './preloader';

const { baseUrl } = api;
const container = document.querySelector('main .container') as HTMLElement;
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
  meaningTranslate: string
) {
  return `
    <div class="row d-flex">
      <div class="col d-flex m10 s12 white card-wrapper">
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
            <button id="${id}" class="btn ${cardLevels[group].color} btn-hard">В трудные</button>
            <button id="${id}" class="btn ${cardLevels[group].color} btn-learned">Изучено</button>
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

  const words = await api.getWords(group ?? curGroup, page ?? curPage);

  let cardsToRender = '';
  words.forEach((w) => {
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
      textMeaningTranslate
    );
  });

  if (words) {
    container.innerHTML = cardsToRender;
  }
}

container.addEventListener('click', async (e) => {
  const el = e.target as HTMLElement;
  if (el.closest('.btn-listen')) {
    soundHandler(el);
  }
});

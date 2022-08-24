import api from '../../../api/api';
import cardLevels from '../card-Levels';
import state from '../state';

const BASE = 'https://rs-lang-rsschool-task.herokuapp.com';
const container = document.querySelector('main .container') as HTMLElement;
const { curPage, curGroup } = state;

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
              <img src=${BASE}/${image}>
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
              <i class="material-icons">volume_up</i>
            </button>
            <button id="${id}" class="btn ${cardLevels[group].color} btn-hard">В трудные</button>
            <button id="${id}" class="btn ${cardLevels[group].color} btn-remove-hard disabled">Из трудных</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default async function renderCards(group?: number, page?: number) {
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

  container.innerHTML = cardsToRender;
}

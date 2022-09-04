import { Difficulty } from '../../interfaces/interfaces';
import api from '../../api/api';
import cardLevels from '../../pages/ebook/card-levels';
import state from '../../pages/ebook/state';
import preloader from './preloader';

const { baseUrl } = api;
const container = document.querySelector('main .container') as HTMLElement;
const group = cardLevels.length - 1;

function generateHardCard(
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
            <button id="${id}" class="btn ${cardLevels[group].color} btn-hard-remove">Убрать из трудных</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default async function renderDifficultCards() {
  container.innerHTML = preloader;

  state.isAuth = localStorage.getItem('tokenData');
  state.curGroup = group;
  const words = state.isAuth ? await api.getAggregatedDifficulties('all') : [];
  const wordIds = words.map(word => word.userWord?.optional.wordId) as string[];

  let cardsToRender = '';
  words.forEach((w, i) => {
    const {
      image,
      word,
      transcription,
      wordTranslate,
      textExample,
      textExampleTranslate,
      textMeaning,
      textMeaningTranslate,
    } = w;

    cardsToRender += generateHardCard(
      wordIds[i],
      image,
      word,
      transcription,
      wordTranslate,
      textExample,
      textExampleTranslate,
      textMeaning,
      textMeaningTranslate,
      'hard'
    );
  });

  if (cardsToRender) {
    container.innerHTML = cardsToRender;
  } else if (!cardsToRender && !state.isAuth) {
    container.innerHTML = '<h5 class="center-align">Авторизуйтесь чтобы добавлять сюда сложные слова.</h5>';
  } else if (!cardsToRender) {
    container.innerHTML = '<h5 class="center-align">Сложные слова отсутствуют в вашем словаре.</h5>';
  }
}

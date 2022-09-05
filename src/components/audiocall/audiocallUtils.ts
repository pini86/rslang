import { IWord } from '../../interfaces/interfaces';
import Audiocall from '../../pages/audiocall/audiocall';
import AudioCall from './audiocall';

export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getRandomArrElem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomNumber(max: number, min: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function colorCorrectElement(el: HTMLElement): void {
  el.classList.add('green');
}

export function colorIncorrectElement(el: HTMLElement): void {
  el.classList.add('red');
}

export function disableBtnStyles(btns: NodeListOf<HTMLElement>) {
  btns.forEach((elem) => {
    const btn = elem;
    btn.style.cursor = 'auto';
  });
}

export function getUserSelectedLevel(): number {
  let selectedLevel = 0;
  const levelsContainer = document.querySelector('.audiocall__levels') as HTMLElement;
  const levels = document.querySelectorAll('.audiocall__level') as NodeListOf<HTMLElement>;

  levelsContainer.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('audiocall__level')) {
      levels.forEach((level) => level.classList.remove('active'));
      target.classList.add('active');
      switch (target.innerText) {
        case 'A2':
          selectedLevel = 1;
          break;
        case 'B1':
          selectedLevel = 2;
          break;
        case 'B2':
          selectedLevel = 3;
          break;
        case 'C1':
          selectedLevel = 4;
          break;
        case 'C2':
          selectedLevel = 5;
          break;
        default:
          selectedLevel = 0;
      }
    }
  });
  return selectedLevel;
}

// eslint-disable-next-line consistent-return
export async function playAudio(): Promise<void> {
  AudioCall.audio.onplaying = () => {
    AudioCall.isAudioPlaying = true;
  };
  AudioCall.audio.onpause = () => {
    AudioCall.isAudioPlaying = false;
  };
  if (AudioCall.audio.paused && !AudioCall.isAudioPlaying) {
    return AudioCall.audio.play();
  }
}

export async function pauseAudio(): Promise<void> {
  if (!AudioCall.audio.paused && AudioCall.isAudioPlaying) {
    AudioCall.audio.pause();
  }
}

export function displayWords(wordsInRound: IWord[]) {
  const wordsContainer = document.querySelector('.audiocall__words') as HTMLElement;
  wordsContainer.innerHTML = '';

  for (let i = 0; i < wordsInRound.length; i++) {
    const displayedWord = `<button class="audiocall__word waves-effect waves-light btn"><span class="word__number">${
      i + 1
    }</span><span class="word__text">${wordsInRound[i].wordTranslate}</span></button>`;
    wordsContainer.innerHTML += displayedWord;
  }
}

export function showGameStyles(mainWord: IWord): void {
  const image = document.querySelector('.audiocall__word-image') as HTMLImageElement;
  image.style.display = 'block';

  const wordsBtns = document.querySelectorAll('.audiocall__word') as NodeListOf<HTMLElement>;
  disableBtnStyles(wordsBtns);

  const words = Array.from(wordsBtns);
  const correctWord = words.find((word) => {
    const text = (word.querySelector('.word__text') as HTMLElement).innerText.toLowerCase();
    return text === mainWord.wordTranslate.toLowerCase();
  }) as HTMLElement;
  colorCorrectElement(correctWord);

  const wordToPlay = document.querySelector('.audiocall__play-word') as HTMLElement;
  wordToPlay.innerHTML = mainWord.word;
  wordToPlay.style.display = 'block';
}

export function activateNextAudiocallBtn() {
  const playAgainBtn = document.querySelector('.next__play') as HTMLElement;
  playAgainBtn.addEventListener('click', () => {
    const view = new Audiocall();
  });
}

export function activatePlayAudioBtns(gameWords: IWord[]): void {
  const words = document.querySelectorAll('.word-item') as NodeListOf<HTMLElement>;
  words.forEach((word) => {
    word.addEventListener('click', () => {
      const textWord = (word.querySelector('.word-item__word') as HTMLElement).innerText;
      const wordCard = gameWords.find((el) => el.word === textWord) as IWord;
      const audioUrl = `https://react-learnwords-example.herokuapp.com/${wordCard.audio}`;
      const audio = new Audio(audioUrl);
      audio.play();
    });
  });
}

import { IWord, Difficulty } from '../../interfaces/interfaces';
import { WORDS_PER_PAGE } from '../../constants/constants';
import api from '../../api/api';
import Controller from '../../components/controller/controller';
import state from './state';

export async function getUserWordIds(words: IWord[]) {
  const allUserWords = await api.getAllUserWords();
  const userWords = allUserWords.filter((word) => words.map((w) => w.id).includes(word.wordId));
  const userWordIds = userWords.map((word) => word.wordId);
  state.userWordIds = userWordIds;
  return userWords;
}

export function provideDifficulty(userDifficulty: Difficulty, id: string) {
  return {
    difficulty: userDifficulty,
    optional: { wordId: id },
  };
}

export async function updateWordDifficulty(id: string, difficulty: Difficulty) {
  if (state.userWordIds.includes(id)) {
    const response = await api.updateUserWord(id, provideDifficulty(difficulty, id));
    return response;
  }

  const response = await api
    .createUserWord(id, provideDifficulty(difficulty, id))
    .then(() => state.userWordIds.push(id));
  return response;
}

export function checkLearnedPage(main: HTMLElement) {
  if (state.easyCount === WORDS_PER_PAGE) {
    main.classList.add('learned-page');
    Controller.toggleGameActivation(false);
  } else {
    Controller.toggleGameActivation();
  }
}

export function removeLearnedPage(main: HTMLElement) {
  main.classList.remove('learned-page');
  state.easyCount = 0;
}

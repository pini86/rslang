import { IWord, Difficulty } from '../../interfaces/interfaces';
import api from '../../api/api';
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
    await api.updateUserWord(id, provideDifficulty(difficulty, id));
  } else {
    await api.createUserWord(id, provideDifficulty(difficulty, id));
  }
}

export function checkLearnedPage(main: HTMLElement) {
  if (state.easyCount === 20) {
    main.classList.add('learned-page');
  }
}

export function removeLearnedPage(main: HTMLElement) {
  main.classList.remove('learned-page');
  state.easyCount = 0;
}

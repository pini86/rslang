export interface IWord {
  id: string;
  _id?: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord?: IUserWord;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserTokens {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IUserWord {
  difficulty: string;
  optional: {
    correctCount: number;
    totalIncorrectCount: number;
    totalCorrectCount: number;
  };
}

export interface IUserStatistics {
  id?: string;
  learnedWords: number;
  optional: {
    audiocall: {
      correctWords: number,
      incorrectWords: number,
      streak: number,
      newWords: number
    },
    sprint: {
      correctWords: number,
      incorrectWords: number,
      streak: number,
      newWords: number
    }
  }
}

export interface ISettings {
  wordsPerDay: number;
  optional: object;
}

export interface ISprintWord {
  word: string;
  wordTranslate: string;
  correct: boolean;
}

export interface IWordData {
  id: string;
  sprintTimer: number;
  sprintStatData: ISprintStatObj;
  updateSprintStatData: (
    correctWord: IWordData | IWord | null,
    incorrectWord: IWordData | IWord | null,
    learnedWord: IWordData | IWord | null,
    streak: number
  ) => void;
  sprintScore: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface ISprintStatObj {
  correctWords: Array<IWordData | IWord>;
  incorrectWords: Array<IWordData | IWord>;
  learnedWords: number;
  maxStreak: number;
}

export interface IAuthObject {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

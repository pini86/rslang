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
  difficulty?: string;
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

export interface IGetUserWord {
  difficulty: string;
  id: string;
  wordId: string;
}

export interface IUserWord {
  difficulty: string;
  optional: {
    correctCount?: number;
    totalIncorrectCount?: number;
    totalCorrectCount?: number;
    wordId?: string;
  };
}

export type TAggregatedObj = [{paginatedResults: IWord[], totalCount: object}];

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

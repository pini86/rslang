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
  difficulty: Difficulty;
  optional: {
    correctCount: number;
    totalIncorrectCount: number;
    totalCorrectCount: number;
  };
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface IUserStatistics {
  id?: string;
  learnedWords: number;
  optional: {
    audiocall: IStatisticsOptional;
    sprint: IStatisticsOptional;
  };
}

interface IStatisticsOptional {
  correctWords: number;
  incorrectWords: number;
  streak: number;
  newWords: number;
}

export interface ISettings {
  id?: string;
  wordsPerDay: number;
  optional: {
    learnedWords: number;
    dayStats: { [key: string]: IUserStatistics };
    dayLearnWords: { [key: string]: object | number };
  };
}

export interface ISprintWord {
  word: string;
  wordTranslate: string;
  correct: boolean;
}

export interface IWordData extends IWord {
  sprintTimer: number;
  sprintStatData: ISprintStatObj;
  updateSprintStatData: (
    correctWord: IWordData | IWord | null,
    incorrectWord: IWordData | IWord | null,
    learnedWord: IWordData | IWord | null,
    streak: number
  ) => void;
  sprintScore: string;
}

export interface ISprintStatObj {
  correctWords: IWordData[] | IWord[];
  incorrectWords: IWordData[] | IWord[];
  learnedWords: number;
  maxStreak: number;
}

export interface ISprintResult {
  sprintNewWords: number;
  sprintStatData: ISprintStatObj;
  sprintTimer: number;
  sprintScore: string;
  sprintWordsArray: IWord[];
}

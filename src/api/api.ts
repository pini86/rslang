import Axios, { AxiosError } from 'axios';
import { setupCache, AxiosCacheInstance } from 'axios-cache-interceptor';
import axiosAuth from '../components/authorization/axiosAuthRequests';
import {
  IUserTokens,
  ISettings,
  IUserStatistics,
  IUser,
  IUserWord,
  IWord,
  IAggregatedObj,
  IGetUserWord,
} from '../interfaces/interfaces';

// same object, but with updated typings.
const axios: AxiosCacheInstance = setupCache(Axios);

export enum StatusCodes {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  EXPECTATION_FAILED = 417,
  UNPROCESSABLE_ENTITY = 422,
}

export enum StatusMessages {
  OK = 'Successful operation',
  USER_DELETED = 'The user has been deleted',
  WORD_DELETED = 'The user word has been deleted',
  BAD_REQUEST = 'Bad request',
  INVALID_TOKEN = 'Access token is missing or invalid',
  INVALID_PASSWORD = 'Incorrect e-mail or password',
  USER_NOT_FOUND = 'User not found',
  WORD_NOT_FOUND = "User's word not found",
  STATISTICS_NOT_FOUND = 'Statistics not found',
  SETTINGS_NOT_FOUND = 'Settings not found',
  USER_EXISTS = 'User with this e-mail exists',
}

class API {
  baseUrl = 'https://rs-lang-rsschool-task.herokuapp.com';

  token: string = API.initializeToken();

  userId: string = API.initializeId();

  private users = `${this.baseUrl}/users`;

  private signin = `${this.baseUrl}/signin`;

  private words = `${this.baseUrl}/words`;

  static initializeToken(): string {
    let localStorageTokenData: IUserTokens | null = null;
    let token = '';
    if (localStorage.getItem('tokenData')) {
      localStorageTokenData = JSON.parse(localStorage.getItem('tokenData') || '');
    }
    if (localStorageTokenData) {
      token = localStorageTokenData.token;
    }
    return token;
  }

  static initializeId(): string {
    let localStorageTokenData: IUserTokens | null = null;
    let id = '';
    if (localStorage.getItem('tokenData')) {
      localStorageTokenData = JSON.parse(localStorage.getItem('tokenData') || '');
    }
    if (localStorageTokenData) {
      id = localStorageTokenData.userId;
    }
    return id;
  }

  /** Get a chunk of words */
  getWords = async (group = 0, page = 0): Promise<IWord[]> | never => {
    const url = `${this.words}?page=${page}&group=${group}`;
    return axios
      .get<IWord[]>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  };

  /**  Get a word with assets by id */
  getWord = async (id: string): Promise<IWord> | never => {
    const url = `${this.words}/${id}`;
    return axios
      .get<IWord>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  };

  /** Create a new user */
  createNewUser = async (newUser: IUser): Promise<IUser> | never => {
    const url = this.users;
    return axios
      .post<IUser>(url, newUser)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          const toastMessage = err.response?.data as string;
          M.toast({ text: `Ошибка при авторизации: ${toastMessage}` });
          throw new Error(StatusMessages.INVALID_PASSWORD);
        } else if (err.response?.status === StatusCodes.EXPECTATION_FAILED) {
          M.toast({ text: `Ошибка при авторизации: ${StatusMessages.USER_EXISTS}` });
          throw new Error(StatusMessages.USER_EXISTS);
        }
        throw err;
      });
  };

  /** Get user by id */
  getUser = async (id = this.userId): Promise<IUser> | never => {
    const url = `${this.users}/${id}`;
    return axiosAuth
      .get<IUser>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.USER_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Update a user */
  updateUser = async (
    email: string,
    password: string,
    id = this.userId
  ): Promise<IUser> | never => {
    const url = `${this.users}/${id}`;
    return axiosAuth
      .put<IUser>(url, {
        email,
        password,
      })
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        }
        throw err;
      });
  };

  /** Delete a user */
  deleteUser = async (id = this.userId): Promise<null> | never => {
    const url = `${this.users}/${id}`;
    return axios
      .delete(url)
      .then(() => null)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.NO_CONTENT) {
          throw new Error(StatusMessages.USER_DELETED);
        }
        throw err;
      });
  };

  /** Get new user tokens */
  getNewIUserTokens = async (
    refreshToken: string,
    id = this.userId
  ): Promise<IUserTokens> | never => {
    const url = `${this.users}/${id}/tokens`;
    return axios
      .get<IUserTokens>(url, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.FORBIDDEN) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        }
        throw err;
      });
  };

  /** Get all user words */
  getAllUserWords = async (id = this.userId): Promise<IGetUserWord[] | never> => {
    const url = `${this.users}/${id}/words`;
    return axiosAuth
      .get<IGetUserWord[]>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.PAYMENT_REQUIRED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        }
        throw err;
      });
  };

  /** Create a user word by id */
  createUserWord = async (
    wordId: string,
    word: IUserWord,
    id = this.userId
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axiosAuth
      .post<IUserWord>(url, word)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        }
        throw err;
      });
  };

  /** Get a user word by id */
  getUserWord = async (wordId: string, id = this.userId): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axiosAuth
      .get<IUserWord>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.WORD_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Update a user word by id */
  updateUserWord = async (
    wordId: string,
    word: IUserWord,
    id = this.userId
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axiosAuth
      .put<IUserWord>(url, word)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        }
        throw err;
      });
  };

  /** Delete a user word by id */
  deleteUserWord = async (wordId: string, id = this.userId): Promise<null> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axiosAuth
      .delete(url)
      .then(() => null)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.NO_CONTENT) {
          throw new Error(StatusMessages.WORD_DELETED);
        }
        throw err;
      });
  };

  /** Gets all words with matched difficulty */
  getAggregatedDifficulties = async (
    group = '0',
    page = '0',
    wordsPerPage = '20',
    filter = 'hard',
    id = this.userId
  ): Promise<IWord[]> | never => {
    let url = `${this.users}/${id}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter={"userWord.difficulty":"${filter}"}`;
    if (group === 'all') {
      url = `${this.users}/${id}/aggregatedWords?filter={"userWord.difficulty":"${filter}"}`;
    }
    return axiosAuth
      .get<[IAggregatedObj]>(url)
      .then((response) => response?.data[0].paginatedResults)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        }
        throw err;
      });
  };

  /** Gets all user aggregated words */
  getAllAggregatedUserWords = async (
    id = this.userId,
    group = '0',
    page = '0',
    wordsPerPage = '20',
    filter = ''
  ): Promise<IWord[]> | never => {
    const url = `${this.users}/${id}/aggregatedWords?&group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`;
    return axiosAuth
      .get<[{ paginatedResults: IWord[] }]>(url)
      .then((response) => response?.data[0].paginatedResults)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        }
        throw err;
      });
  };

  /** Gets user aggregated word by id */
  getAggregatedUserWord = async (wordId: string, id = this.userId): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/aggregatedWords/${wordId}`;
    return axiosAuth
      .get<IUserWord>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.WORD_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Gets statistics */
  getStatistics = async (id = this.userId): Promise<IUserStatistics> | never => {
    const url = `${this.users}/${id}/statistics`;
    return axiosAuth
      .get<IUserStatistics>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.STATISTICS_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Upsert new statistics */
  upsertStatistics = async (
    statistic: IUserStatistics,
    id = this.userId
  ): Promise<IUserStatistics> | never => {
    const url = `${this.users}/${id}/statistics`;
    return axiosAuth
      .put<IUserStatistics>(url, statistic)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        }
        throw err;
      });
  };

  /** Gets settings */
  getSettings = async (id = this.userId): Promise<ISettings> | never => {
    const url = `${this.users}/${id}/settings`;
    return axiosAuth
      .get<ISettings>(url)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.SETTINGS_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Upsert new settings */
  upsertSettings = async (setting: ISettings, id = this.userId): Promise<ISettings> | never => {
    const url = `${this.users}/${id}/settings`;
    return axiosAuth
      .put<ISettings>(url, setting)
      .then((response) => response?.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        }
        throw err;
      });
  };

  /** Sign in */
  signIn = async (email: string, password: string): Promise<IUserTokens> | never => {
    const url = this.signin;
    return axios
      .post<IUserTokens>(url, {
        email,
        password,
      })
      .then((response) => {
        this.token = response?.data.token;
        this.userId = response?.data.userId;
        return response?.data;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.FORBIDDEN) {
          M.toast({ text: `Ошибка при авторизации: ${StatusMessages.INVALID_PASSWORD}` });
          throw new Error(StatusMessages.INVALID_PASSWORD);
        }
        if (err.response?.data) {
          const toastMessage = err.response?.data as string;
          M.toast({ text: `Ошибка при авторизации: ${toastMessage}` });
        }
        throw err;
      });
  };
}

const api = new API();
export default api;

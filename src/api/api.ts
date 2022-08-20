import axios, { AxiosError } from 'axios';
import {
  IUserTokens,
  ISettings,
  IUserStatistics,
  IUser,
  IUserWord,
  IWord,
} from '../components/interfaces/interfaces';

enum StatusCodes {
  err200 = 200,
  err204 = 204,
  err400 = 400,
  err401 = 401,
  err402 = 402,
  err403 = 403,
  err404 = 404,
  err417 = 417,
  err422 = 422,
}

enum StatusMessage {
  OK = 'Successful operation',
  NO_CONTENT = 'The user has been deleted',
  NO_CONTENT_WORD = 'The user word has been deleted',
  BAD_REQUEST = 'Bad request',
  UNAUTHORIZED = 'Access token is missing or invalid',
  UNPROCESSABLE_ENTITY = 'Incorrect e-mail or password',
  NOT_FOUND = 'User not found',
  WORD_NOT_FOUND = 'User\'s word not found',
  STATISTICS_NOT_FOUND = 'Statistics not found',
  SETTINGS_NOT_FOUND = 'Settings not found',
  EXPECTATION_FAILED = 'User with this e-mail exists'
}

class API {
  baseUrl = 'https:rs-lang-rsschool-task.herokuapp.com';

  token!: string;

  userId!: string;

  private users = `${this.baseUrl}/users`;

  private signin = `${this.baseUrl}/signin`;

  private words = `${this.baseUrl}/words`;

  /** Get a chunk of words */
  getWords = async (group = 0, page = 0): Promise<IWord[]> | never => {
    const url = `${this.words}?page=${page}&group=${group}`;
    return axios
      .get(url)
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  };

  /**  Get a word with assets by id */
  getWord = async (id: string): Promise<IWord> | never => {
    const url = `${this.words}/${id}`;
    return axios
      .get(url)
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  };

  /** Create a new user */
  createNewUser = async (newUser: IUser): Promise<IUser> | never => {
    const url = this.users;
    return axios
      .post(url, newUser)
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err422) {
          throw new Error(StatusMessage.UNPROCESSABLE_ENTITY);
        } else if (err.response?.status === StatusCodes.err417) {
          throw new Error(StatusMessage.EXPECTATION_FAILED);
        }
        throw err;
      });
  };

  /** Get user by id */
  getUser = async (id = this.userId): Promise<IUser> | never => {
    const url = `${this.users}/${id}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        } else if (err.response?.status === StatusCodes.err404) {
          throw new Error(StatusMessage.NOT_FOUND);
        }
        throw err;
      });
  };

  /** Update a user */
  updateUser = async (
    email: string,
    password: string,
    id = this.userId,
  ): Promise<IUser> | never => {
    const url = `${this.users}/${id}`;
    return axios
      .put(
        url,
        {
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err400) {
          throw new Error(StatusMessage.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
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
        if (err.response?.status === StatusCodes.err204) {
          throw new Error(StatusMessage.NO_CONTENT);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Get new user tokens */
  getNewIUserTokens = async (id = this.userId): Promise<IUserTokens> | never => {
    const url = `${this.users}/${id}/tokens`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err403) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Get all user words */
  getAllUserWords = async (id = this.userId): Promise<IUserWord[]> | never => {
    const url = `${this.users}/${id}/words`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err402) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Create a user word by id */
  createUserWord = async (
    wordId: string,
    word: IUserWord,
    id = this.userId,
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .post(url, word, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err400) {
          throw new Error(StatusMessage.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Get a user word by id */
  getUserWord = async (
    wordId: string,
    id = this.userId,
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        } else if (err.response?.status === StatusCodes.err404) {
          throw new Error(StatusMessage.WORD_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Update a user word by id */
  updateUserWord = async (
    wordId: string,
    word: IUserWord,
    id = this.userId,
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .put(url, word, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err400) {
          throw new Error(StatusMessage.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Delete a user word by id */
  deleteUserWord = async (
    wordId: string,
    id = this.userId,
  ): Promise<null> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .delete(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then(() => null)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err204) {
          throw new Error(StatusMessage.NO_CONTENT_WORD);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
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
    filter = '',
  ): Promise<IWord[]> | never => {
    const url = `${this.users}/${id}/aggregatedWords?&group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err200) {
          throw new Error(StatusMessage.OK);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Gets user aggregated word by id */
  getAggregatedUserWord = async (
    wordId: string,
    id = this.userId,
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/aggregatedWords/${wordId}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err200) {
          throw new Error(StatusMessage.OK);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        } else if (err.response?.status === StatusCodes.err404) {
          throw new Error(StatusMessage.WORD_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Gets statistics */
  getStatistics = async (id = this.userId): Promise<IUserStatistics> | never => {
    const url = `${this.users}/users/${id}/statistics`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err200) {
          throw new Error(StatusMessage.OK);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        } else if (err.response?.status === StatusCodes.err404) {
          throw new Error(StatusMessage.STATISTICS_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Upsert new statistics */
  upsertStatistics = async (
    statistic: IUserStatistics,
    id = this.userId,
  ): Promise<IUserStatistics> | never => {
    const url = `${this.users}/users/${id}/statistics`;
    return axios
      .put(url, statistic, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err200) {
          throw new Error(StatusMessage.OK);
        } else if (err.response?.status === StatusCodes.err400) {
          throw new Error(StatusMessage.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Gets settings */
  getSettings = async (id = this.userId): Promise<ISettings> | never => {
    const url = `${this.users}/users/${id}/settings`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err200) {
          throw new Error(StatusMessage.OK);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        } else if (err.response?.status === StatusCodes.err404) {
          throw new Error(StatusMessage.SETTINGS_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Upsert new settings */
  upsertSettings = async (
    setting: ISettings,
    id = this.userId,
  ): Promise<ISettings> | never => {
    const url = `${this.users}/users/${id}/settings`;
    return axios
      .put(url, setting, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err200) {
          throw new Error(StatusMessage.OK);
        } else if (err.response?.status === StatusCodes.err400) {
          throw new Error(StatusMessage.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.err401) {
          throw new Error(StatusMessage.UNAUTHORIZED);
        }
        throw err;
      });
  };

  /** Sign in */
  signIn = async (
    email: string,
    password: string,
  ): Promise<IUserTokens> | never => {
    const url = this.signin;
    return axios
      .post(url, {
        email,
        password,
      })
      .then((response) => {
        this.token = response.data.token;
        this.userId = response.data.userId;
        return response.data;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.err403) {
          throw new Error(StatusMessage.UNPROCESSABLE_ENTITY);
        }
        throw err;
      });
  };
}

const api = new API();
export default api;

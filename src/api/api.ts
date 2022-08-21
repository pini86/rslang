import axios, { AxiosError } from 'axios';
import {
  IUserTokens,
  ISettings,
  IUserStatistics,
  IUser,
  IUserWord,
  IWord,
} from '../interfaces/interfaces';

enum StatusCodes {
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

enum StatusMessages {
  OK = 'Successful operation',
  USER_DELETED = 'The user has been deleted',
  WORD_DELETED = 'The user word has been deleted',
  BAD_REQUEST = 'Bad request',
  INVALID_TOKEN = 'Access token is missing or invalid',
  INVALID_PASSWORD = 'Incorrect e-mail or password',
  USER_NOT_FOUND = 'User not found',
  WORD_NOT_FOUND = 'User\'s word not found',
  STATISTICS_NOT_FOUND = 'Statistics not found',
  SETTINGS_NOT_FOUND = 'Settings not found',
  USER_EXISTS = 'User with this e-mail exists'
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
      .get<IWord[]>(url)
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  };

  /**  Get a word with assets by id */
  getWord = async (id: string): Promise<IWord> | never => {
    const url = `${this.words}/${id}`;
    return axios
      .get<IWord>(url)
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        throw err;
      });
  };

  /** Create a new user */
  createNewUser = async (newUser: IUser): Promise<IUser> | never => {
    const url = this.users;
    return axios
      .post<IUser>(url, newUser)
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
          throw new Error(StatusMessages.INVALID_PASSWORD);
        } else if (err.response?.status === StatusCodes.EXPECTATION_FAILED) {
          throw new Error(StatusMessages.USER_EXISTS);
        }
        throw err;
      });
  };

  /** Get user by id */
  getUser = async (id = this.userId): Promise<IUser> | never => {
    const url = `${this.users}/${id}`;
    return axios
      .get<IUser>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.USER_NOT_FOUND);
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
      .put<IUser>(
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
        if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
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
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        }
        throw err;
      });
  };

  /** Get new user tokens */
  getNewIUserTokens = async (id = this.userId): Promise<IUserTokens> | never => {
    const url = `${this.users}/${id}/tokens`;
    return axios
      .get<IUserTokens>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.FORBIDDEN) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        }
        throw err;
      });
  };

  /** Get all user words */
  getAllUserWords = async (id = this.userId): Promise<IUserWord[]> | never => {
    const url = `${this.users}/${id}/words`;
    return axios
      .get<IUserWord[]>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
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
    id = this.userId,
  ): Promise<IUserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .post<IUserWord>(url, word, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
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
      .get<IUserWord>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.WORD_NOT_FOUND);
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
      .put<IUserWord>(url, word, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
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
        if (err.response?.status === StatusCodes.NO_CONTENT) {
          throw new Error(StatusMessages.WORD_DELETED);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
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
      .get<IWord[]>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
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
      .get<IUserWord>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.WORD_NOT_FOUND);
        }
        throw err;
      });
  };

  /** Gets statistics */
  getStatistics = async (id = this.userId): Promise<IUserStatistics> | never => {
    const url = `${this.users}/users/${id}/statistics`;
    return axios
      .get<IUserStatistics>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.STATISTICS_NOT_FOUND);
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
      .put<IUserStatistics>(url, statistic, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        }
        throw err;
      });
  };

  /** Gets settings */
  getSettings = async (id = this.userId): Promise<ISettings> | never => {
    const url = `${this.users}/users/${id}/settings`;
    return axios
      .get<ISettings>(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
        } else if (err.response?.status === StatusCodes.NOT_FOUND) {
          throw new Error(StatusMessages.SETTINGS_NOT_FOUND);
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
      .put<ISettings>(url, setting, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.OK) {
          throw new Error(StatusMessages.OK);
        } else if (err.response?.status === StatusCodes.BAD_REQUEST) {
          throw new Error(StatusMessages.BAD_REQUEST);
        } else if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          throw new Error(StatusMessages.INVALID_TOKEN);
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
      .post<IUserTokens>(url, {
        email,
        password,
      })
      .then((response) => {
        this.token = response.data.token;
        this.userId = response.data.userId;
        return response.data;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === StatusCodes.FORBIDDEN) {
          throw new Error(StatusMessages.INVALID_PASSWORD);
        }
        throw err;
      });
  };
}

const api = new API();
export default api;

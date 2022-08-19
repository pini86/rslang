import axios from 'axios';
import {
  Auth,
  Settings,
  Statistics,
  User,
  UserWord,
  Word,
} from '../interfaces/interfaces';

class API {
  baseUrl = 'https://rs-lang-rsschool-task.herokuapp.com';

  token!: string;

  userId!: string;

  private users = `${this.baseUrl}/users`;

  private signin = `${this.baseUrl}/signin`;

  private words = `${this.baseUrl}/words`;

  // Get a chunck of words
  getWords = async (group = 0, page = 0): Promise<[Word]> | never => {
    const url = `${this.words}?page=${page}&group=${group}`;
    return axios
      .get(url)
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  };

  // Get a word with assets by id
  getWord = async (id: string): Promise<Word> | never => {
    const url = `${this.words}/${id}`;
    return axios
      .get(url)
      .then((response) => response.data)
      .catch((err) => {
        throw err;
      });
  };

  // Create a new user
  createNewUser = async (userNew: User): Promise<User> | never => {
    const url = this.users;
    return axios
      .post(url, userNew)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 422) {
          throw new Error('Incorrect e-mail or password');
        } else if (err.response?.status === 417) {
          throw new Error('user with this e-mail exists');
        }
        throw err;
      });
  };

  // Get user by id
  getUser = async (id = this.userId): Promise<User> | never => {
    const url = `${this.users}/${id}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        } else if (err.response?.status === 404) {
          throw new Error('User not found');
        }
        throw err;
      });
  };

  // Update a user
  updateUser = async (
    email: string,
    password: string,
    id = this.userId,
  ): Promise<User> | never => {
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
      .catch((err) => {
        if (err.response?.status === 400) {
          throw new Error('Bad request');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Delete a user
  deleteUser = async (id = this.userId): Promise<null> | never => {
    const url = `${this.users}/${id}`;
    return axios
      .delete(url)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 204) {
          throw new Error('The user has been deleted');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Get new user tokens
  getNewUserTokens = async (id = this.userId): Promise<Auth> | never => {
    const url = `${this.users}/${id}/tokens`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 403) {
          throw new Error('Access token is missing, expired or invalid');
        }
        throw err;
      });
  };

  // Get all user words
  getAllUserWords = async (id = this.userId): Promise<[UserWord]> | never => {
    const url = `${this.users}/${id}/words`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 402) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Create a user word by id
  createUserWord = async (
    wordId: string,
    word: UserWord,
    id = this.userId,
  ): Promise<UserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .post(url, word, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 400) {
          throw new Error('Bad request');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Get a user word by id
  getUserWord = async (
    wordId: string,
    id = this.userId,
  ): Promise<UserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        } else if (err.response?.status === 404) {
          throw new Error('User`s word not found');
        }
        throw err;
      });
  };

  // Update a user word by id
  updateUserWord = async (
    wordId: string,
    word: UserWord,
    id = this.userId,
  ): Promise<UserWord> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .put(url, word, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 400) {
          throw new Error('Bad request');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Delete a user word by id
  deleteUserWord = async (
    wordId: string,
    id = this.userId,
  ): Promise<null> | never => {
    const url = `${this.users}/${id}/words/${wordId}`;
    return axios
      .delete(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 204) {
          throw new Error('The user word has been deleted');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Gets all user aggregated words
  getAllAggregatedUserWords = async (
    id = this.userId,
    group = '0',
    page = '0',
    wordsPerPage = '20',
    filter = '',
  ): Promise<[Word]> | never => {
    const url = `${this.users}/${id}/aggregatedWords?&group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 200) {
          throw new Error('Successful operation');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Gets user aggregated word by id
  getAggregatedUserWord = async (
    wordId: string,
    id = this.userId,
  ): Promise<UserWord> | never => {
    const url = `${this.users}/${id}/aggregatedWords/${wordId}`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 200) {
          throw new Error('Successful operation');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        } else if (err.response?.status === 404) {
          throw new Error('User`s word not found');
        }
        throw err;
      });
  };

  // Gets statistics
  getStatistics = async (id = this.userId): Promise<Statistics> | never => {
    const url = `${this.users}/users/${id}/statistics`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 200) {
          throw new Error('Successful operation');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        } else if (err.response?.status === 404) {
          throw new Error('User`s word not found');
        }
        throw err;
      });
  };

  // Upsert new statistics
  upsertStatistics = async (
    statistic: Statistics,
    id = this.userId,
  ): Promise<Statistics> | never => {
    const url = `${this.users}/users/${id}/statistics`;
    return axios
      .put(url, statistic, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 200) {
          throw new Error('Successful operation');
        } else if (err.response?.status === 400) {
          throw new Error('Bad request');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Gets settings
  getSettings = async (id = this.userId): Promise<Settings> | never => {
    const url = `${this.users}/users/${id}/settings`;
    return axios
      .get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 200) {
          throw new Error('Successful operation');
        } else if (err.response?.status === 400) {
          throw new Error('Bad request');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Upsert new settings
  upsertSettings = async (
    setting: Settings,
    id = this.userId,
  ): Promise<Settings> | never => {
    const url = `${this.users}/users/${id}/settings`;
    return axios
      .put(url, setting, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response?.status === 200) {
          throw new Error('Successful operation');
        } else if (err.response?.status === 400) {
          throw new Error('Bad request');
        } else if (err.response?.status === 401) {
          throw new Error('Access token is missing or invalid');
        }
        throw err;
      });
  };

  // Sign in
  signIn = async (email: string, password: string): Promise<Auth> | never => {
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
      .catch((err) => {
        if (err.response?.status === 403) {
          throw new Error('Incorrect e-mail or password');
        }
        throw err;
      });
  };
}

const api = new API();
export default api;

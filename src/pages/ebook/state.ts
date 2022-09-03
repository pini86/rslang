import { IState } from '../../interfaces/interfaces';

const state: IState = {
  curPage: +(sessionStorage.getItem('page') ?? '0'),
  curGroup: +(sessionStorage.getItem('group') ?? '0'),
  audioChunk: null,
  isAuth: null,
  userWordIds: [],
  easyCount: 0,
};

export default state;

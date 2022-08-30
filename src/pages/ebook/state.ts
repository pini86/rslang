interface IState {
  curPage: number;
  curGroup: number;
  audioChunk: HTMLAudioElement | null;
  totalPages: number;
  isAuth: string | null;
  userWordIds: string[];
  easyCount: number;
}

const state: IState = {
  curPage: +(sessionStorage.getItem('page') ?? '0'),
  curGroup: +(sessionStorage.getItem('group') ?? '0'),
  audioChunk: null,
  totalPages: 29,
  isAuth: null,
  userWordIds: [],
  easyCount: 0,
};

export default state;

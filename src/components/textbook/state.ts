interface IState {
  curPage: number;
  curGroup: number;
  audioChunk: null | HTMLAudioElement,
  totalPages: number,
}

const state: IState = {
  curPage: +(sessionStorage.getItem('page') ?? '0'),
  curGroup: +(sessionStorage.getItem('group') ?? '0'),
  audioChunk: null,
  totalPages: 29,
};

export default state;

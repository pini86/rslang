const state = {
  curPage: +(sessionStorage.getItem('page') ?? '0'),
  curGroup: +(sessionStorage.getItem('group') ?? '0'),
  totalPages: 29,
};

export default state;

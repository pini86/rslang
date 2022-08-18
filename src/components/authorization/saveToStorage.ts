const EXP_TIME = 14_400_000;

export function saveToken(token: string): void {
  localStorage.setItem('tokenData', JSON.stringify(token));
}
export function saveExpDate(curDate: number){
const expDate = curDate + EXP_TIME;
localStorage.setItem('exp', JSON.stringify(expDate));
}
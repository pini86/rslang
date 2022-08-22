export default function saveToken(token: string): void {
  localStorage.setItem('tokenData', JSON.stringify(token));
}

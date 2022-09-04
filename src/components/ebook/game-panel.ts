const main = document.querySelector('main') as HTMLElement;

export default function createGamePanel() {
  const gamePanel = document.createElement('ul');
  gamePanel.classList.add('collection', 'game-panel');
  gamePanel.innerHTML = `
    <button class="btn cyan darken-1 btn-audiocall">
      <i class="material-icons">music_note</i>
    </button>
    <button class="btn cyan darken-1 btn-sprint">
      <i class="material-icons">directions_run</i>
    </button>
  `
  main.prepend(gamePanel);
}

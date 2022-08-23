import cardLevels from "./card-Levels";

export default function createDiffPanel(main: HTMLElement) {
  const textBookLevels = document.createElement('ul');
  textBookLevels.classList.add('collection', 'textbook-levels');
  const difficultyGroup = sessionStorage.getItem('group');
  let groupNumber = '0';
  let levelsToRender = '';

  if (!difficultyGroup) {
    sessionStorage.setItem('group', '0');
  } else {
    groupNumber = difficultyGroup;
  }

  cardLevels.forEach(({ color, diffClassName }, i) => {
    const isActive = i === +groupNumber ? 'level-active' : '';
    levelsToRender += `
      <li class="collection-item">
        <span class="btn ${color} ${diffClassName} ${isActive}">${diffClassName}</span>
      </li>
    `;
  });

  textBookLevels.innerHTML = levelsToRender;
  main.prepend(textBookLevels);
}

// eslint-disable-next-line import/no-cycle
import SprintStart from './sprint-start';

export default class Sprint {
  mainContent!: HTMLElement;

  sprintView = new SprintStart();

  constructor() {
      this.sprintView = new SprintStart();
  }
}

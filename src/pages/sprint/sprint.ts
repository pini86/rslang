// eslint-disable-next-line import/no-cycle
import { IWord } from '../../interfaces/interfaces';
import SprintStart from './sprint-start';

export default class Sprint {
  mainContent!: HTMLElement;

  sprintView = new SprintStart();

  constructor(wordsFromEbook? : IWord[]) {
    if(wordsFromEbook){
      this.sprintView = new SprintStart(wordsFromEbook);
    } else {
      this.sprintView = new SprintStart();
    }
  }
}

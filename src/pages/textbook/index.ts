import './style.scss';
import createDiffPanel from './difficulty-panel';
import renderCards from './render-cards';

const main = document.querySelector('#textbook') as HTMLElement;

createDiffPanel(main);
renderCards();

import axios from 'axios';
import * as Materialize from '@materializecss/materialize';
import './assets/styles/style.scss';
import { showModals, initializeSidenav } from './components/contentLoaded/materialize';
import { activateForms, activateLogOut } from './components/contentLoaded/dom';

document.addEventListener('DOMContentLoaded', () => {
  showModals();
  activateForms();
  activateLogOut();
  initializeSidenav();
});
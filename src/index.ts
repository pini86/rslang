import axios from 'axios';
import * as Materialize from '@materializecss/materialize';
import './assets/styles/style.scss';
import { showModals, initializeSidenav } from './components/contentLoaded/materialize';
import { activateForms, activateHeaders } from './components/contentLoaded/dom';

document.addEventListener('DOMContentLoaded', () => {
  showModals();
  activateHeaders();
  activateForms();
  initializeSidenav();
});
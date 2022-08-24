import axios from 'axios';
import * as Materialize from '@materializecss/materialize';
import './assets/styles/style.scss';
import activateModals from './components/contentLoaded/materialize';
import { activateForms, activateLogOut } from './components/contentLoaded/dom';
import Controller from './components/controller/controller';

document.addEventListener('DOMContentLoaded', () => {
  activateModals();
  activateForms();
  activateLogOut();
});

const controller = new Controller();
controller.initApp();

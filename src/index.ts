import axios from 'axios';
import * as Materialize from '@materializecss/materialize';

import './assets/styles/style.scss';
import Controller from './components/contrroller/controller';

document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.sidenav') as NodeListOf<HTMLElement>;
  Materialize.Sidenav.init(elems, {});
});

const controller = new Controller();
controller.initApp();
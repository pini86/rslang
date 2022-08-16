import axios from 'axios';
import * as Materialize from '@materializecss/materialize';

import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.sidenav') as NodeListOf<HTMLElement>;
  Materialize.Sidenav.init(elems, {});
});
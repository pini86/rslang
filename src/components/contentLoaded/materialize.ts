import * as Materialize from '@materializecss/materialize';

const modals = document.querySelectorAll('.modal') as NodeListOf<HTMLElement>;

export default function activateModals(): void {
  Materialize.Modal.init(modals, {});
}

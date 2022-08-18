import * as Materialize from '@materializecss/materialize';

const modals = document.querySelectorAll('.modal') as NodeListOf<HTMLElement>;
const authModal = document.querySelector('.auth-modal') as HTMLElement;
export function modalsOn(): void {
  Materialize.Modal.init(modals, {});
}
export function authModalOff(): void {
  const modal = Materialize.Modal.getInstance(authModal);
  modal.close();
}

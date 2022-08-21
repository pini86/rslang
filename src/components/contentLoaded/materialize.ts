import * as Materialize from '@materializecss/materialize';

const modals = document.querySelectorAll('.modal') as NodeListOf<HTMLElement>;
const authModal = document.querySelector('.auth-modal') as HTMLElement;
export function showModals(): void {
  Materialize.Modal.init(modals, {});
}
export function hideAuthModal(): void {
  const modal = Materialize.Modal.getInstance(authModal);
  modal.close();
}

export function initializeSidenav(): void {
  const elems = document.querySelectorAll('.sidenav') as NodeListOf<HTMLElement>;
  Materialize.Sidenav.init(elems, {});
}

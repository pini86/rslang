export default class Authorization {
  mainContent!: HTMLElement;

  constructor() {
    this.mainContent = document.querySelector('main div.container') as HTMLElement;
    this.mainContent.innerHTML = `<div id="modalAuth" class="auth-modal">
    <div class="modal-content">

      <input type="radio" id="register" name="view" class="input-view">
      <input type="radio" id="signin" name="view" checked class="input-view">

      <div id="views">

        <div class="register-view">
          <div class="register-form">
            <div class="input-group">
              <label for="name-reg"><p>Имя пользователя</p></label>
              <input type="text" id="name-reg" required>
            </div>
            <div class="input-group">
              <label for="email-reg"><p>Адрес электронной почты</p></label>
              <input type="email" id="email-reg" required>
            </div>
            <div class="input-group">
              <label for="password-reg"><p>Пароль</p></label>
              <input type="password" minlength="8" id="password-reg" required>
              <span class="error-message"></span>
            </div>
            <div class="modal-footer">
              <button class="waves-effect waves-green btn-flat yellow register-btn">Зарегистрироваться</button>
            </div>
          </div>
        <label for="signin"><p class="auth-header auth-header-log">Уже есть аккаунт? <span class="auth-header-accent">Войти</span></p></label>
        </div>

        <div class="signin-view">
          <div class="login-form">
            <div class="input-group">
              <label for="email-log"><p>Адрес электронной почты</p></label>
              <input type="email" id="email-log" required>
            </div>
            <div class="input-group">
              <label for="password-log"><p>Пароль</p></label>
              <input type="password" minlength="8" id="password-log" required>
              <span class="error-message"></span>
            </div>
            <div class="modal-footer">
              <button class="waves-effect waves-green btn-flat yellow login-btn">Войти</button>
            </div>
          </div>
        <label for="register"><p class="auth-header auth-header-reg">Нет аккаунта? <span class="auth-header-accent">Зарегистрироваться</span></p></label>
        </div>
      </div>
    </div>`;
  }
}
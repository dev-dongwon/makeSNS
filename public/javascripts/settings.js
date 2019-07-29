const SettingsHandler = class {
  constructor() {
    this.completeBtn = document.getElementById('btn-settings');
    this.usernameInput = document.getElementById('input-username');
    this.messageBoxOfUsername = document.getElementById('message-username');

    this.reg = {
      validId : /^[a-z]+[a-z0-9]{3,11}$/,
    }

    this.messages = {
      id : {
        default : `<p style="color : red">username을 입력해주세요</p>`,
        duple : `<p style="color : red">중복된 username이 존재합니다</p>`,
        allowed :`<p style="color : green">사용해도 좋은 username입니다</p>`,
        notValid : `<p style="color : red">username은 4-12자의 숫자와 영문이어야 합니다</p>`
      },
    }

    this.isValidUsernameFlag = false;
  }

  isValidId(id) {
    return this.reg.validId.test(id);
  }

  addCheckDupleUsernameEvent() {
    this.usernameInput.addEventListener('keyup', (event) => {
      this.checkDupleUsername(event);
    })
  }

  async checkDupleUsername(event) {
    const inputValue = this.usernameInput.value;
    const isExistUser = await this.ajax().checkUsernameForAjax(inputValue);

    console.log(isExistUser);
    
    if (inputValue === "") {
      const message = this.messages.id.default;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }

    if (!this.isValidId(inputValue)) {
      const message = this.messages.id.notValid;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }
    
    if (isExistUser) {
      const message = this.messages.id.duple;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }

    const message = this.messages.id.allowed;
    this.messageBoxOfUsername.innerHTML = message;
    this.isValidUsernameFlag = true;
    return;
  }

  updateUserInfoEvent(event) {

  }

  addUpdateUserInfoEvent() {
    this.completeBtn.addEventListener('click', (event) => {
      event.preventDefault();
    })
  }

  ajax() {
    const checkUsernameForAjax = async (inputUsername) => {
      const url = `/check/username/${inputUsername}`;
      const response = await fetch(url, {
        method : 'GET',
      })
      return await response.text();
    }

    return {
      checkUsernameForAjax,
    }
  }

  run() {
    this.addCheckDupleUsernameEvent();
  }
}

window.addEventListener('load', (event) => {
  const settingsHandler= new SettingsHandler();
  settingsHandler.run();
});
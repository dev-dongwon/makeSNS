const SettingsHandler = class {
  constructor() {
    this.completeBtn = document.getElementById('btn-settings');

    this.usernameInput = document.getElementById('input-username');
    this.locationInput = document.getElementById('input-location');
    this.bioInput = document.getElementById('input-bio');
    this.linkInput = document.getElementById('input-link');
    this.userIdentifier = document.getElementById('input-user-origin-identifier');

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
    this.isValidUsernameFlag = false;

    if (inputValue === "") {
      const message = this.messages.id.default;
      this.messageBoxOfUsername.innerHTML = message;
      return;
    }

    const isExistUser = await this.ajax().checkUsernameForAjax(inputValue);

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

  async updateUserInfoEvent(event) {
    const userInfoObj = {
      username : this.usernameInput.value,
      location : this.locationInput.value,
      bio : this.bioInput.value,
      link : this.linkInput.value
    }

    const updatedUser = await this.ajax().updateUserInfoAjax(userInfoObj);
    
    if (updatedUser) {
      location.href = '/'
      return;
    }

    alert('다시 시도해주세요')
  }

  addUpdateUserInfoEvent() {
    this.completeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (!this.isValidUsernameFlag) {
        alert('회원 정보를 정확히 입력해주세요');
        return;
      }
      this.updateUserInfoEvent(event);
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

    const updateUserInfoAjax = async (userInfoObj) => {
      const url = `/users/${this.userIdentifier.value}`;
      const response = await fetch(url, {
        method : 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body : JSON.stringify(userInfoObj)
      })
      return await response.text();
    }

    return {
      checkUsernameForAjax,
      updateUserInfoAjax,
    }
  }

  run() {
    this.addCheckDupleUsernameEvent();
    this.addUpdateUserInfoEvent()
  }
}

window.addEventListener('load', (event) => {
  const settingsHandler= new SettingsHandler();
  settingsHandler.run();
});
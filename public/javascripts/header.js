const HeaderHandler = class {
  constructor() {
  }
  
  ajaxEvent() {
    const logoutAjax = async () => {
      const url = `/auth/logout`;
      const response = await fetch(url, {
        method : 'POST',
      });
      const ajaxText = await response.text(); 
      return ajaxText;
    }
    
    return {
     logoutAjax
    }
  }
  
  addEventLogout() {
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn.addEventListener('click', async (event) => {
      await this.ajaxEvent().logoutAjax();
      location.href = "/";
    })
  }
  
  run() {
    this.addEventLogout();
  }
}

window.addEventListener('load', () => {
  const headerHandler = new HeaderHandler();
  headerHandler.run();
})
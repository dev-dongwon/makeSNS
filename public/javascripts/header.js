const HeaderHandler = class {
  constructor() {
  }
  
  addOpenDrawerMenuEvent() {
    const drawerMenu = document.getElementById('user-drawer-menu');
    const profileDom = document.getElementById('user-profile');

    if (profileDom) {
      profileDom.addEventListener('mouseover', (event) => {
        drawerMenu.style.display = 'block';
      })
  
      profileDom.addEventListener('mouseout', (event) => {
        drawerMenu.style.display = 'none';
      })
    }

    if (profileDom) {
      drawerMenu.addEventListener('mouseover', (event) => {
        drawerMenu.style.display = 'block';
      })
  
      drawerMenu.addEventListener('mouseout', (event) => {
        drawerMenu.style.display = 'none';
      })
    }


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
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (event) => {
        await this.ajaxEvent().logoutAjax();
        location.href = "/";
      })
    }
  }
  
  run() {
    this.addEventLogout();
    this.addOpenDrawerMenuEvent();
  }
}

window.addEventListener('load', () => {
  const headerHandler = new HeaderHandler();
  headerHandler.run();
})
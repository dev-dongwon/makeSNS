const DiscoverHandler = class {
  constructor() {
    this.dateDomArr = document.getElementsByClassName('post-created-time');
    this.displayDateDomArr = document.getElementsByClassName('box-header-time');
    this.trendTabBtn = document.getElementById('discover-order-trend');
    this.recentTabBtn = document.getElementById('discover-order-recent');
  }
  
  calcDate(postDate) {
    const parsedDate = Date.parse(postDate);
    const nowDate = Date.now();
    const gapByMinute = Math.floor((nowDate - parsedDate)/(1000*60));

    if (gapByMinute < 60) {
      return `${gapByMinute} m`
    }

    const gapByHours = Math.floor(gapByMinute / 60);

    if (gapByHours < 24) {
      return `${gapByHours} h`
    }

    const gapByDay = Math.floor(gapByHours / 24);

    if (gapByDay < 7) {
      return `${gapByDay} d`
    }

    const gapByWeek = Math.floor(gapByDay / 7);

    if (gapByWeek < 4) {
      return `${gapByWeek} w` 
    }
  }

  displayTime() {
    const gapTimeArr = [];
    Array.from(this.dateDomArr).forEach((dom) => {
      gapTimeArr.push(this.calcDate(dom.value));
    })

    Array.from(this.displayDateDomArr).forEach((dom, index) => {
      dom.innerHTML = `${gapTimeArr[index]}`
    })
  }

  addGetTrendingPageEvent() {
    this.trendTabBtn.addEventListener('click', (event) => {
      event.target.style.color = 'black';
      this.recentTabBtn.style.color = 'gray';
    })
  }

  addGetRecentPageEvent() {
    this.recentTabBtn.addEventListener('click', (event) => {
      event.target.style.color = 'black';
      this.trendTabBtn.style.color = 'gray';
    })
  }

  addUpdateLikeEvent() {
    const likeBtns = document.getElementsByClassName('box-bottom-like');
    Array.from(likeBtns).forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const contentNumber = event.target.parentNode.firstChild.value;
        const result = await this.ajax().updateLikeStatus(contentNumber);

        if (result === 'notLoggedIn') {
          alert('로그인이 필요한 서비스입니다');
          return;
        }

        if (result === 'unlike') {
          event.target.src = '/images/board/like.png'
          let likeNumber = event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent * 1 - 1;
          event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent = likeNumber;
          likeNumber -= 1;
          return;
        }
        
        if (result === 'like') {
          event.target.src = '/images/board/fill-like.png'
          let likeNumber = event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent * 1 + 1;
          event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent = likeNumber;
          likeNumber += 1;
          return;
        }
      })
    })
  }

  addFollowAndUnfollowEvent() {
    const followBtn = document.getElementsByClassName('box-header-plus');
    const unfollowBtn = document.getElementsByClassName('box-header-unfollow');

    if(followBtn) {
      Array.from(followBtn).forEach((btn) => {
        btn.addEventListener('click', (event) => {
          this.followEvent(event);
        })

        btn.addEventListener('mouseenter', (event) => {
          const statusBadge = event.target.parentNode.getElementsByClassName('follow-status')[0];
          statusBadge.style.display = 'block'
        })

        btn.addEventListener('mouseout', (event) => {
          const statusBadge = event.target.parentNode.getElementsByClassName('follow-status')[0];
          statusBadge.style.display = 'none'
        })
        
      })
    }

    if (unfollowBtn) {
      Array.from(unfollowBtn).forEach((btn) => {
        btn.addEventListener('click', (event) => {
          this.unfollowEvent(event);
        })

        btn.addEventListener('mouseenter', (event) => {
          const statusBadge = event.target.parentNode.getElementsByClassName('follow-status')[0];
          statusBadge.style.display = 'block'
        })

        btn.addEventListener('mouseout', (event) => {
          const statusBadge = event.target.parentNode.getElementsByClassName('follow-status')[0];
          statusBadge.style.display = 'none'
        })
      })
    }
  }
  

  async followEvent(event) {
    const targetBtn = event.target;
    const targetBtnId = targetBtn.id;
    const followUserId = targetBtnId.split('-')[2];
    const statusBadge = targetBtn.parentNode.getElementsByClassName('follow-status')[0];
    const result = await this.ajax().addFollowStatus(followUserId);

    if (result === 'success') {
      targetBtn.src = '/images/board/check.png';
      statusBadge.innerHTML = 'now following'
      statusBadge.style.background = 'green';
    }
  }

  async unfollowEvent(event) {
    const targetBtn = event.target;
    const targetBtnId = targetBtn.id;
    const followUserId = targetBtnId.split('-')[2];
    const statusBadge = targetBtn.parentNode.getElementsByClassName('follow-status')[0];
    const result = await this.ajax().deleteFollowStatus(followUserId);
    
    if (result === 'success') {
      targetBtn.src = '/images/board/plus.svg';
      statusBadge.innerHTML = 'not followed'
      statusBadge.style.background = 'red';
    }
  }

  ajax() {
    const getTrendingPageEvent = async () => {
      const url = `/discover/trending`;
      const response = await fetch(url, {
        method : 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      return await response.json();
    }


    const updateLikeStatus = async (contentsNumber) => {
      const url = `/contents/meta/${contentsNumber}/like`
      const response = await fetch(url, {
        method : 'PATCH'
      })
      return await response.text();
    }

    const addFollowStatus = async (followUserId) => {
      const url = `/api/follow/${followUserId}`
      const response = await fetch(url, {
        method : 'POST'
      })
      return await response.text();
    }

    const deleteFollowStatus = async (followUserId) => {
      const url = `/api/follow/${followUserId}`
      const response = await fetch(url, {
        method : 'DELETE'
      })
      return await response.text();
    }

    return {
      getTrendingPageEvent,
      updateLikeStatus,
      addFollowStatus,
      deleteFollowStatus
    }
  }

  setContentTimeParams() {
    const contentTimes = document.getElementsByClassName('box-header-time');
    const contentLinks = document.getElementsByClassName('disdover-content-link');
    Array.from(contentLinks).forEach((dom, index) => {
      dom.href = `${dom.href}?time=${contentTimes[index].textContent}`
    })
  }


  run() {
    this.displayTime();
    this.addGetTrendingPageEvent();
    this.addGetRecentPageEvent();
    this.setContentTimeParams();
    this.addUpdateLikeEvent();
    this.addFollowAndUnfollowEvent();
  }
}

window.addEventListener('load', () => {
  const discoverHandler = new DiscoverHandler();
  discoverHandler.run();
  new Isotope( '.discover-content', {});
})